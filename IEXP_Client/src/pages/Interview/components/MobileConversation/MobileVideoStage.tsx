import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import MicOffIcon from "@mui/icons-material/MicOff";
import InteractiveAvatar from "../../../../component/specifiedComponent/InteractiveAvatar";
import type { AiStatus } from "../../types";

interface MobileVideoStageProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  aiStatus: AiStatus;
  geminiAudioLevel: number;
  totalQuestions: number;
  currentQuestion: number;
  cameraEnabled: boolean;
  mediaReady: boolean;
  micEnabled: boolean;
}

export const MobileVideoStage: React.FC<MobileVideoStageProps> = ({
  videoRef,
  aiStatus,
  geminiAudioLevel,
  totalQuestions,
  currentQuestion,
  cameraEnabled,
  mediaReady,
  micEnabled,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        height: {
          xs: "clamp(210px, 36dvh, 280px)",
          sm: "clamp(240px, 40dvh, 320px)",
        },
        minHeight: {
          xs: "200px",
          sm: "230px",
        },
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: "#171a21",
        border: "1px solid #272b33",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <InteractiveAvatar status={aiStatus} audioLevel={geminiAudioLevel} />

      {/* AI Status Badge (Top-Left) */}
      <Box
        sx={{
          position: "absolute",
          top: "10px",
          left: "10px",
          px: "8px",
          py: "4px",
          borderRadius: "6px",
          backgroundColor: "rgba(17,19,24,0.85)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          zIndex: 4,
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
            fontSize: "9px",
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          AI Interviewer • {aiStatus}
        </Typography>
      </Box>

      {/* Question Pill (Top-Right) */}
      {totalQuestions > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            px: "8px",
            py: "4px",
            borderRadius: "6px",
            backgroundColor: "rgba(17,19,24,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 4,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: "9px",
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

      {/* Floating Candidate Self-View (Picture-in-Picture) */}
      <Box
        sx={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          width: { xs: "96px", sm: "115px" },
          height: { xs: "128px", sm: "150px" },
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#1b1e24",
          border: "2px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.65)",
          zIndex: 6,
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          autoPlay
          muted
          playsInline
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            display: cameraEnabled && mediaReady ? "block" : "none",
          }}
        />

        {(!cameraEnabled || !mediaReady) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#1b1e24",
            }}
          >
            <Avatar
              sx={{
                width: "44px",
                height: "44px",
                backgroundColor: "#2b303a",
                color: "#9aa1ad",
                fontSize: "14px",
                fontWeight: 800,
              }}
            >
              You
            </Avatar>
          </Box>
        )}

        {/* Candidate "You" Label */}
        <Box
          sx={{
            position: "absolute",
            left: "6px",
            bottom: "6px",
            px: "6px",
            py: "2px",
            borderRadius: "4px",
            backgroundColor: "rgba(17,19,24,0.85)",
            backdropFilter: "blur(4px)",
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            You
          </Typography>
        </Box>

        {/* Muted Mic Indicator */}
        {!micEnabled && (
          <Box
            sx={{
              position: "absolute",
              right: "6px",
              bottom: "6px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#3a2226",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              border: "1px solid #633238",
            }}
          >
            <MicOffIcon
              sx={{
                fontSize: "11px",
                color: "#ff9ca5",
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MobileVideoStage;
