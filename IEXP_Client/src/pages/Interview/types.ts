export type AiStatus = "Listening" | "Thinking" | "Speaking";

export interface InterviewSessionData {
  sessionId?: string;
  questionNumber?: number;
  totalQuestions?: number;
  elapsedSeconds?: number;
  [key: string]: unknown;
}

