import {
  CANDIDATE_VAD_THRESHOLD,
  CANDIDATE_VAD_SILENCE_MS,
  CANDIDATE_VAD_MIN_SPEECH_MS,
  CANDIDATE_SAFETY_TIMEOUT_MS,
  type CandidateTurnState,
} from "./types";
import { float32ToInt16, uint8ArrayToBase64 } from "./audioUtils";

export interface CandidateStreamerDependencies {
  sendWebSocketMessage: (msg: string) => void;
  isWebSocketOpen: () => boolean;
  isSetupCompleted: () => boolean;
  getWebSocketReadyState: () => number | undefined;
  isGeminiSpeaking: () => boolean;
}

export class CandidateAudioStreamer {
  private deps: CandidateStreamerDependencies;

  private inputAudioContext: AudioContext | null = null;
  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;
  private inputAudioProcessor: ScriptProcessorNode | null = null;

  private microphonePaused = false;
  private candidateSpeechActive = false;
  private candidateSpeechStartedAt = 0;
  private candidateLastVoiceAt = 0;
  private candidateSilenceTimer: ReturnType<typeof setTimeout> | null = null;
  private candidateTurnEndTimer: ReturnType<typeof setTimeout> | null = null;
  private candidateSafetyTimer: ReturnType<typeof setTimeout> | null = null;

  private candidateTurnEndHandler: ((text: string) => void) | null = null;
  private candidateSpeechStartHandler: (() => void) | null = null;
  private candidateTurnResetHandler: (() => void) | null = null;
  private candidateTranscriptHandler: ((text: string) => void) | null = null;

  private candidateTurnState: CandidateTurnState = "IDLE";
  private finalizedInputTranscript = "";
  private interimInputTranscript = "";
  private modelResponseReceived = false;

  private candidateTraceSpeechStartTime = 0;
  private candidateTraceChunksSentThisTurn = 0;
  private candidateTraceBytesSentThisTurn = 0;
  private candidateTraceTotalChunksSent = 0;
  private candidateTraceTotalBytesSent = 0;

  constructor(deps: CandidateStreamerDependencies) {
    this.deps = deps;
  }

  setHandlers(handlers: {
    onCandidateSpeechStart?: () => void;
    onInputTranscript?: (text: string) => void;
    onCandidateTurnEnd?: (text: string) => void;
    onCandidateTurnReset?: () => void;
  }): void {
    this.candidateSpeechStartHandler = handlers.onCandidateSpeechStart ?? null;
    this.candidateTranscriptHandler = handlers.onInputTranscript ?? null;
    this.candidateTurnEndHandler = handlers.onCandidateTurnEnd ?? null;
    this.candidateTurnResetHandler = handlers.onCandidateTurnReset ?? null;
  }

  async startMicrophone(stream: MediaStream): Promise<void> {
    this.microphonePaused = false;

    if (!this.deps.isWebSocketOpen()) {
      throw new Error("Gemini Live WebSocket is not connected.");
    }

    if (!this.deps.isSetupCompleted()) {
      throw new Error("Gemini Live setup is not complete.");
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error("No microphone audio track is available.");
    }

    this.stopMicrophone();

    const inputContext = new AudioContext({
      sampleRate: 16000,
    });

    this.inputAudioContext = inputContext;

    if (inputContext.state === "suspended") {
      await inputContext.resume();
    }

    if (inputContext.state !== "running") {
      throw new Error(
        `Microphone AudioContext is not running. Current state: ${inputContext.state}`,
      );
    }

    this.mediaStreamSource = inputContext.createMediaStreamSource(stream);
    this.inputAudioProcessor = inputContext.createScriptProcessor(2048, 1, 1);
    this.mediaStreamSource.connect(this.inputAudioProcessor);

    this.inputAudioProcessor.onaudioprocess = (event) => {
      if (
        !this.deps.isWebSocketOpen() ||
        !this.deps.isSetupCompleted() ||
        this.microphonePaused
      ) {
        return;
      }

      const inputData = event.inputBuffer.getChannelData(0);
      if (!inputData.length) {
        return;
      }

      let sumSquares = 0;
      for (let i = 0; i < inputData.length; i += 1) {
        const sample = inputData[i];
        sumSquares += sample * sample;
      }

      const rms = Math.sqrt(sumSquares / inputData.length);
      this.handleInputVadLevel(rms);

      // Gate: Only stream audio to Gemini when actively in a candidate turn phase
      if (
        this.candidateTurnState !== "WAITING_FOR_ANSWER" &&
        this.candidateTurnState !== "SPEAKING"
      ) {
        return;
      }

      const pcmData = float32ToInt16(inputData);
      const bytes = new Uint8Array(pcmData.buffer);
      const base64Audio = uint8ArrayToBase64(bytes);

      this.candidateTraceChunksSentThisTurn += 1;
      this.candidateTraceBytesSentThisTurn += bytes.byteLength;
      this.candidateTraceTotalChunksSent += 1;
      this.candidateTraceTotalBytesSent += bytes.byteLength;

      if (this.candidateTraceChunksSentThisTurn % 10 === 1) {
        console.log(
          `[CandidateAudioTrace] audio chunks sent this turn: ${this.candidateTraceChunksSentThisTurn}, bytes this turn: ${this.candidateTraceBytesSentThisTurn}, total session chunks: ${this.candidateTraceTotalChunksSent}, total session bytes: ${this.candidateTraceTotalBytesSent}, wsReadyState: ${this.deps.getWebSocketReadyState()}`,
        );
      }

      const message = {
        realtimeInput: {
          audio: {
            mimeType: "audio/pcm;rate=16000",
            data: base64Audio,
          },
        },
      };

      try {
        this.deps.sendWebSocketMessage(JSON.stringify(message));
      } catch (error) {
        console.error("Failed to send microphone audio:", error);
      }
    };

    const silentGain = inputContext.createGain();
    silentGain.gain.value = 0;
    this.inputAudioProcessor.connect(silentGain);
    silentGain.connect(inputContext.destination);

    console.log("Gemini microphone streaming started.");
  }

