import { base64ToUint8Array } from "./audioUtils";

export class AudioPlaybackManager {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private audioSources = new Set<AudioBufferSourceNode>();
  private nextAudioTime = 0;
  private scheduledAudioEndTime = 0;
  private speakingEndTimer: ReturnType<typeof setTimeout> | null = null;
  private speakerEnabled = true;
  private isSpeaking = false;
  private speakingEndNotified = false;

  private audioLevelAnimationFrame: number | null = null;
  private audioLevelHandler: ((level: number) => void) | null = null;
  private lastAudioLevel = 0;

  async initializeAudio(): Promise<void> {
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

  playPcmAudio(base64Audio: string): void {
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

      const bytes = base64ToUint8Array(base64Audio);

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

  startAudioLevelMonitoring(handler?: ((level: number) => void) | null): void {
    if (handler !== undefined) {
      this.audioLevelHandler = handler;
    }

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

  stopAudioLevelMonitoring(): void {
    if (this.audioLevelAnimationFrame !== null) {
      cancelAnimationFrame(this.audioLevelAnimationFrame);
      this.audioLevelAnimationFrame = null;
    }

    this.lastAudioLevel = 0;
    this.audioLevelHandler?.(0);
  }

  stopAllAudio(): void {
    this.clearSpeakingEndTimer();

    for (const source of this.audioSources) {
      try {
        source.stop();
      } catch {
        // Ignore errors if source already stopped
      }
    }
    this.audioSources.clear();

    this.nextAudioTime = this.audioContext?.currentTime ?? 0;
    this.scheduledAudioEndTime = this.nextAudioTime;
  }

  clearSpeakingEndTimer(): void {
    if (this.speakingEndTimer) {
      clearTimeout(this.speakingEndTimer);
      this.speakingEndTimer = null;
    }
  }

  notifySpeakingEndWhenAudioFinishes(onFinish: () => void): void {
    this.clearSpeakingEndTimer();

    if (!this.isSpeaking || !this.audioContext) {
      onFinish();
      return;
    }

    const remainingSeconds = Math.max(
      0,
      this.scheduledAudioEndTime - this.audioContext.currentTime,
    );

    const delayMs = Math.ceil(remainingSeconds * 1000) + 20;

    if (delayMs <= 20) {
      onFinish();
      return;
    }

    this.speakingEndTimer = setTimeout(() => {
      this.speakingEndTimer = null;

      if (!this.isSpeaking) {
        onFinish();
        return;
      }

      if (
        this.audioContext &&
        this.audioContext.currentTime < this.scheduledAudioEndTime
      ) {
        this.notifySpeakingEndWhenAudioFinishes(onFinish);
        return;
      }

      onFinish();
    }, delayMs);
  }

  setSpeakerEnabled(enabled: boolean): void {
    this.speakerEnabled = enabled;

    if (this.gainNode) {
      this.gainNode.gain.value = enabled ? 1 : 0;
    }

    console.log("Gemini speaker:", enabled ? "enabled" : "disabled");
  }

  setAudioLevelHandler(handler: ((level: number) => void) | null): void {
    this.audioLevelHandler = handler;
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  setIsSpeaking(speaking: boolean): void {
    this.isSpeaking = speaking;
  }

  getSpeakingEndNotified(): boolean {
    return this.speakingEndNotified;
  }

  setSpeakingEndNotified(notified: boolean): void {
    this.speakingEndNotified = notified;
  }

  close(): void {
    this.clearSpeakingEndTimer();
    this.stopAudioLevelMonitoring();
    this.audioLevelHandler = null;
    this.isSpeaking = false;
    this.speakingEndNotified = false;

    this.stopAllAudio();

    if (this.audioContext) {
      try {
        void this.audioContext.close();
      } catch {
        // Ignore errors if context already closed
      }
      this.audioContext = null;
      this.gainNode = null;
      this.analyserNode = null;
    }

    this.nextAudioTime = 0;
  }
}

