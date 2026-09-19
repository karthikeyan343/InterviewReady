const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MODEL_NAME = "gemini-3.1-flash-live-preview";

const GEMINI_WS_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";

export interface LiveMessageHandlers {
  onOpen?: () => void | Promise<void>;
  onMessage?: (message: unknown) => void;
  onCandidateSpeechStart?: () => void;
  onInputTranscript?: (text: string) => void;
  onCandidateTurnEnd?: (text: string) => void;
  onOutputTranscript?: (text: string) => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onTurnComplete?: (text: string) => void;
  onAudioLevel?: (level: number) => void;
  onError?: (error: Event | Error) => void;
  onClose?: () => void;
}

class GeminiLiveService {
  private websocket: WebSocket | null = null;

  private audioContext: AudioContext | null = null;

  private gainNode: GainNode | null = null;

  private inputAudioContext: AudioContext | null = null;

  private mediaStreamSource: MediaStreamAudioSourceNode | null = null;

  private inputAudioProcessor: ScriptProcessorNode | null = null;

  private nextAudioTime = 0;

  private audioSources = new Set<AudioBufferSourceNode>();

  private analyserNode: AnalyserNode | null = null;

  private audioLevelAnimationFrame: number | null = null;

  private audioLevelHandler: ((level: number) => void) | null = null;

  private lastAudioLevel = 0;

  private scheduledAudioEndTime = 0;

  private speakingEndTimer: ReturnType<typeof setTimeout> | null = null;

  private speakerEnabled = true;

  private setupCompleted = false;

  private isConnecting = false;

  private isSpeaking = false;

  private turnCompleteReceived = false;

  private setupTimeout: ReturnType<typeof setTimeout> | null = null;

  private microphonePaused = false;

  private outputTranscriptBuffer = "";

  private inputTranscriptBuffer = "";

  private candidateSpeechActive = false;
  private candidateSpeechStartedAt = 0;
  private candidateLastVoiceAt = 0;
  private candidateSilenceTimer: ReturnType<typeof setTimeout> | null = null;
  private candidateTurnEndTimer: ReturnType<typeof setTimeout> | null = null;
  private candidateTurnEndHandler: ((text: string) => void) | null = null;
  private candidateSpeechStartHandler: (() => void) | null = null;
  private candidateTurnFinalized = false;

