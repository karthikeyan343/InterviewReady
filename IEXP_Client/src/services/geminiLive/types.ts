export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const MODEL_NAME = "gemini-3.1-flash-live-preview";

export const GEMINI_WS_URL =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";

export const CANDIDATE_VAD_THRESHOLD = 0.014;
export const CANDIDATE_VAD_SILENCE_MS = 1100;
export const CANDIDATE_VAD_MIN_SPEECH_MS = 300;
export const CANDIDATE_SAFETY_TIMEOUT_MS = 5000;

export interface LiveMessageHandlers {
  onOpen?: () => void | Promise<void>;
  onMessage?: (message: unknown) => void;
  onCandidateSpeechStart?: () => void;
  onInputTranscript?: (text: string) => void;
  onCandidateTurnEnd?: (text: string) => void;
  onCandidateTurnReset?: () => void;
  onOutputTranscript?: (text: string) => void;
  onSpeakingStart?: () => void;
  onSpeakingEnd?: () => void;
  onTurnComplete?: (text: string) => void;
  onAudioLevel?: (level: number) => void;
  onError?: (error: Event | Error) => void;
  onClose?: () => void;
}

export type CandidateTurnState =
  | "IDLE"
  | "WAITING_FOR_ANSWER"
  | "SPEAKING"
  | "WAITING_FOR_FINAL_TRANSCRIPT"
  | "ANSWER_FINALIZED"
  | "SAVING_ANSWER";

