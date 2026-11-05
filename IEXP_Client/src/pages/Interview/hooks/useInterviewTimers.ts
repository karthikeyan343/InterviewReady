import { useRef, useState } from "react";

const CANDIDATE_NO_ANSWER_REMINDER_SECONDS = 15;

interface UseInterviewTimersOptions {
  interviewCompletedRef: React.MutableRefObject<boolean>;
  waitingForClosingStatementRef: React.MutableRefObject<boolean>;
  geminiSpeakingRef: React.MutableRefObject<boolean>;
  startedRef: React.MutableRefObject<boolean>;
  candidateTurnFinalizedForCurrentQuestionRef: React.MutableRefObject<boolean>;
  isCandidateSpeakingTurnRef: React.MutableRefObject<boolean>;
  onShowHighDemandModal: () => void;
}

export const useInterviewTimers = ({
  interviewCompletedRef,
  waitingForClosingStatementRef,
  geminiSpeakingRef,
  startedRef,
  candidateTurnFinalizedForCurrentQuestionRef,
  isCandidateSpeakingTurnRef,
  onShowHighDemandModal,
}: UseInterviewTimersOptions) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const elapsedSecondsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [candidateCountdown, setCandidateCountdown] = useState<number | null>(null);
  const candidateNoAnswerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const candidateCountdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showNoAnswerReminderModal, setShowNoAnswerReminderModal] = useState(false);

  const [idleProcessingNotice, setIdleProcessingNotice] = useState("");
  const geminiIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geminiRecoveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geminiMeaningfulProgressRef = useRef(false);

  const startElapsedTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          elapsedSecondsRef.current = next;
          return next;
        });
      }, 1000);
    }
  };

  const stopElapsedTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearCandidateNoAnswerTimeout = () => {
    if (candidateNoAnswerTimeoutRef.current) {
      clearTimeout(candidateNoAnswerTimeoutRef.current);
      candidateNoAnswerTimeoutRef.current = null;
    }
    if (candidateCountdownIntervalRef.current) {
      clearInterval(candidateCountdownIntervalRef.current);
      candidateCountdownIntervalRef.current = null;
    }
    setCandidateCountdown(null);
  };

  const startCandidateNoAnswerTimeout = () => {
    clearCandidateNoAnswerTimeout();
    if (
      interviewCompletedRef.current ||
      waitingForClosingStatementRef.current ||
      geminiSpeakingRef.current ||
      !startedRef.current ||
      candidateTurnFinalizedForCurrentQuestionRef.current
    ) {
      return;
    }

    setCandidateCountdown(CANDIDATE_NO_ANSWER_REMINDER_SECONDS);
    let remaining = CANDIDATE_NO_ANSWER_REMINDER_SECONDS;

    candidateCountdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining >= 0) {
        setCandidateCountdown(remaining);
      } else {
        if (candidateCountdownIntervalRef.current) {
          clearInterval(candidateCountdownIntervalRef.current);
          candidateCountdownIntervalRef.current = null;
        }
      }
    }, 1000);

    candidateNoAnswerTimeoutRef.current = setTimeout(() => {
      clearCandidateNoAnswerTimeout();
      if (
        interviewCompletedRef.current ||
        waitingForClosingStatementRef.current ||
        geminiSpeakingRef.current ||
        candidateTurnFinalizedForCurrentQuestionRef.current ||
        isCandidateSpeakingTurnRef.current
      ) {
        return;
      }
      setShowNoAnswerReminderModal(true);
    }, CANDIDATE_NO_ANSWER_REMINDER_SECONDS * 1000);
  };

  const clearGeminiIdleWatchdog = () => {
    if (geminiIdleTimerRef.current) {
      clearTimeout(geminiIdleTimerRef.current);
      geminiIdleTimerRef.current = null;
    }
    if (geminiRecoveryTimerRef.current) {
      clearTimeout(geminiRecoveryTimerRef.current);
      geminiRecoveryTimerRef.current = null;
    }
    setIdleProcessingNotice("");
  };

  const startGeminiIdleWatchdog = () => {
    clearGeminiIdleWatchdog();
    if (interviewCompletedRef.current) return;

    geminiMeaningfulProgressRef.current = false;
    geminiIdleTimerRef.current = setTimeout(() => {
      geminiIdleTimerRef.current = null;
      if (
        !interviewCompletedRef.current &&
        !geminiSpeakingRef.current &&
        !geminiMeaningfulProgressRef.current &&
        startedRef.current
      ) {
        setIdleProcessingNotice("");
        onShowHighDemandModal();
      }
    }, 20000);
  };

  const teardownTimers = () => {
    stopElapsedTimer();
    clearCandidateNoAnswerTimeout();
    clearGeminiIdleWatchdog();
  };

  return {
    elapsedSeconds,
    setElapsedSeconds,
    elapsedSecondsRef,
    startElapsedTimer,
    stopElapsedTimer,
    candidateCountdown,
    showNoAnswerReminderModal,
    setShowNoAnswerReminderModal,
    startCandidateNoAnswerTimeout,
    clearCandidateNoAnswerTimeout,
    idleProcessingNotice,
    setIdleProcessingNotice,
    geminiMeaningfulProgressRef,
    startGeminiIdleWatchdog,
    clearGeminiIdleWatchdog,
    teardownTimers,
  };
};