  private readonly candidateVadThreshold = 0.014;
  private readonly candidateVadSilenceMs = 1100;
  private readonly candidateVadMinSpeechMs = 300;
  private readonly candidateTranscriptFlushMs = 750;

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

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found.");
    }

    this.isConnecting = true;

    try {
      const response = await fetch(
        `${API_BASE_URL}/interviews/${interviewId}/live-token`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      let data: {
        token?: string;
        model?: string;
        interviewId?: string;
        message?: string;
      } = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create Gemini Live session.",
        );
      }

      const ephemeralToken = data.token;

      if (!ephemeralToken) {
        throw new Error("Gemini Live token was not returned.");
      }

      await this.initializeAudio();

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

      this.clearSpeakingEndTimer();

      this.isSpeaking = false;
      this.turnCompleteReceived = false;
      this.microphonePaused = false;
      this.outputTranscriptBuffer = "";
      this.inputTranscriptBuffer = "";
      this.cancelCandidateVad();
      this.candidateTurnEndHandler = handlers.onCandidateTurnEnd ?? null;
      this.candidateSpeechStartHandler = handlers.onCandidateSpeechStart ?? null;
      this.candidateTurnFinalized = false;
      this.scheduledAudioEndTime = 0;
      this.audioLevelHandler = handlers.onAudioLevel ?? null;
      this.stopAudioLevelMonitoring();

      this.clearSetupTimeout();

      const resolveOnce = () => {
        if (settled) {
          return;
        }

        settled = true;

        this.clearSetupTimeout();

        resolve();
      };

      const rejectOnce = (error: Error) => {
        if (settled) {
          return;
        }

        settled = true;

        this.clearSetupTimeout();

        reject(error);
      };

      const websocket = new WebSocket(websocketUrl);

      websocket.binaryType = "blob";

      this.websocket = websocket;

      websocket.onopen = () => {
        console.log("Gemini Live WebSocket connected.");

        const setupMessage = {
          setup: {
            model: `models/${MODEL_NAME}`,
          },
        };

        console.log("Sending Gemini Live setup:", setupMessage);

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
          } catch {}
        }, 10000);
      };

      websocket.onmessage = async (event) => {
        try {
          const rawData = await this.normalizeWebSocketMessage(event.data);

          if (!rawData.trim()) {
            return;
          }

          console.log("Gemini Live raw message:", rawData);

          let message: any;

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
              } catch {}
            }

            return;
          }

          if (message?.sessionResumptionUpdate) {
            console.log(
              "Gemini session resumption update:",
              message.sessionResumptionUpdate,
            );
          }

          const serverContent = message?.serverContent;

          if (!serverContent) {
            return;
          }

          if (serverContent?.interrupted) {
            console.log("Gemini Live generation interrupted.");
            this.clearSpeakingEndTimer();

            for (const source of this.audioSources) {
              try { source.stop(); } catch {}
            }
            this.audioSources.clear();

            this.nextAudioTime = this.audioContext?.currentTime ?? 0;
            this.scheduledAudioEndTime = this.nextAudioTime;
            this.isSpeaking = false;
            this.turnCompleteReceived = false;
            this.outputTranscriptBuffer = "";
            this.stopAudioLevelMonitoring();
            handlers.onSpeakingEnd?.();
          }

          const inputTranscript = serverContent?.inputTranscription?.text;

          if (typeof inputTranscript === "string" && inputTranscript.trim()) {
            this.inputTranscriptBuffer += inputTranscript;

            handlers.onInputTranscript?.(this.inputTranscriptBuffer);
          }

          const outputTranscript = serverContent?.outputTranscription?.text;

          if (typeof outputTranscript === "string" && outputTranscript.trim()) {
            this.outputTranscriptBuffer += outputTranscript;

            handlers.onOutputTranscript?.(this.outputTranscriptBuffer);
          }

          const modelTurnParts = serverContent?.modelTurn?.parts;

          if (
            (modelTurnParts || outputTranscript) &&
            !this.candidateTurnFinalized &&
            this.inputTranscriptBuffer.trim()
          ) {
            this.candidateTurnFinalized = true;
            if (this.candidateTurnEndTimer) {
              clearTimeout(this.candidateTurnEndTimer);
              this.candidateTurnEndTimer = null;
            }
            const answer = this.inputTranscriptBuffer.trim();
            console.log("Candidate turn finalized immediately on model response:", answer);
            this.candidateTurnEndHandler?.(answer);
          }

          if (Array.isArray(modelTurnParts)) {
            let receivedAudio = false;

            for (const part of modelTurnParts) {
              const inlineData = part?.inlineData;

              if (!inlineData) {
                continue;
              }

              const audioData = inlineData?.data;

              if (typeof audioData !== "string" || !audioData) {
                continue;
              }

              console.log("Gemini audio chunk received:", {
                mimeType: inlineData?.mimeType,
                base64Length: audioData.length,
              });

              receivedAudio = true;

              this.playPcmAudio(audioData);
            }

            if (receivedAudio) {
              this.startAudioLevelMonitoring();

              if (!this.isSpeaking) {
                this.clearSpeakingEndTimer();

                this.isSpeaking = true;

                console.log("Gemini is speaking.");

                handlers.onSpeakingStart?.();
              }

              if (this.turnCompleteReceived) {
                this.notifySpeakingEndWhenAudioFinishes(handlers);
              }
            }
          }

          if (serverContent?.turnComplete) {
            console.log(
              "Gemini turn completed. Waiting for scheduled audio to finish.",
            );

            this.turnCompleteReceived = true;

            const completeOutput = this.outputTranscriptBuffer.trim();

            if (completeOutput) {
              handlers.onTurnComplete?.(completeOutput);
            }

            if (this.isSpeaking) {
              this.notifySpeakingEndWhenAudioFinishes(handlers);
            } else {
              this.turnCompleteReceived = false;
              this.outputTranscriptBuffer = "";
            }
          }
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
        console.error("Gemini WebSocket error:", event);

        handlers.onError?.(event);

        rejectOnce(new Error("Gemini Live connection failed."));
      };

      websocket.onclose = (event) => {
        this.clearSetupTimeout();
        this.clearSpeakingEndTimer();

        console.log("Gemini WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });

        this.setupCompleted = false;

        this.isSpeaking = false;
        this.turnCompleteReceived = false;
        this.stopAudioLevelMonitoring();
        this.audioLevelHandler = null;

        this.microphonePaused = false;
        this.outputTranscriptBuffer = "";
        this.inputTranscriptBuffer = "";
        this.cancelCandidateVad();

        if (this.websocket === websocket) {
          this.websocket = null;
        }

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

  private clearSpeakingEndTimer(): void {
    if (this.speakingEndTimer) {
      clearTimeout(this.speakingEndTimer);
      this.speakingEndTimer = null;
    }
  }

  private notifySpeakingEndWhenAudioFinishes(
    handlers: LiveMessageHandlers,
  ): void {
    this.clearSpeakingEndTimer();

    if (!this.isSpeaking) {
      return;
    }

    if (!this.audioContext) {
      this.isSpeaking = false;
      this.turnCompleteReceived = false;
      this.outputTranscriptBuffer = "";
      handlers.onSpeakingEnd?.();
      return;
    }

    const remainingSeconds = Math.max(
      0,
      this.scheduledAudioEndTime - this.audioContext.currentTime,
    );

    const delayMs = Math.ceil(remainingSeconds * 1000) + 20;

    if (delayMs <= 20) {
      this.isSpeaking = false;
      this.turnCompleteReceived = false;
      this.outputTranscriptBuffer = "";
      handlers.onSpeakingEnd?.();
      return;
    }

    this.speakingEndTimer = setTimeout(() => {
      this.speakingEndTimer = null;

      if (!this.isSpeaking) {
        return;
      }

      if (
        this.audioContext &&
        this.audioContext.currentTime < this.scheduledAudioEndTime
      ) {
        this.notifySpeakingEndWhenAudioFinishes(handlers);
        return;
      }

      this.isSpeaking = false;
      this.turnCompleteReceived = false;
      this.stopAudioLevelMonitoring();

      this.outputTranscriptBuffer = "";

      console.log("Gemini realtime audio finished -> Listening.");

      handlers.onSpeakingEnd?.();
    }, delayMs);
  }

  private async normalizeWebSocketMessage(data: unknown): Promise<string> {
    if (typeof data === "string") {
      return data;
    }

    if (data instanceof Blob) {
      return await data.text();
    }

    if (data instanceof ArrayBuffer) {
      return new TextDecoder("utf-8").decode(new Uint8Array(data));
    }

    if (ArrayBuffer.isView(data)) {
      return new TextDecoder("utf-8").decode(
        new Uint8Array(data.buffer, data.byteOffset, data.byteLength),
      );
    }

    throw new Error(
      `Unsupported Gemini WebSocket message type: ${Object.prototype.toString.call(
        data,
      )}`,
    );
  }

  private clearSetupTimeout(): void {
    if (this.setupTimeout) {
      clearTimeout(this.setupTimeout);

      this.setupTimeout = null;
    }
  }

  private async initializeAudio(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });

      this.analyserNode = this.audioContext.createAnalyser();

      this.analyserNode.fftSize = 1024;
      this.analyserNode.smoothingTimeConstant = 0.72;

      this.gainNode = this.audioContext.createGain();

      this.gainNode.gain.value = this.speakerEnabled ? 1 : 0;

      this.analyserNode.connect(this.gainNode);

      this.gainNode.connect(this.audioContext.destination);
    }

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    if (this.audioContext.state !== "running") {
      throw new Error(
        `AudioContext is not running. Current state: ${this.audioContext.state}`,
      );
    }

    this.nextAudioTime = this.audioContext.currentTime;
  }

  private playPcmAudio(base64Audio: string): void {
    if (!this.audioContext || !this.gainNode) {
      console.warn(
        "Cannot play Gemini audio: AudioContext is not initialized.",
      );

      return;
    }

    try {
      if (this.audioContext.state === "suspended") {
        void this.audioContext.resume();
      }

      const bytes = this.base64ToUint8Array(base64Audio);

      if (bytes.byteLength < 2) {
        return;
      }

      const sampleCount = Math.floor(bytes.byteLength / 2);

      if (sampleCount <= 0) {
        return;
      }

      const audioBuffer = this.audioContext.createBuffer(1, sampleCount, 24000);

      const channelData = audioBuffer.getChannelData(0);

      const dataView = new DataView(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength,
      );

      for (let i = 0; i < sampleCount; i++) {
        const sample = dataView.getInt16(i * 2, true);

        channelData[i] = sample / 32768;
      }

      const source = this.audioContext.createBufferSource();

      source.buffer = audioBuffer;

      source.connect(this.analyserNode ?? this.gainNode);

      const currentTime = this.audioContext.currentTime;

      const startTime = Math.max(currentTime + 0.01, this.nextAudioTime);

      source.start(startTime);

      this.nextAudioTime = startTime + audioBuffer.duration;

      this.scheduledAudioEndTime = this.nextAudioTime;

      this.clearSpeakingEndTimer();

      this.audioSources.add(source);

      source.onended = () => {
        this.audioSources.delete(source);
      };

      console.log("Gemini PCM audio scheduled:", {
        sampleCount,
        duration: audioBuffer.duration,
        startTime,
      });
    } catch (error) {
      console.error("Gemini PCM audio playback error:", error);
    }
  }

  private startAudioLevelMonitoring(): void {
    if (
      !this.analyserNode ||
      !this.audioLevelHandler ||
      this.audioLevelAnimationFrame !== null
    ) {
      return;
    }

    const analyser = this.analyserNode;
    const data = new Uint8Array(analyser.fftSize);

    const update = () => {
      this.audioLevelAnimationFrame = requestAnimationFrame(update);

      if (!this.isSpeaking) {
        this.lastAudioLevel *= 0.82;

        if (this.lastAudioLevel < 0.01) {
          this.lastAudioLevel = 0;
        }

        this.audioLevelHandler?.(this.lastAudioLevel);

        return;
      }

      analyser.getByteTimeDomainData(data);

      let sum = 0;

      for (let i = 0; i < data.length; i++) {
        const sample = (data[i] - 128) / 128;
        sum += sample * sample;
      }

      const rms = Math.sqrt(sum / data.length);

      const normalized = Math.min(1, rms * 4.5);

      this.lastAudioLevel = this.lastAudioLevel * 0.65 + normalized * 0.35;

      this.audioLevelHandler?.(this.lastAudioLevel);
    };

    update();
  }

  private stopAudioLevelMonitoring(): void {
    if (this.audioLevelAnimationFrame !== null) {
      cancelAnimationFrame(this.audioLevelAnimationFrame);

      this.audioLevelAnimationFrame = null;
    }

    this.lastAudioLevel = 0;
    this.audioLevelHandler?.(0);
  }

  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = window.atob(base64);

    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
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

    if (!trimmedText) {
      return;
    }

    this.outputTranscriptBuffer = "";
    this.turnCompleteReceived = false;

    this.inputTranscriptBuffer = "";

    const message = {
      realtimeInput: {
        text: trimmedText,
      },
    };

    try {
      this.websocket.send(JSON.stringify(message));

      console.log("Gemini Live control text sent:", trimmedText);
    } catch (error) {
      console.error("Failed to send text to Gemini:", error);
    }
  }

  private cancelCandidateVad(): void {
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

  private sendAudioStreamEnd(): void {
    if (
      !this.websocket ||
      this.websocket.readyState !== WebSocket.OPEN ||
      !this.setupCompleted
    ) {
      return;
    }

    try {
      this.websocket.send(
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

  private finishCandidateTurn(): void {
    this.candidateSpeechActive = false;
    this.microphonePaused = true;
    this.sendAudioStreamEnd();

    if (this.candidateTurnEndTimer) {
      clearTimeout(this.candidateTurnEndTimer);
    }

    this.candidateTurnEndTimer = setTimeout(() => {
      this.candidateTurnEndTimer = null;

      const answer = this.inputTranscriptBuffer.trim();

      if (answer && !this.candidateTurnFinalized) {
        this.candidateTurnFinalized = true;
        console.log("Candidate turn ended:", answer);
        this.candidateTurnEndHandler?.(answer);
      } else if (!answer && !this.isSpeaking) {
        // No speech was detected in the transcript buffer and Gemini is not speaking;
        // resume microphone so candidate can answer.
        console.log("No transcript captured for VAD event. Resuming microphone.");
        this.resumeMicrophone();
      }
    }, this.candidateTranscriptFlushMs);
  }

  private handleInputVadLevel(level: number): void {
    if (this.isSpeaking || this.microphonePaused) {
      return;
    }

    const now = performance.now();
    const isVoice = level >= this.candidateVadThreshold;

    if (isVoice) {
      this.candidateLastVoiceAt = now;

      if (!this.candidateSpeechActive) {
        this.candidateSpeechActive = true;
        this.candidateSpeechStartedAt = now;
        this.candidateTurnFinalized = false;
        this.inputTranscriptBuffer = "";

        console.log("Candidate speech started.");
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

    if (elapsedSpeech < this.candidateVadMinSpeechMs) {
      return;
    }

    if (now - this.candidateLastVoiceAt < this.candidateVadSilenceMs) {
      if (!this.candidateSilenceTimer) {
        this.candidateSilenceTimer = setTimeout(() => {
          this.candidateSilenceTimer = null;
          this.handleInputVadLevel(0);
        }, this.candidateVadSilenceMs);
      }

      return;
    }

    if (this.candidateSilenceTimer) {
      clearTimeout(this.candidateSilenceTimer);
      this.candidateSilenceTimer = null;
    }

    this.finishCandidateTurn();
  }

  async startMicrophone(stream: MediaStream): Promise<void> {
    this.microphonePaused = false;
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      throw new Error("Gemini Live WebSocket is not connected.");
    }

    if (!this.setupCompleted) {
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
        !this.websocket ||
        this.websocket.readyState !== WebSocket.OPEN ||
        !this.setupCompleted ||
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

      const pcmData = this.float32ToInt16(inputData);

      const bytes = new Uint8Array(pcmData.buffer);

      const base64Audio = this.uint8ArrayToBase64(bytes);

      const message = {
        realtimeInput: {
          audio: {
            mimeType: "audio/pcm;rate=16000",
            data: base64Audio,
          },
        },
      };

      try {
        this.websocket.send(JSON.stringify(message));
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
    console.log("Gemini microphone paused.");
  }

  resumeMicrophone(): void {
    if (!this.inputAudioProcessor) {
      console.warn("Gemini microphone pipeline is not active.");
      return;
    }

    this.microphonePaused = false;
    console.log("Gemini microphone resumed.");
  }

  isMicrophonePaused(): boolean {
    return this.microphonePaused;
  }

  stopMicrophone(): void {
    this.microphonePaused = false;
    this.cancelCandidateVad();
    this.inputTranscriptBuffer = "";

    if (this.inputAudioProcessor) {
      this.inputAudioProcessor.onaudioprocess = null;

      try {
        this.inputAudioProcessor.disconnect();
      } catch {}

      this.inputAudioProcessor = null;
    }

    if (this.mediaStreamSource) {
      try {
        this.mediaStreamSource.disconnect();
      } catch {}

      this.mediaStreamSource = null;
    }

    if (this.inputAudioContext) {
      try {
        void this.inputAudioContext.close();
      } catch {}

      this.inputAudioContext = null;
    }

    console.log("Gemini microphone streaming stopped.");
  }

  private float32ToInt16(input: Float32Array): Int16Array {
    const output = new Int16Array(input.length);

    for (let i = 0; i < input.length; i++) {
      const sample = Math.max(-1, Math.min(1, input[i]));

      output[i] = sample < 0 ? sample * 32768 : sample * 32767;
    }

    return output;
  }

  private uint8ArrayToBase64(bytes: Uint8Array): string {
    let binary = "";

    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));

      binary += String.fromCharCode(...chunk);
    }

    return window.btoa(binary);
  }

  setSpeakerEnabled(enabled: boolean): void {
    this.speakerEnabled = enabled;

    if (this.gainNode) {
      this.gainNode.gain.value = enabled ? 1 : 0;
    }

    console.log("Gemini speaker:", enabled ? "enabled" : "disabled");
  }

  disconnect(): void {
    console.log("Disconnecting Gemini Live...");

    this.clearSetupTimeout();
    this.clearSpeakingEndTimer();

    this.stopMicrophone();

    if (this.websocket) {
      try {
        this.websocket.close(1000, "Interview ended");
      } catch {}

      this.websocket = null;
    }

    this.setupCompleted = false;

    this.isConnecting = false;

    this.isSpeaking = false;
    this.turnCompleteReceived = false;
    this.stopAudioLevelMonitoring();
    this.audioLevelHandler = null;

    this.microphonePaused = false;
    this.outputTranscriptBuffer = "";
    this.inputTranscriptBuffer = "";
    this.candidateTurnEndHandler = null;
    this.scheduledAudioEndTime = 0;

    for (const source of this.audioSources) {
      try {
        source.stop();
      } catch {}
    }

    this.audioSources.clear();

    if (this.audioContext) {
      try {
        void this.audioContext.close();
      } catch {}

      this.audioContext = null;

      this.gainNode = null;

      this.analyserNode = null;
    }

    this.nextAudioTime = 0;

    this.analyserNode = null;

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
    this.clearSpeakingEndTimer();
    this.cancelCandidateVad();

    if (this.websocket) {
      try {
        this.websocket.onopen = null;
        this.websocket.onmessage = null;
        this.websocket.onerror = null;
        this.websocket.onclose = null;
        this.websocket.close();
      } catch {}
      this.websocket = null;
    }

    this.setupCompleted = false;
    this.isConnecting = false;
    this.isSpeaking = false;
    this.turnCompleteReceived = false;
    this.microphonePaused = false;
    this.outputTranscriptBuffer = "";
    this.candidateTurnFinalized = false;
    this.stopAudioLevelMonitoring();

    for (const source of this.audioSources) {
      try {
        source.stop();
      } catch {}
    }
    this.audioSources.clear();

    await this.connect(interviewId, handlers);
  }

  isSetupComplete(): boolean {
    return this.setupCompleted;
  }
}

export default GeminiLiveService;
