import React, { useEffect, useRef, useState } from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import GeminiLiveService from "../../services/geminiLiveService";
import InterviewReadyScreen from "../InterviewReadyScreen";

import type { AiStatus } from "./types";
import { useInterviewTimers } from "./hooks/useInterviewTimers";
import { useMediaControls } from "./hooks/useMediaControls";
import { useInterviewSession } from "./hooks/useInterviewSession";
import { useInterviewOperations } from "./hooks/useInterviewOperations";
import { InterviewTopBar } from "./components/InterviewTopBar";
import { InterviewBottomControls } from "./components/InterviewBottomControls";
import { MobileConversationStage } from "./components/MobileConversationStage";
import { DesktopConversationStage } from "./components/DesktopConversationStage";
import { InterviewModals } from "./components/InterviewModals";

export const InterviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const liveServiceRef = useRef<GeminiLiveService | null>(null);
  const geminiSpeakingRef = useRef(false);

  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [aiStatus, setAiStatus] = useState<AiStatus>("Listening");
  const [geminiAudioLevel, setGeminiAudioLevel] = useState(0);

  const [totalQuestions, setTotalQuestions] = useState(0);
  const totalQuestionsRef = useRef(20);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [interviewerTranscript, setInterviewerTranscript] = useState("Your AI interviewer is preparing the first question.");
  const [candidateTranscript, setCandidateTranscript] = useState("Your speech will appear here as you speak.");

  const candidateTurnFinalizedForCurrentQuestionRef = useRef(false);
  const authoritativeSessionIdRef = useRef<string | null>(null);
  const [isCompletingInterview, setIsCompletingInterview] = useState(false);

  const lastSavedCandidateTextRef = useRef("");
  const lastSavedInterviewerTextRef = useRef("");

  const candidateAnswerCountRef = useRef(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const interviewCompletedRef = useRef(false);
  const geminiSystemInstructionSentRef = useRef(false);

  const interviewerQuestionCountRef = useRef(0);
  const pendingCompletionRef = useRef(false);
  const continuationRequestedRef = useRef(false);
  const waitingForClosingStatementRef = useRef(false);
  const isCandidateSpeakingTurnRef = useRef(false);

  const [showHighDemandModal, setShowHighDemandModal] = useState(false);
  const isLeavingRef = useRef(false);
  const connectionGenerationRef = useRef(0);
  const isStartingInterviewRef = useRef(false);
  const isReStatingPendingQuestionRef = useRef(false);

  // Hook: Media stream & hardware controls
  const media = useMediaControls({
    started,
    isMobile,
    geminiSpeakingRef,
    liveServiceRef,
  });

  // Hook: Timer management & watchdogs
  const timers = useInterviewTimers({
    interviewCompletedRef,
    waitingForClosingStatementRef,
    geminiSpeakingRef,
    startedRef,
    candidateTurnFinalizedForCurrentQuestionRef,
    isCandidateSpeakingTurnRef,
    onShowHighDemandModal: () => setShowHighDemandModal(true),
  });

  // Hook: Session state, turn saving queue & mount restoration
  const session = useInterviewSession({
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
    setElapsedSeconds: timers.setElapsedSeconds,
    elapsedSecondsRef: timers.elapsedSecondsRef,
  });

  const getLiveContext = () => ({
    id,
    connectionGenerationRef,
    streamRef: media.streamRef,
    liveServiceRef,
    geminiSpeakingRef,
    startedRef,
    interviewCompletedRef,
    candidateTurnFinalizedForCurrentQuestionRef,
    isCandidateSpeakingTurnRef,
    lastSavedCandidateTextRef,
    lastSavedInterviewerTextRef,
    candidateAnswerCountRef,
    interviewerQuestionCountRef,
    totalQuestionsRef,
    isReStatingPendingQuestionRef,
    waitingForClosingStatementRef,
    continuationRequestedRef,
    pendingCompletionRef,
    geminiSystemInstructionSentRef,
    geminiMeaningfulProgressRef: timers.geminiMeaningfulProgressRef,
    isLeavingRef,
    speakerEnabled: media.speakerEnabled,
    micEnabled: media.micEnabled,
    setAiStatus,
    setCandidateTranscript,
    setInterviewerTranscript,
    setCurrentQuestion,
    setGeminiAudioLevel,
    setError,
    clearCandidateNoAnswerTimeout: timers.clearCandidateNoAnswerTimeout,
    startCandidateNoAnswerTimeout: timers.startCandidateNoAnswerTimeout,
    clearGeminiIdleWatchdog: timers.clearGeminiIdleWatchdog,
    startGeminiIdleWatchdog: timers.startGeminiIdleWatchdog,
    setShowNoAnswerReminderModal: timers.setShowNoAnswerReminderModal,
    saveConversationTurn: session.saveConversationTurn,
    completeInterview: ops.completeInterview,
    handleReconnect: ops.handleReconnect,
  });

  // Hook: Start/End/Leave/Reconnect orchestration
  const ops = useInterviewOperations({
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
  });

  // Before unload warning while interview is active
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (started && !interviewCompletedRef.current && !isLeavingRef.current) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [started]);

  // Periodic session heartbeat
  useEffect(() => {
    if (!started || !id || interviewCompletedRef.current) return;

    const heartbeatInterval = setInterval(async () => {
      try {
        if (session.isSavingTurnRef.current) return;
        const response = await fetch(
          `${session.getApiBaseUrl()}/interviews/${id}/live/heartbeat`,
          {
            method: "POST",
            headers: session.getAuthHeaders(),
          },
        );
        if (response.status === 409) {
          session.setSessionConflictModalOpen(true);
          liveServiceRef.current?.disconnect();
        } else if (response.status === 401) {
          liveServiceRef.current?.disconnect();
          navigate("/login");
        }
      } catch (err) {
        console.warn("[Live Interview] Heartbeat ping error:", err);
      }
    }, 15000);

    return () => clearInterval(heartbeatInterval);
  }, [started, id]);

  // Overall component teardown
  useEffect(() => {
    return () => {
      startedRef.current = false;
      timers.teardownTimers();
      liveServiceRef.current?.disconnect();
      liveServiceRef.current = null;
      geminiSpeakingRef.current = false;
      media.teardownMedia();
    };
  }, [id]);

  useEffect(() => {
    if (ops.showLeaveModal || ops.showEndEarlyModal) {
      setAnsweredCount(candidateAnswerCountRef.current);
    }
  }, [ops.showLeaveModal, ops.showEndEarlyModal]);

  const handleAnswerNow = () => {
    timers.setShowNoAnswerReminderModal(false);
    if (
      !interviewCompletedRef.current &&
      !candidateTurnFinalizedForCurrentQuestionRef.current &&
      !geminiSpeakingRef.current
    ) {
      if (media.micEnabled && liveServiceRef.current?.isConnected()) {
        liveServiceRef.current?.resumeMicrophone();
      }
      timers.startCandidateNoAnswerTimeout();
    }
  };

  if (!started) {
    return (
      <InterviewReadyScreen
        id={id}
        loading={loading}
        isCheckingSession={session.isCheckingSession}
        mediaReady={media.mediaReady}
        cameraEnabled={media.cameraEnabled}
        micEnabled={media.micEnabled}
        mediaError={media.mediaError}
        error={error}
        isResume={session.isResumable || Boolean(session.resumeSessionDataRef.current)}
        onStart={() => {
          if (session.isCheckingSessionRef.current) return;
          if (session.resumeSessionDataRef.current) {
            void ops.handleStartInterview(true, session.resumeSessionDataRef.current);
          } else {
            void ops.handleStartInterview(false);
          }
        }}
        onBack={() => navigate("/dashboard", { replace: true })}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        height: "100dvh",
        backgroundColor: "#111318",
        color: "#ffffff",
        fontFamily: '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <InterviewTopBar
        idleProcessingNotice={timers.idleProcessingNotice}
        reconnecting={ops.reconnecting}
        reconnectNotice={ops.reconnectNotice}
        elapsedSeconds={timers.elapsedSeconds}
      />

      {isMobile ? (
        <MobileConversationStage
          videoRef={media.videoRef}
          aiStatus={aiStatus}
          geminiAudioLevel={geminiAudioLevel}
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          cameraEnabled={media.cameraEnabled}
          mediaReady={media.mediaReady}
          micEnabled={media.micEnabled}
          interviewerTranscript={interviewerTranscript}
          candidateTranscript={candidateTranscript}
          candidateCountdown={timers.candidateCountdown}
          isGeminiSpeaking={aiStatus === "Speaking"}
          isSavingTurn={session.isSavingTurn}
        />
      ) : (
        <DesktopConversationStage
          videoRef={media.videoRef}
          aiStatus={aiStatus}
          geminiAudioLevel={geminiAudioLevel}
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestion}
          cameraEnabled={media.cameraEnabled}
          mediaReady={media.mediaReady}
          micEnabled={media.micEnabled}
          interviewerTranscript={interviewerTranscript}
          candidateTranscript={candidateTranscript}
          candidateCountdown={timers.candidateCountdown}
          isGeminiSpeaking={aiStatus === "Speaking"}
          isSavingTurn={session.isSavingTurn}
          isCompletingInterview={isCompletingInterview}
        />
      )}

      <InterviewBottomControls
        micEnabled={media.micEnabled}
        cameraEnabled={media.cameraEnabled}
        speakerEnabled={media.speakerEnabled}
        isCompletingInterview={isCompletingInterview}
        onToggleMic={media.handleToggleMic}
        onToggleCamera={media.handleToggleCamera}
        onToggleSpeaker={media.handleToggleSpeaker}
        onLeaveInterview={ops.handleLeaveInterview}
        onEndInterview={ops.handleEndInterview}
      />

      <InterviewModals
        showLeaveModal={ops.showLeaveModal}
        showEndEarlyModal={ops.showEndEarlyModal}
        showHighDemandModal={showHighDemandModal}
        sessionConflictModalOpen={session.sessionConflictModalOpen}
        showNoAnswerReminderModal={timers.showNoAnswerReminderModal}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        onCloseLeaveModal={() => ops.setShowLeaveModal(false)}
        onConfirmLeave={ops.handleConfirmLeave}
        onCloseEndEarlyModal={() => ops.setShowEndEarlyModal(false)}
        onConfirmEndAnyway={ops.handleConfirmEndAnyway}
        onReturnToDashboard={() => {
          setShowHighDemandModal(false);
          navigate("/dashboard", { replace: true });
        }}
        onAnswerNow={handleAnswerNow}
      />
    </Box>
  );
};

export default InterviewPage;
