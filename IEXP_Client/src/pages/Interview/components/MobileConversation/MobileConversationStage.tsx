import React from "react";
import { Box } from "@mui/material";
import type { AiStatus } from "../../types";
import MobileVideoStage from "./MobileVideoStage";
import MobileLiveConversationCard from "./MobileLiveConversationCard";

export interface MobileConversationStageProps {
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
}

export const MobileConversationStage: React.FC<MobileConversationStageProps> = ({
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
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        p: { xs: "8px", sm: "12px" },
        gap: "8px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <MobileVideoStage
        videoRef={videoRef}
        aiStatus={aiStatus}
        geminiAudioLevel={geminiAudioLevel}
        totalQuestions={totalQuestions}
        currentQuestion={currentQuestion}
        cameraEnabled={cameraEnabled}
        mediaReady={mediaReady}
        micEnabled={micEnabled}
      />

      <MobileLiveConversationCard
        interviewerTranscript={interviewerTranscript}
        candidateTranscript={candidateTranscript}
        candidateCountdown={candidateCountdown}
        isGeminiSpeaking={isGeminiSpeaking}
        isSavingTurn={isSavingTurn}
      />
    </Box>
  );
};

export default MobileConversationStage;
