import mongoose from "mongoose";

export class SessionConflictError extends Error {
  statusCode: number;
  code: string;
  constructor(
    message = "This interview session is currently active on another device or tab. Simultaneous access is prevented to protect interview state."
  ) {
    super(message);
    this.name = "SessionConflictError";
    this.statusCode = 409;
    this.code = "SESSION_CONFLICT";
  }
}

export const SESSION_HEARTBEAT_TIMEOUT_MS = 45_000;

export interface StartLiveInterviewResult {
  interview: {
    id: mongoose.Types.ObjectId;
    role: string;
    interviewType: string;
    difficulty: "Easy" | "Medium" | "Hard";
    questionLimit: number;
    status: string;
    startedAt?: Date;
    activeDurationSeconds?: number;
  };
  sessionId: string;
}

export interface SaveLiveConversationTurnResult {
  saved: boolean;
  speaker: "interviewer" | "candidate";
  sequence?: number;
  turnId?: mongoose.Types.ObjectId;
  text: string;
  totalTurns: number;
}

export interface CompleteLiveInterviewResult {
  completed: boolean;
  reportGenerated: boolean;
  reportStatus: "NotRequired" | "Processing" | "Completed" | "Failed" | "none" | "preparing" | "ready" | "failed";
  reportId?: mongoose.Types.ObjectId | null;
  answeredCount: number;
  questionLimit: number;
  minimumRequiredAnswers: number;
  message: string;
  id?: mongoose.Types.ObjectId | null;
  overallScore?: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  suggestions?: string[];
  summary?: string;
}

export interface ReportStatusResult {
  status: "NotRequired" | "Processing" | "Completed" | "Failed";
  reportId?: mongoose.Types.ObjectId | null;
  overallScore?: number | null;
  error?: string | null;
  errorMessage?: string | null;
  answeredCount?: number;
  minimumRequiredAnswers?: number;
  message?: string;
}

export interface LiveInterviewSessionResult {
  interview: {
    id: mongoose.Types.ObjectId;
    role: string;
    interviewType: string;
    difficulty: "Easy" | "Medium" | "Hard";
    questionLimit: number;
    status: string;
    startedAt?: Date;
    endedAt?: Date;
    activeDurationSeconds?: number;
  };
  stats: {
    totalQuestions: number;
    currentQuestion: number;
    answeredCount: number;
    minimumRequiredAnswers: number;
    activeDurationSeconds?: number;
  };
  turns: Array<{
    sequence: number;
    speaker: "interviewer" | "candidate";
    text: string;
    isQuestion: boolean;
    timestamp: Date;
  }>;
  lastInterviewerTurn: string | null;
  lastCandidateTurn: string | null;
}

