import React from "react";
import { Box, Typography } from "@mui/material";
import InteractiveAvatar from "../../../../component/specifiedComponent/InteractiveAvatar";
import type { AiStatus } from "../../types";

interface DesktopAiColumnProps {
  aiStatus: AiStatus;
  geminiAudioLevel: number;
  totalQuestions: number;
  currentQuestion: number;
  interviewerTranscript: string;
}

export const DesktopAiColumn: React.FC<DesktopAiColumnProps> = ({
  aiStatus,
  geminiAudioLevel,
  totalQuestions,
  currentQuestion,
  interviewerTranscript,
}) => {
  return (
    <Box
      sx={{
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        minWidth: 0,
      }}
    >
      {/* AI Avatar Card */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          borderRadius: "14px",
          overflow: "hidden",
          backgroundColor: "#1b1e24",
          border: "1px solid #272b33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <InteractiveAvatar status={aiStatus} audioLevel={geminiAudioLevel} />

        {/* AI Status Badge - Left */}
        <Box
          sx={{
            position: "absolute",
            top: "14px",
            left: "14px",
            px: "10px",
            py: "5px",
            borderRadius: "7px",
            backgroundColor: "rgba(17,19,24,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 2,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Box
            sx={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor:
                aiStatus === "Speaking"
                  ? "#5ecb8a"
                  : aiStatus === "Thinking"
                  ? "#356ae6"
                  : "#858b98",
            }}
          />

          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            AI Interviewer
          </Typography>
        </Box>

        {/* AI Status Badge - Right */}
        <Box
          sx={{
            position: "absolute",
            top: "14px",
            right: "14px",
            px: "10px",
            py: "5px",
            borderRadius: "7px",
            backgroundColor: "rgba(17,19,24,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 2,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: "9px",
              fontWeight: 800,
              color:
                aiStatus === "Speaking"
                  ? "#5ecb8a"
                  : aiStatus === "Thinking"
                  ? "#356ae6"
                  : "#9aa1ad",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {aiStatus}
          </Typography>
        </Box>

        {/* Question Counter Pill */}
        {totalQuestions > 0 && (
          <Box
            sx={{
              position: "absolute",
              bottom: "14px",
              right: "14px",
              px: "11px",
              py: "5px",
              borderRadius: "7px",
              backgroundColor: "rgba(17,19,24,0.85)",
              backdropFilter: "blur(8px)",
              zIndex: 2,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Typography
              sx={{
                fontSize: "10px",
                fontWeight: 800,
                color: "#ffffff",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              Question {Math.min(currentQuestion, totalQuestions)} /{" "}
              {totalQuestions}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Gemini Interviewer Transcript Box */}
      <Box
        sx={{
          flexShrink: 0,
          minHeight: "90px",
          maxHeight: "140px",
          overflowY: "auto",
          px: "16px",
          py: "12px",
          borderRadius: "12px",
          backgroundColor: "#171a20",
          border: "1px solid #272b33",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#353a44",
            borderRadius: "10px",
          },
          scrollbarWidth: "thin",
        }}
      >
        <Typography
          sx={{
            fontSize: "8px",
            color: "#7f8794",
            fontWeight: 800,
            mb: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          AI Interviewer
        </Typography>

        <Typography
          sx={{
            fontSize: "12px",
            color: "#f1f3f7",
            lineHeight: 1.6,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {interviewerTranscript}
        </Typography>
      </Box>
    </Box>
  );
};

export default DesktopAiColumn;
