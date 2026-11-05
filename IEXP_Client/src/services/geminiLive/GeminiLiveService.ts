import {
  GEMINI_WS_URL,
  type LiveMessageHandlers,
  type CandidateTurnState,
} from "./types";
import { normalizeWebSocketMessage } from "./audioUtils";
import { AudioPlaybackManager } from "./AudioPlaybackManager";
import { CandidateAudioStreamer } from "./CandidateAudioStreamer";
import { fetchLiveToken, buildSetupMessage } from "./geminiLiveSessionApi";
import { handleServerContent, type GeminiServerContent } from "./geminiContentHandler";

interface GeminiLiveIncomingMessage {
  error?: { message?: string; status?: string };
  setupComplete?: unknown;
  sessionResumptionUpdate?: { resumable?: boolean; newHandle?: string };
  serverContent?: GeminiServerContent;
  [key: string]: unknown;
}

export class GeminiLiveService {
  private websocket: WebSocket | null = null;
  private audioPlayback = new AudioPlaybackManager();
  private candidateStreamer: CandidateAudioStreamer;

  private setupCompleted = false;
  private isConnecting = false;
  private turnCompleteReceived = false;
  private setupTimeout: ReturnType<typeof setTimeout> | null = null;
  private outputTranscriptBuffer = "";
  private latestResumptionHandle: string | null = null;

