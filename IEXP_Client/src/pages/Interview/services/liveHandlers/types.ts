import React from "react";
import type GeminiLiveService from "../../../../services/geminiLiveService";
import type { AiStatus } from "../../types";

export interface LiveHandlerContext {
  id: string | undefined;
  connectionGenerationRef: React.MutableRefObject<number>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  liveServiceRef: React.MutableRefObject<GeminiLiveService | null>;
  geminiSpeakingRef: React.MutableRefObject<boolean>;
  startedRef: React.MutableRefObject<boolean>;
  interviewCompletedRef: React.MutableRefObject<boolean>;
  candidateTurnFinalizedForCurrentQuestionRef: React.MutableRefObject<boolean>;
  isCandidateSpeakingTurnRef: React.MutableRefObject<boolean>;
  lastSavedCandidateTextRef: React.MutableRefObject<string>;
  lastSavedInterviewerTextRef: React.MutableRefObject<string>;
  candidateAnswerCountRef: React.MutableRefObject<number>;
  interviewerQuestionCountRef: React.MutableRefObject<number>;
  totalQuestionsRef: React.MutableRefObject<number>;
  isReStatingPendingQuestionRef: React.MutableRefObject<boolean>;
  waitingForClosingStatementRef: React.MutableRefObject<boolean>;
  continuationRequestedRef: React.MutableRefObject<boolean>;
  pendingCompletionRef: React.MutableRefObject<boolean>;
  geminiSystemInstructionSentRef: React.MutableRefObject<boolean>;
  geminiMeaningfulProgressRef: React.MutableRefObject<boolean>;
  isLeavingRef: React.MutableRefObject<boolean>;
  speakerEnabled: boolean;
  micEnabled: boolean;
  setAiStatus: (status: AiStatus) => void;
  setCandidateTranscript: (text: string) => void;
  setInterviewerTranscript: (text: string) => void;
  setCurrentQuestion: (q: number) => void;
  setGeminiAudioLevel: (level: number) => void;
  setError: (err: string) => void;
  clearCandidateNoAnswerTimeout: () => void;
  startCandidateNoAnswerTimeout: () => void;
  clearGeminiIdleWatchdog: () => void;
  startGeminiIdleWatchdog: () => void;
  setShowNoAnswerReminderModal: (show: boolean) => void;
  saveConversationTurn: (
    speaker: "interviewer" | "candidate",
    text: string,
    isQuestion?: boolean
  ) => Promise<void>;
  completeInterview: () => void;
  handleReconnect: () => Promise<void>;
}

export interface ResumeSessionData {
  interview?: {
    role?: string;
    interviewType?: string;
    difficulty?: string;
  };
  lastInterviewerTurn?: string | null;
  turns?: Array<{
    text?: string;
    speaker?: string;
  }>;
}
