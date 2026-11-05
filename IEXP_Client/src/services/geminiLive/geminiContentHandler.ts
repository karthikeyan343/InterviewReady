import type { LiveMessageHandlers } from "./types";
import type { AudioPlaybackManager } from "./AudioPlaybackManager";
import type { CandidateAudioStreamer } from "./CandidateAudioStreamer";

export interface GeminiServerContent {
  interrupted?: boolean;
  interimInputTranscription?: { text?: string };
  inputTranscription?: { text?: string };
  outputTranscription?: { text?: string };
  modelTurn?: {
    parts?: Array<{
      inlineData?: {
        mimeType?: string;
        data?: string;
      };
    }>;
  };
  turnComplete?: boolean;
}

export interface ServerContentContext {
  serverContent: GeminiServerContent;
  audioPlayback: AudioPlaybackManager;
  candidateStreamer: CandidateAudioStreamer;
  handlers: LiveMessageHandlers;
  getTurnCompleteReceived: () => boolean;
  setTurnCompleteReceived: (val: boolean) => void;
  appendOutputTranscript: (chunk: string) => void;
  getOutputTranscriptBuffer: () => string;
  onEmitSpeakingEnd: () => void;
}

export function handleServerContent(ctx: ServerContentContext): void {
  const {
    serverContent,
    audioPlayback,
    candidateStreamer,
    handlers,
    getTurnCompleteReceived,
    setTurnCompleteReceived,
    appendOutputTranscript,
    getOutputTranscriptBuffer,
    onEmitSpeakingEnd,
  } = ctx;

  console.log(
    `[CandidateAudioTrace] serverContent keys: [${Object.keys(serverContent).join(", ")}]`,
  );

  if (serverContent?.interrupted) {
    console.log("[Live Interview] Gemini generation interrupted.");
    audioPlayback.stopAllAudio();
    onEmitSpeakingEnd();
  }

  const interimTranscript = serverContent?.interimInputTranscription?.text;
  if (typeof interimTranscript === "string" && interimTranscript.trim()) {
    candidateStreamer.handleInterimTranscript(interimTranscript);
  }

  const inputTranscript = serverContent?.inputTranscription?.text;
  if (typeof inputTranscript === "string" && inputTranscript.trim()) {
    candidateStreamer.handleFinalInputTranscript(inputTranscript.trim());
  }

  const outputTranscript = serverContent?.outputTranscription?.text;
  if (typeof outputTranscript === "string" && outputTranscript.trim()) {
    appendOutputTranscript(outputTranscript);
    handlers.onOutputTranscript?.(getOutputTranscriptBuffer());
  }

  const modelTurnParts = serverContent?.modelTurn?.parts;
  if (modelTurnParts || outputTranscript) {
    candidateStreamer.handleModelResponseReceived();
  }

  if (Array.isArray(modelTurnParts)) {
    let receivedAudio = false;

    for (const part of modelTurnParts) {
      const inlineData = part?.inlineData;
      if (!inlineData) continue;

      const audioData = inlineData?.data;
      if (typeof audioData !== "string" || !audioData) continue;

      console.log("Gemini audio chunk received:", {
        mimeType: inlineData?.mimeType,
        base64Length: audioData.length,
      });

      receivedAudio = true;
      audioPlayback.playPcmAudio(audioData);
    }

    if (receivedAudio) {
      audioPlayback.startAudioLevelMonitoring(handlers.onAudioLevel);

      if (!audioPlayback.getIsSpeaking()) {
        audioPlayback.clearSpeakingEndTimer();
        audioPlayback.setSpeakingEndNotified(false);
        audioPlayback.setIsSpeaking(true);

        console.log("[Live Interview] Gemini speaking start.");
        handlers.onSpeakingStart?.();
      }

      if (getTurnCompleteReceived()) {
        audioPlayback.notifySpeakingEndWhenAudioFinishes(onEmitSpeakingEnd);
      }
    }
  }

  if (serverContent?.turnComplete) {
    console.log("[Live Interview] Gemini turnComplete received.");
    setTurnCompleteReceived(true);

    const completeOutput = getOutputTranscriptBuffer().trim();
    if (completeOutput) {
      handlers.onTurnComplete?.(completeOutput);
    }

    if (audioPlayback.getIsSpeaking()) {
      audioPlayback.notifySpeakingEndWhenAudioFinishes(onEmitSpeakingEnd);
    } else {
      onEmitSpeakingEnd();
    }
  }
}