  constructor() {
    this.candidateStreamer = new CandidateAudioStreamer({
      sendWebSocketMessage: (msg: string) => {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
          this.websocket.send(msg);
        }
      },
      isWebSocketOpen: () =>
        this.websocket !== null && this.websocket.readyState === WebSocket.OPEN,
      isSetupCompleted: () => this.setupCompleted,
      getWebSocketReadyState: () => this.websocket?.readyState,
      isGeminiSpeaking: () => this.audioPlayback.getIsSpeaking(),
    });
  }

  async connect(
    interviewId: string,
    handlers: LiveMessageHandlers = {},
  ): Promise<void> {
    if (this.isConnecting) {
      throw new Error("Gemini Live connection is already being established.");
    }

    if (this.isConnected()) {
      console.warn("Gemini Live is already connected.");
      return;
    }

    this.isConnecting = true;

    try {
      const ephemeralToken = await fetchLiveToken(interviewId);
      await this.audioPlayback.initializeAudio();

      const websocketUrl = `${GEMINI_WS_URL}?access_token=${encodeURIComponent(
        ephemeralToken,
      )}`;

      await this.createWebSocket(websocketUrl, handlers);
    } finally {
      this.isConnecting = false;
    }
  }

  private async createWebSocket(
    websocketUrl: string,
    handlers: LiveMessageHandlers,
  ): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      let settled = false;

      this.setupCompleted = false;
      this.audioPlayback.clearSpeakingEndTimer();
      this.audioPlayback.setIsSpeaking(false);
      this.audioPlayback.setSpeakingEndNotified(false);
      this.turnCompleteReceived = false;
      this.outputTranscriptBuffer = "";

      this.candidateStreamer.resetForSession();
      this.candidateStreamer.setHandlers({
        onCandidateSpeechStart: handlers.onCandidateSpeechStart,
        onInputTranscript: handlers.onInputTranscript,
        onCandidateTurnEnd: handlers.onCandidateTurnEnd,
        onCandidateTurnReset: handlers.onCandidateTurnReset,
      });

      this.audioPlayback.stopAudioLevelMonitoring();
      this.clearSetupTimeout();

      const resolveOnce = () => {
        if (settled) return;
        settled = true;
        this.clearSetupTimeout();
        resolve();
      };

      const rejectOnce = (error: Error) => {
        if (settled) return;
        settled = true;
        this.clearSetupTimeout();
        reject(error);
      };

      const websocket = new WebSocket(websocketUrl);
      websocket.binaryType = "blob";
      this.websocket = websocket;

      websocket.onopen = () => {
        console.log("Gemini Live WebSocket connected.");
        const setupMessage = buildSetupMessage(this.latestResumptionHandle);

        if (this.latestResumptionHandle) {
          console.log(
            `[CandidateAudioTrace] Setup includes sessionResumption: ${this.latestResumptionHandle.substring(0, 16)}...`,
          );
        }

        console.log(
          "[CandidateAudioTrace] WebSocket onopen, sending setup:",
          setupMessage,
        );

        try {
          websocket.send(JSON.stringify(setupMessage));
          console.log("Gemini Live setup sent.");
        } catch (error) {
          const setupError =
            error instanceof Error
              ? error
              : new Error("Failed to send Gemini Live setup.");
          rejectOnce(setupError);
          return;
        }

        this.setupTimeout = setTimeout(() => {
          const timeoutError = new Error(
            "Gemini Live setup timed out. setupComplete was not received.",
          );
          console.error(timeoutError.message);
          rejectOnce(timeoutError);
          try {
            websocket.close();
          } catch {
            // Ignore close error on timeout
          }
        }, 10000);
      };

      websocket.onmessage = async (event) => {
        try {
          const rawData = await normalizeWebSocketMessage(event.data);
          if (!rawData.trim()) return;

          console.log("Gemini Live raw message:", rawData);

          let message: GeminiLiveIncomingMessage;
          try {
            message = JSON.parse(rawData);
          } catch (parseError) {
            console.error("Gemini Live JSON parse error:", parseError, rawData);
            return;
          }

          console.log("Gemini Live message:", message);
          handlers.onMessage?.(message);

          if (message?.error) {
            const errorMessage =
              message.error?.message ||
              message.error?.status ||
              "Gemini Live returned an error.";
            const liveError = new Error(errorMessage);
            console.error("Gemini Live server error:", message.error);
            handlers.onError?.(liveError);
            rejectOnce(liveError);
            return;
          }

          if (message?.setupComplete) {
            console.log(
              "[CandidateAudioTrace] setupComplete received:",
              message.setupComplete,
            );
            console.log("Gemini Live setup complete.");

            this.setupCompleted = true;
            this.clearSetupTimeout();

            try {
              await handlers.onOpen?.();
              resolveOnce();
            } catch (error) {
              const openError =
                error instanceof Error
                  ? error
                  : new Error("Failed to initialize live interview.");
              console.error("Gemini Live onOpen error:", openError);
              handlers.onError?.(openError);
              rejectOnce(openError);
              try {
                websocket.close(1011, "Live interview initialization failed");
              } catch {
                // Ignore close error on open failure
              }
            }
            return;
          }

          if (message?.sessionResumptionUpdate) {
            const upd = message.sessionResumptionUpdate;
            if (typeof upd?.newHandle === "string" && upd.newHandle.trim()) {
              this.latestResumptionHandle = upd.newHandle.trim();
            }
            console.log(
              `[CandidateAudioTrace] session resumption handle changes: resumable=${upd?.resumable}, newHandlePrefix=${this.latestResumptionHandle ? this.latestResumptionHandle.substring(0, 16) + "..." : "none"}`,
            );
          }

          const serverContent = message?.serverContent;
          if (!serverContent) return;

          handleServerContent({
            serverContent,
            audioPlayback: this.audioPlayback,
            candidateStreamer: this.candidateStreamer,
            handlers,
            getTurnCompleteReceived: () => this.turnCompleteReceived,
            setTurnCompleteReceived: (val) => {
              this.turnCompleteReceived = val;
            },
            appendOutputTranscript: (chunk) => {
              this.outputTranscriptBuffer += chunk;
            },
            getOutputTranscriptBuffer: () => this.outputTranscriptBuffer,
            onEmitSpeakingEnd: () => this.emitSpeakingEnd(handlers),
          });
        } catch (error) {
          console.error("Gemini message processing error:", error);
          const processingError =
            error instanceof Error
              ? error
              : new Error("Failed to process Gemini Live message.");
          handlers.onError?.(processingError);
        }
      };

      websocket.onerror = (event) => {
        if (this.websocket !== websocket) return;

        console.error("[CandidateAudioTrace] Gemini WebSocket error:", {
          timestamp: new Date().toISOString(),
          readyState: websocket.readyState,
          candidateTurnState: this.candidateStreamer.getCandidateTurnState(),
          latestResumptionHandle: this.latestResumptionHandle
            ? `${this.latestResumptionHandle.substring(0, 16)}...`
            : null,
          event,
        });

        handlers.onError?.(event);
        rejectOnce(new Error("Gemini Live connection failed."));
      };

      websocket.onclose = (event) => {
        if (this.websocket !== websocket) return;

        this.clearSetupTimeout();
        this.audioPlayback.clearSpeakingEndTimer();
        this.candidateStreamer.clearCandidateTurnSafetyTimer();
        this.candidateStreamer.cancelCandidateVad();

        const traceStats = this.candidateStreamer.getTraceStats();
        console.log("[CandidateAudioTrace] Gemini WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          readyState: websocket.readyState,
          timestamp: new Date().toISOString(),
          candidateTurnState: this.candidateStreamer.getCandidateTurnState(),
          latestResumptionHandle: this.latestResumptionHandle
            ? `${this.latestResumptionHandle.substring(0, 16)}...`
            : null,
          totalChunksSent: traceStats.totalChunks,
          totalBytesSent: traceStats.totalBytes,
        });

        this.setupCompleted = false;
        this.audioPlayback.setIsSpeaking(false);
        this.audioPlayback.setSpeakingEndNotified(false);
        this.turnCompleteReceived = false;
        this.audioPlayback.stopAudioLevelMonitoring();

        this.outputTranscriptBuffer = "";
        this.candidateStreamer.resetForSession();

        this.websocket = null;
        handlers.onClose?.();

        if (!settled) {
          rejectOnce(
            new Error(
              event.reason || `Gemini Live connection closed (${event.code}).`,
            ),
          );
        }
      };
    });
  }

  private emitSpeakingEnd(handlers: LiveMessageHandlers): void {
    if (this.audioPlayback.getSpeakingEndNotified()) {
      console.log(
        "[Live Interview] Gemini speaking end skipped because already emitted.",
      );
      return;
    }

    this.audioPlayback.setSpeakingEndNotified(true);
    this.audioPlayback.setIsSpeaking(false);
    this.turnCompleteReceived = false;

    this.candidateStreamer.onGeminiSpeakingEnded();
    this.audioPlayback.clearSpeakingEndTimer();
    this.audioPlayback.stopAudioLevelMonitoring();
    this.outputTranscriptBuffer = "";

    console.log("[Live Interview] Gemini speaking end emitted.");
    handlers.onSpeakingEnd?.();
  }

  private clearSetupTimeout(): void {
    if (this.setupTimeout) {
      clearTimeout(this.setupTimeout);
      this.setupTimeout = null;
    }
  }

  sendText(text: string): void {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.warn("Gemini WebSocket is not open.");
      return;
    }

    if (!this.setupCompleted) {
      console.warn("Gemini Live setup is not complete. Text was not sent.");
      return;
    }

    const trimmedText = text.trim();
    if (!trimmedText) return;

    this.outputTranscriptBuffer = "";
    this.turnCompleteReceived = false;
    this.candidateStreamer.resetTranscripts();

    const message = {
      realtimeInput: {
        text: trimmedText,
      },
    };

    console.log(
      `[CandidateAudioTrace] continuation prompt sent: promptLength=${trimmedText.length}, wsReadyState=${this.websocket?.readyState}`,
    );

    try {
      this.websocket.send(JSON.stringify(message));
      console.log("Gemini Live control text sent:", trimmedText);
    } catch (error) {
      console.error("Failed to send text to Gemini:", error);
    }
  }

  async startMicrophone(stream: MediaStream): Promise<void> {
    return this.candidateStreamer.startMicrophone(stream);
  }

  pauseMicrophone(): void {
    this.candidateStreamer.pauseMicrophone();
  }

  resumeMicrophone(): void {
    this.candidateStreamer.resumeMicrophone();
  }

  isMicrophonePaused(): boolean {
    return this.candidateStreamer.isMicrophonePaused();
  }

  stopMicrophone(): void {
    this.candidateStreamer.stopMicrophone();
  }

  setSpeakerEnabled(enabled: boolean): void {
    this.audioPlayback.setSpeakerEnabled(enabled);
  }

  disconnect(): void {
    console.log("Disconnecting Gemini Live...");

    this.clearSetupTimeout();
    this.audioPlayback.clearSpeakingEndTimer();
    this.candidateStreamer.clearCandidateTurnSafetyTimer();
    this.candidateStreamer.stopMicrophone();

    if (this.websocket) {
      try {
        this.websocket.onopen = null;
        this.websocket.onmessage = null;
        this.websocket.onerror = null;
        this.websocket.onclose = null;
        this.websocket.close(1000, "Interview ended");
      } catch {
        // Ignore close error on disconnect
      }
      this.websocket = null;
    }

    this.candidateStreamer.setHandlers({});
    this.latestResumptionHandle = null;
    this.setupCompleted = false;
    this.isConnecting = false;
    this.turnCompleteReceived = false;
    this.outputTranscriptBuffer = "";

    this.audioPlayback.close();
    this.candidateStreamer.resetForSession();

    console.log("Gemini Live connection closed.");
  }

  isConnected(): boolean {
    return (
      this.websocket !== null &&
      this.websocket.readyState === WebSocket.OPEN &&
      this.setupCompleted
    );
  }

  async reconnect(
    interviewId: string,
    handlers: LiveMessageHandlers = {},
  ): Promise<void> {
    console.log("Reconnecting Gemini Live session...");

    this.clearSetupTimeout();
    this.audioPlayback.clearSpeakingEndTimer();
    this.candidateStreamer.clearCandidateTurnSafetyTimer();
    this.candidateStreamer.cancelCandidateVad();

    if (this.websocket) {
      try {
        this.websocket.onopen = null;
        this.websocket.onmessage = null;
        this.websocket.onerror = null;
        this.websocket.onclose = null;
        this.websocket.close();
      } catch {
        // Ignore close error on reconnect
      }
      this.websocket = null;
    }

    this.setupCompleted = false;
    this.isConnecting = false;
    this.audioPlayback.setIsSpeaking(false);
    this.audioPlayback.setSpeakingEndNotified(false);
    this.turnCompleteReceived = false;
    this.outputTranscriptBuffer = "";
    this.candidateStreamer.resetForSession();
    this.audioPlayback.stopAudioLevelMonitoring();
    this.audioPlayback.stopAllAudio();

    await this.connect(interviewId, handlers);
  }

  isSetupComplete(): boolean {
    return this.setupCompleted;
  }

  getCandidateTurnState(): CandidateTurnState {
    return this.candidateStreamer.getCandidateTurnState();
  }

  setCandidateTurnState(state: CandidateTurnState): void {
    this.candidateStreamer.setCandidateTurnState(state);
  }
}

export default GeminiLiveService;
