import React, { useRef, useState } from "react";
import type { NavigateFunction } from "react-router-dom";
import GeminiLiveService from "../../../services/geminiLiveService";
import { invalidateDashboard, invalidateInterviews } from "../../../services/apiQueries";
import { createLiveHandlers } from "../services/liveHandlers";
import type { LiveHandlerContext, ResumeSessionData } from "../services/liveHandlers";

interface UseInterviewOperationsOptions {
  id: string | undefined;
  navigate: NavigateFunction;
  started: boolean;
  setStarted: (s: boolean) => void;
  startedRef: React.MutableRefObject<boolean>;
  setLoading: (l: boolean) => void;
  setError: (e: string) => void;
  isLeavingRef: React.MutableRefObject<boolean>;
  connectionGenerationRef: React.MutableRefObject<number>;
  interviewCompletedRef: React.MutableRefObject<boolean>;
  pendingCompletionRef: React.MutableRefObject<boolean>;
  continuationRequestedRef: React.MutableRefObject<boolean>;
  waitingForClosingStatementRef: React.MutableRefObject<boolean>;
  isStartingInterviewRef: React.MutableRefObject<boolean>;
  isReStatingPendingQuestionRef: React.MutableRefObject<boolean>;
  authoritativeSessionIdRef: React.MutableRefObject<string | null>;
  totalQuestionsRef: React.MutableRefObject<number>;
  candidateAnswerCountRef: React.MutableRefObject<number>;
  interviewerQuestionCountRef: React.MutableRefObject<number>;
  setTotalQuestions: (n: number) => void;
  setCurrentQuestion: (n: number) => void;
  setIsCompletingInterview: (c: boolean) => void;
  liveServiceRef: React.MutableRefObject<GeminiLiveService | null>;
  media: {
    streamRef: React.MutableRefObject<MediaStream | null>;
    setupMedia: () => Promise<boolean>;
    setMediaError: (e: string) => void;
    teardownMedia: () => void;
  };
  timers: {
    elapsedSecondsRef: React.MutableRefObject<number>;
    startElapsedTimer: () => void;
    stopElapsedTimer: () => void;
    clearCandidateNoAnswerTimeout: () => void;
    clearGeminiIdleWatchdog: () => void;
    setShowNoAnswerReminderModal: (s: boolean) => void;
  };
  session: {
    getApiBaseUrl: () => string;
    getAuthHeaders: () => Record<string, string>;
    turnSaveQueueRef: React.MutableRefObject<Promise<void>>;
    resumeSessionDataRef: React.MutableRefObject<ResumeSessionData | null>;
    setSessionConflictModalOpen: (s: boolean) => void;
  };
  getLiveContext: () => LiveHandlerContext;
}

