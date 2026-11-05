import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ResumeSessionData } from "../services/liveHandlers/types";

interface UseInterviewSessionOptions {
  id: string | undefined;
  authoritativeSessionIdRef: React.MutableRefObject<string | null>;
  totalQuestionsRef: React.MutableRefObject<number>;
  candidateAnswerCountRef: React.MutableRefObject<number>;
  interviewerQuestionCountRef: React.MutableRefObject<number>;
  lastSavedInterviewerTextRef: React.MutableRefObject<string>;
  lastSavedCandidateTextRef: React.MutableRefObject<string>;
  setTotalQuestions: (n: number) => void;
  setCurrentQuestion: (n: number) => void;
  setInterviewerTranscript: (text: string) => void;
  setCandidateTranscript: (text: string) => void;
  setElapsedSeconds: (s: number) => void;
  elapsedSecondsRef: React.MutableRefObject<number>;
}

export const useInterviewSession = ({
  id,
  authoritativeSessionIdRef,
  totalQuestionsRef,
  candidateAnswerCountRef,
  interviewerQuestionCountRef,
  lastSavedInterviewerTextRef,
  lastSavedCandidateTextRef,
  setTotalQuestions,
  setCurrentQuestion,
  setInterviewerTranscript,
  setCandidateTranscript,
  setElapsedSeconds,
  elapsedSecondsRef,
}: UseInterviewSessionOptions) => {
  const navigate = useNavigate();

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isResumable, setIsResumable] = useState(false);
  const isCheckingSessionRef = useRef(true);
  const resumeSessionDataRef = useRef<ResumeSessionData | null>(null);
  const [sessionConflictModalOpen, setSessionConflictModalOpen] = useState(false);

  const [isSavingTurn, setIsSavingTurn] = useState(false);
  const isSavingTurnRef = useRef(false);
  const turnSaveQueueRef = useRef<Promise<void>>(Promise.resolve());

  const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL;

  const getSessionId = (): string => {
    if (!id) return "";
    const key = `interview_session_${id}`;
    let sid = authoritativeSessionIdRef.current || sessionStorage.getItem(key);
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(key, sid);
    }
    authoritativeSessionIdRef.current = sid;
    return sid;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token not found.");

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Session-Id": getSessionId(),
    };
  };

  const saveConversationTurn = (
    speaker: "interviewer" | "candidate",
    text: string,
    isQuestion = false,
  ): Promise<void> => {
    const cleanedText = text.trim();
    if (!id || !cleanedText) return Promise.resolve();

    const task = async () => {
      setIsSavingTurn(true);
      isSavingTurnRef.current = true;

      try {
        const response = await fetch(`${getApiBaseUrl()}/interviews/${id}/live/turn`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            speaker,
            text: cleanedText,
            isQuestion,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.status === 409) {
          setSessionConflictModalOpen(true);
          return;
        }
        if (response.status === 401) {
          navigate("/login");
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to save interview conversation.");
        }
      } finally {
        setIsSavingTurn(false);
        isSavingTurnRef.current = false;
      }
    };

    turnSaveQueueRef.current = turnSaveQueueRef.current.catch(() => undefined).then(task);
    return turnSaveQueueRef.current;
  };

  // Check and restore session on mount
  useEffect(() => {
    let mounted = true;
    isCheckingSessionRef.current = true;

    const checkAndResumeSession = async () => {
      if (!id) {
        if (mounted) {
          setIsCheckingSession(false);
          isCheckingSessionRef.current = false;
        }
        return;
      }

      try {
        const response = await fetch(`${getApiBaseUrl()}/interviews/${id}/live/session`, {
          headers: getAuthHeaders(),
        });

        if (response.status === 409) {
          if (mounted) setSessionConflictModalOpen(true);
          return;
        }
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        if (response.status === 404) {
          navigate("/dashboard", { replace: true });
          return;
        }
        if (!response.ok) return;

        const data = await response.json();
        if (!mounted) return;

        if (data.interview?.status === "Completed") {
          navigate("/dashboard", { replace: true });
          return;
        }

        if (data.interview?.status === "In Progress" || data.interview?.status === "Left") {
          resumeSessionDataRef.current = data;
          setIsResumable(true);

          const limit = data.stats?.totalQuestions ?? 20;
          totalQuestionsRef.current = limit;
          setTotalQuestions(limit);
          setCurrentQuestion(data.stats?.currentQuestion ?? 0);
          candidateAnswerCountRef.current = data.stats?.answeredCount ?? 0;
          interviewerQuestionCountRef.current = data.stats?.currentQuestion ?? 0;

          if (data.lastInterviewerTurn) {
            lastSavedInterviewerTextRef.current = data.lastInterviewerTurn;
            setInterviewerTranscript(data.lastInterviewerTurn);
          }
          if (data.lastCandidateTurn) {
            lastSavedCandidateTextRef.current = data.lastCandidateTurn;
            setCandidateTranscript(data.lastCandidateTurn);
          }

          const activeSeconds =
            data.interview?.activeDurationSeconds ?? data.stats?.activeDurationSeconds ?? 0;
          setElapsedSeconds(activeSeconds);
          elapsedSecondsRef.current = activeSeconds;
        }
      } catch (err) {
        console.warn("[Live Interview] Could not check session state:", err);
      } finally {
        if (mounted) {
          setIsCheckingSession(false);
          isCheckingSessionRef.current = false;
        }
      }
    };

    void checkAndResumeSession();
    return () => {
      mounted = false;
    };
  }, [id]);

  return {
    isCheckingSession,
    isResumable,
    isCheckingSessionRef,
    resumeSessionDataRef,
    sessionConflictModalOpen,
    setSessionConflictModalOpen,
    isSavingTurn,
    isSavingTurnRef,
    turnSaveQueueRef,
    getApiBaseUrl,
    getSessionId,
    getAuthHeaders,
    saveConversationTurn,
  };
};

