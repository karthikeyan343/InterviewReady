import React from "react";
import { Box } from "@mui/material";
import type { AiStatus } from "../../types";
import DesktopAiColumn from "./DesktopAiColumn";
import DesktopCandidateColumn from "./DesktopCandidateColumn";

export interface DesktopConversationStageProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  aiStatus: AiStatus;
  geminiAudioLevel: number;
  totalQuestions: number;
  currentQuestion: number;
  cameraEnabled: boolean;
  mediaReady: boolean;
  micEnabled: boolean;
  interviewerTranscript: string;
  candidateTranscript: string;
  candidateCountdown: number | null;
  isGeminiSpeaking: boolean;
  isSavingTurn: boolean;
  isCompletingInterview: boolean;
}

export const DesktopConversationStage: React.FC<DesktopConversationStageProps> = ({
  videoRef,
  aiStatus,
  geminiAudioLevel,
  totalQuestions,
  currentQuestion,
  cameraEnabled,
  mediaReady,
  micEnabled,
  interviewerTranscript,
  candidateTranscript,
  candidateCountdown,
  isGeminiSpeaking,
  isSavingTurn,
  isCompletingInterview,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        display: "grid",
        gridTemplateColumns: {
          md: "minmax(0, 1.3fr) minmax(0, 1fr)",
          lg: "minmax(0, 1fr) 360px",
        },
        gap: "16px",
        p: "16px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <DesktopAiColumn
        aiStatus={aiStatus}
        geminiAudioLevel={geminiAudioLevel}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
        interviewerTranscript={interviewerTranscript}
      />

      <DesktopCandidateColumn
        videoRef={videoRef}
        cameraEnabled={cameraEnabled}
        mediaReady={mediaReady}
        micEnabled={micEnabled}
        candidateTranscript={candidateTranscript}
        candidateCountdown={candidateCountdown}
        isGeminiSpeaking={isGeminiSpeaking}
        isSavingTurn={isSavingTurn}
        isCompletingInterview={isCompletingInterview}
      />
    </Box>
  );
};

export default DesktopConversationStage;