export const useInterviewOperations = ({
  id,
  navigate,
  started,
  setStarted,
  startedRef,
  setLoading,
  setError,
  isLeavingRef,
  connectionGenerationRef,
  interviewCompletedRef,
  pendingCompletionRef,
  continuationRequestedRef,
  waitingForClosingStatementRef,
  isStartingInterviewRef,
  isReStatingPendingQuestionRef,
  authoritativeSessionIdRef,
  totalQuestionsRef,
  candidateAnswerCountRef,
  interviewerQuestionCountRef,
  setTotalQuestions,
  setCurrentQuestion,
  setIsCompletingInterview,
  liveServiceRef,
  media,
  timers,
  session,
  getLiveContext,
}: UseInterviewOperationsOptions) => {
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectNotice, setReconnectNotice] = useState("");
  const isReconnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);

  const [showEndEarlyModal, setShowEndEarlyModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const completeInterview = () => {
    if (!id || interviewCompletedRef.current) return;

    interviewCompletedRef.current = true;
    startedRef.current = false;
    pendingCompletionRef.current = false;
    timers.clearCandidateNoAnswerTimeout();
    timers.clearGeminiIdleWatchdog();
    timers.setShowNoAnswerReminderModal(false);
    setIsCompletingInterview(true);
    timers.stopElapsedTimer();

    liveServiceRef.current?.disconnect();
    liveServiceRef.current = null;
    media.teardownMedia();

    const triggerBackendCompletion = async () => {
      try {
        await session.turnSaveQueueRef.current;
        await fetch(`${session.getApiBaseUrl()}/interviews/${id}/live/complete`, {
          method: "POST",
          headers: session.getAuthHeaders(),
          body: JSON.stringify({ elapsedSeconds: timers.elapsedSecondsRef.current }),
        });
      } catch (error) {
        console.warn("[Live Interview] Error during complete call:", error);
      } finally {
        if (id) sessionStorage.removeItem(`interview_session_${id}`);
        invalidateInterviews();
        invalidateDashboard();
      }
    };

    void triggerBackendCompletion();
    navigate("/dashboard", { replace: true });
  };

  const handleLeaveInterview = () => {
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    setShowLeaveModal(false);
    isLeavingRef.current = true;
    startedRef.current = false;
    isReconnectingRef.current = false;
    isReStatingPendingQuestionRef.current = false;
    connectionGenerationRef.current += 1;

    timers.clearCandidateNoAnswerTimeout();
    timers.clearGeminiIdleWatchdog();
    timers.setShowNoAnswerReminderModal(false);
    timers.stopElapsedTimer();

    liveServiceRef.current?.disconnect();
    liveServiceRef.current = null;
    media.teardownMedia();

    const triggerBackendLeave = async () => {
      try {
        await session.turnSaveQueueRef.current;
        await fetch(`${session.getApiBaseUrl()}/interviews/${id}/live/leave`, {
          method: "POST",
          headers: session.getAuthHeaders(),
          body: JSON.stringify({ elapsedSeconds: timers.elapsedSecondsRef.current }),
        });
      } catch (err) {
        console.warn("[Live Interview] Error during leave call:", err);
      } finally {
        if (id) sessionStorage.removeItem(`interview_session_${id}`);
        invalidateInterviews();
        invalidateDashboard();
      }
    };

    void triggerBackendLeave();
    navigate("/dashboard", { replace: true });
  };

  const handleReconnect = async () => {
    if (isReconnectingRef.current || interviewCompletedRef.current || isLeavingRef.current || !id) {
      return;
    }

    const currentGeneration = connectionGenerationRef.current;
    isReconnectingRef.current = true;
    setReconnecting(true);
    setReconnectNotice("Gemini is experiencing high demand. Please wait while we reconnect/resume your interview.");

    const maxAttempts = 4;
    const delays = [1500, 3000, 5000, 8000];

    while (
      reconnectAttemptsRef.current < maxAttempts &&
      !interviewCompletedRef.current &&
      !isLeavingRef.current &&
      currentGeneration === connectionGenerationRef.current
    ) {
      const delay = delays[reconnectAttemptsRef.current] || 5000;
      reconnectAttemptsRef.current += 1;
      await new Promise((res) => setTimeout(res, delay));

      if (isLeavingRef.current || currentGeneration !== connectionGenerationRef.current) break;

      try {
        if (!media.streamRef.current) await media.setupMedia();
        if (!liveServiceRef.current) liveServiceRef.current = new GeminiLiveService();

        const handlers = createLiveHandlers(
          getLiveContext(),
          true,
          totalQuestionsRef.current,
          session.resumeSessionDataRef.current,
          currentGeneration,
        );
        await liveServiceRef.current.reconnect(id, handlers);

        setReconnecting(false);
        setReconnectNotice("");
        isReconnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
        return;
      } catch (err) {
        console.warn("[Live Interview] Reconnect attempt failed:", err);
      }
    }

    isReconnectingRef.current = false;
    setReconnecting(false);
    if (!isLeavingRef.current && currentGeneration === connectionGenerationRef.current) {
      setError("Connection to AI interviewer lost. Please click Join Interview to resume.");
    }
  };

  const handleStartInterview = async (isResume = false, resumeSessionData?: ResumeSessionData | null) => {
    if (!id || isStartingInterviewRef.current) return;
    isStartingInterviewRef.current = true;

    try {
      setLoading(true);
      setError("");
      media.setMediaError("");
      isLeavingRef.current = false;
      const currentGen = ++connectionGenerationRef.current;

      interviewCompletedRef.current = false;
      pendingCompletionRef.current = false;
      continuationRequestedRef.current = false;
      waitingForClosingStatementRef.current = false;

      const mediaSuccess = await media.setupMedia();
      if (!mediaSuccess) return;

      const response = await fetch(`${session.getApiBaseUrl()}/interviews/${id}/live/start`, {
        method: "POST",
        headers: session.getAuthHeaders(),
      });

      if (response.status === 409) {
        session.setSessionConflictModalOpen(true);
        return;
      }
      if (response.status === 401) {
        navigate("/login");
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to start live interview session.");
      }

      if (data.sessionId) authoritativeSessionIdRef.current = data.sessionId;

      const targetTotal = data.stats?.totalQuestions || data.interview?.totalQuestions || 20;
      totalQuestionsRef.current = targetTotal;
      setTotalQuestions(targetTotal);

      if (isResume || resumeSessionData) {
        setCurrentQuestion(data.stats?.currentQuestion ?? 0);
        interviewerQuestionCountRef.current = data.stats?.currentQuestion ?? 0;
        candidateAnswerCountRef.current = data.stats?.answeredCount ?? 0;
      }

      setStarted(true);
      startedRef.current = true;
      timers.startElapsedTimer();

      if (liveServiceRef.current) {
        liveServiceRef.current.disconnect();
        liveServiceRef.current = null;
      }
      liveServiceRef.current = new GeminiLiveService();

      const handlers = createLiveHandlers(
        getLiveContext(),
        isResume,
        targetTotal,
        resumeSessionData || session.resumeSessionDataRef.current,
        currentGen,
      );

      await liveServiceRef.current.connect(id, handlers);
    } catch (err) {
      console.error("Failed to start live interview:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to the interview room.");
      startedRef.current = false;
      setStarted(false);
    } finally {
      setLoading(false);
      isStartingInterviewRef.current = false;
    }
  };

  const handleEndInterview = () => {
    if (!startedRef.current && !started) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const target = totalQuestionsRef.current || 20;
    const threshold = Math.ceil(target * 0.5);
    const answered = candidateAnswerCountRef.current;

    if (answered < threshold) {
      setShowEndEarlyModal(true);
    } else {
      completeInterview();
    }
  };

  const handleConfirmEndAnyway = () => {
    setShowEndEarlyModal(false);
    completeInterview();
  };

  return {
    reconnecting,
    reconnectNotice,
    showEndEarlyModal,
    setShowEndEarlyModal,
    showLeaveModal,
    setShowLeaveModal,
    completeInterview,
    handleLeaveInterview,
    handleConfirmLeave,
    handleReconnect,
    handleStartInterview,
    handleEndInterview,
    handleConfirmEndAnyway,
  };
};