  pauseMicrophone(): void {
    this.microphonePaused = true;
    console.log("[Live Interview] Microphone paused.");
  }

  resumeMicrophone(): void {
    if (!this.inputAudioProcessor) {
      console.warn("[Live Interview] Gemini microphone pipeline is not active.");
      return;
    }

    this.microphonePaused = false;
    console.log("[Live Interview] Microphone resumed.");
  }

  isMicrophonePaused(): boolean {
    return this.microphonePaused;
  }

  stopMicrophone(): void {
    this.microphonePaused = false;
    this.cancelCandidateVad();
    this.finalizedInputTranscript = "";
    this.interimInputTranscript = "";

    if (this.inputAudioProcessor) {
      this.inputAudioProcessor.onaudioprocess = null;
      try {
        this.inputAudioProcessor.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.inputAudioProcessor = null;
    }

    if (this.mediaStreamSource) {
      try {
        this.mediaStreamSource.disconnect();
      } catch {
        // Ignore disconnect errors
      }
      this.mediaStreamSource = null;
    }

    if (this.inputAudioContext) {
      try {
        void this.inputAudioContext.close();
      } catch {
        // Ignore close errors
      }
      this.inputAudioContext = null;
    }

    console.log("Gemini microphone streaming stopped.");
  }

  private handleInputVadLevel(level: number): void {
    if (this.deps.isGeminiSpeaking() || this.microphonePaused) {
      return;
    }

    const now = performance.now();
    const isVoice = level >= CANDIDATE_VAD_THRESHOLD;

    if (isVoice) {
      this.candidateLastVoiceAt = now;

      if (!this.candidateSpeechActive) {
        if (this.candidateTurnState !== "WAITING_FOR_ANSWER") {
          console.log(
            `[CandidateAudioTrace] Candidate speech ignored because system is in state ${this.candidateTurnState} (not WAITING_FOR_ANSWER).`,
          );
          return;
        }

        this.candidateSpeechActive = true;
        this.candidateSpeechStartedAt = now;
        this.candidateTurnState = "SPEAKING";
        this.modelResponseReceived = false;
        this.finalizedInputTranscript = "";
        this.interimInputTranscript = "";
        this.clearCandidateTurnSafetyTimer();
        this.candidateTraceSpeechStartTime = Date.now();
        this.candidateTraceChunksSentThisTurn = 0;
        this.candidateTraceBytesSentThisTurn = 0;

        console.log(
          `[CandidateAudioTrace] CandidateTurnState transitioned to SPEAKING. speechStart timestamp: ${this.candidateTraceSpeechStartTime}, wsReadyState: ${this.deps.getWebSocketReadyState()}`,
        );
        console.log("[Live Interview] Candidate speech started.");
        this.candidateSpeechStartHandler?.();
      }

      if (this.candidateSilenceTimer) {
        clearTimeout(this.candidateSilenceTimer);
        this.candidateSilenceTimer = null;
      }

      return;
    }

    if (!this.candidateSpeechActive) {
      return;
    }

    const elapsedSpeech = now - this.candidateSpeechStartedAt;
    const silenceDuration = now - this.candidateLastVoiceAt;

    if (silenceDuration < CANDIDATE_VAD_SILENCE_MS) {
      if (!this.candidateSilenceTimer) {
        this.candidateSilenceTimer = setTimeout(() => {
          this.candidateSilenceTimer = null;
          this.handleInputVadLevel(0);
        }, CANDIDATE_VAD_SILENCE_MS);
      }

      return;
    }

    if (this.candidateSilenceTimer) {
      clearTimeout(this.candidateSilenceTimer);
      this.candidateSilenceTimer = null;
    }

    if (elapsedSpeech < CANDIDATE_VAD_MIN_SPEECH_MS) {
      console.log(
        `[CandidateAudioTrace] Discarding transient noise (duration: ${Math.round(elapsedSpeech)}ms < ${CANDIDATE_VAD_MIN_SPEECH_MS}ms). Non-destructive reset to WAITING_FOR_ANSWER.`,
      );
      this.cancelCandidateVad();
      this.candidateTurnState = "WAITING_FOR_ANSWER";
      this.candidateTurnResetHandler?.();
      return;
    }

    this.finishCandidateTurn();
  }

  private finishCandidateTurn(): void {
    const speechEndTime = Date.now();
    console.log(
      `[CandidateAudioTrace] CandidateTurnState transitioning to WAITING_FOR_FINAL_TRANSCRIPT. speechEnd timestamp: ${speechEndTime}, durationMs: ${speechEndTime - this.candidateTraceSpeechStartTime}, chunksSentThisTurn: ${this.candidateTraceChunksSentThisTurn}, bytesSentThisTurn: ${this.candidateTraceBytesSentThisTurn}, transcriptBufferLength: ${this.finalizedInputTranscript.length}, wsReadyState: ${this.deps.getWebSocketReadyState()}`,
    );
    this.candidateSpeechActive = false;
    this.microphonePaused = true;
    this.sendAudioStreamEnd();

    if (this.finalizedInputTranscript.trim()) {
      this.tryFinalizeCandidateTurn();
      return;
    }

    this.candidateTurnState = "WAITING_FOR_FINAL_TRANSCRIPT";
    this.clearCandidateTurnSafetyTimer();

    this.candidateSafetyTimer = setTimeout(() => {
      this.candidateSafetyTimer = null;

      if (this.candidateTurnState !== "WAITING_FOR_FINAL_TRANSCRIPT") {
        return;
      }

      const answer = this.finalizedInputTranscript.trim();
      if (answer) {
        this.tryFinalizeCandidateTurn();
        return;
      }

      if (this.deps.isGeminiSpeaking() || this.modelResponseReceived) {
        console.log(
          `[CandidateAudioTrace] Safety timer fired, but Gemini is active (isSpeaking=${this.deps.isGeminiSpeaking()}, modelResponseReceived=${this.modelResponseReceived}). Keeping microphone paused.`,
        );
        return;
      }

      console.log(
        `[CandidateAudioTrace] Safety timer (${CANDIDATE_SAFETY_TIMEOUT_MS}ms) expired with no transcript and model idle. Non-destructive reset to WAITING_FOR_ANSWER and resuming microphone.`,
      );
      this.candidateTurnState = "WAITING_FOR_ANSWER";
      this.resumeMicrophone();
      this.candidateTurnResetHandler?.();
    }, CANDIDATE_SAFETY_TIMEOUT_MS);
  }

  private sendAudioStreamEnd(): void {
    if (!this.deps.isWebSocketOpen() || !this.deps.isSetupCompleted()) {
      return;
    }

    console.log(
      `[CandidateAudioTrace] sendAudioStreamEnd called, wsReadyState=${this.deps.getWebSocketReadyState()}`,
    );

    try {
      this.deps.sendWebSocketMessage(
        JSON.stringify({
          realtimeInput: {
            audioStreamEnd: true,
          },
        }),
      );
      console.log("Gemini candidate audio stream ended.");
    } catch (error) {
      console.error("Failed to send Gemini audioStreamEnd:", error);
    }
  }

  tryFinalizeCandidateTurn(): void {
    if (
      this.candidateTurnState === "ANSWER_FINALIZED" ||
      this.candidateTurnState === "SAVING_ANSWER"
    ) {
      return;
    }

    const answer = this.finalizedInputTranscript.trim();
    if (!answer) {
      return;
    }

    this.candidateTurnState = "ANSWER_FINALIZED";
    this.clearCandidateTurnSafetyTimer();

    console.log(
      `[CandidateAudioTrace] CandidateTurnState transitioned to ANSWER_FINALIZED: candidateTextLength=${answer.length}, answer="${answer.substring(0, 60)}..."`,
    );
    console.log("[Live Interview] Candidate turn finalized:", answer);

    this.candidateTurnEndHandler?.(answer);
  }

  handleInterimTranscript(interimTranscript: string): void {
    if (
      this.candidateTurnState === "WAITING_FOR_ANSWER" ||
      this.candidateTurnState === "SPEAKING" ||
      this.candidateTurnState === "WAITING_FOR_FINAL_TRANSCRIPT"
    ) {
      this.interimInputTranscript = interimTranscript.trim();
      const fullDisplay = this.finalizedInputTranscript
        ? `${this.finalizedInputTranscript} ${this.interimInputTranscript}`
        : this.interimInputTranscript;

      console.log(
        `[CandidateAudioTrace] interim transcription received: length=${interimTranscript.length}`,
      );
      this.candidateTranscriptHandler?.(fullDisplay);
    }
  }

  handleFinalInputTranscript(trimmed: string): void {
    if (
      this.candidateTurnState === "WAITING_FOR_ANSWER" ||
      this.candidateTurnState === "SPEAKING" ||
      this.candidateTurnState === "WAITING_FOR_FINAL_TRANSCRIPT"
    ) {
      this.finalizedInputTranscript = this.finalizedInputTranscript
        ? `${this.finalizedInputTranscript} ${trimmed}`
        : trimmed;
      this.interimInputTranscript = "";

      console.log(
        `[CandidateAudioTrace] final input transcription received: chunkLength=${trimmed.length}, totalFinalizedLength=${this.finalizedInputTranscript.length}, state=${this.candidateTurnState}`,
      );

      this.candidateTranscriptHandler?.(this.finalizedInputTranscript);

      if (
        this.candidateTurnState === "WAITING_FOR_FINAL_TRANSCRIPT" ||
        this.modelResponseReceived
      ) {
        this.tryFinalizeCandidateTurn();
      }
    } else {
      console.log(
        `[CandidateAudioTrace] inputTranscription ignored because candidateTurnState is ${this.candidateTurnState}: "${trimmed}"`,
      );
    }
  }

  handleModelResponseReceived(): void {
    this.modelResponseReceived = true;
    if (
      this.candidateTurnState === "WAITING_FOR_FINAL_TRANSCRIPT" &&
      this.finalizedInputTranscript.trim()
    ) {
      this.tryFinalizeCandidateTurn();
    }
  }

  onGeminiSpeakingEnded(): void {
    this.candidateTurnState = "WAITING_FOR_ANSWER";
    this.modelResponseReceived = false;
    this.finalizedInputTranscript = "";
    this.interimInputTranscript = "";
    this.cancelCandidateVad();
    this.clearCandidateTurnSafetyTimer();

    console.log(
      "[CandidateAudioTrace] Gemini speaking ended. CandidateTurnState transitioned to WAITING_FOR_ANSWER.",
    );
    console.log(
      "[Gemini Live] Speaking ended. Candidate microphone can resume.",
    );
  }

  resetTranscripts(): void {
    this.finalizedInputTranscript = "";
    this.interimInputTranscript = "";
  }

  cancelCandidateVad(): void {
    if (this.candidateSilenceTimer) {
      clearTimeout(this.candidateSilenceTimer);
      this.candidateSilenceTimer = null;
    }

    if (this.candidateTurnEndTimer) {
      clearTimeout(this.candidateTurnEndTimer);
      this.candidateTurnEndTimer = null;
    }

    this.candidateSpeechActive = false;
    this.candidateSpeechStartedAt = 0;
    this.candidateLastVoiceAt = 0;
  }

  clearCandidateTurnSafetyTimer(): void {
    if (this.candidateSafetyTimer) {
      clearTimeout(this.candidateSafetyTimer);
      this.candidateSafetyTimer = null;
    }
  }

  resetForSession(): void {
    this.microphonePaused = false;
    this.finalizedInputTranscript = "";
    this.interimInputTranscript = "";
    this.modelResponseReceived = false;
    this.candidateTurnState = "IDLE";
    this.cancelCandidateVad();
    this.clearCandidateTurnSafetyTimer();
  }

  getCandidateTurnState(): CandidateTurnState {
    return this.candidateTurnState;
  }

  setCandidateTurnState(state: CandidateTurnState): void {
    console.log(
      `[CandidateAudioTrace] CandidateTurnState manually set: ${this.candidateTurnState} -> ${state}`,
    );
    this.candidateTurnState = state;
  }

  getTraceStats(): { totalChunks: number; totalBytes: number } {
    return {
      totalChunks: this.candidateTraceTotalChunksSent,
      totalBytes: this.candidateTraceTotalBytesSent,
    };
  }
}

