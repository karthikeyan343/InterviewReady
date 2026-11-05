import React from "react";
import { Box, Typography } from "@mui/material";
import type { InterviewReadyScreenProps } from "./types";
import ReadyHeader from "./components/ReadyHeader";
import MediaPermissionCards from "./components/MediaPermissionCards";
import ReadyActionButtons from "./components/ReadyActionButtons";

export const InterviewReadyScreen: React.FC<InterviewReadyScreenProps> = ({
  id,
  loading,
  isCheckingSession = false,
  mediaReady,
  cameraEnabled,
  micEnabled,
  mediaError,
  error,
  isResume = false,
  onStart,
  onBack,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundColor: "#111318",
        color: "#ffffff",
        fontFamily:
          '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: "12px", sm: "24px" },
        py: { xs: "16px", sm: "32px" },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "560px", md: "620px" },
          backgroundColor: "#1b1e24",
          border: "1px solid #282c35",
          borderRadius: { xs: "14px", sm: "18px" },
          overflow: "hidden",
          boxShadow: "0 16px 45px rgba(0, 0, 0, 0.55)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ReadyHeader id={id} />

        <Box
          sx={{
            p: {
              xs: "16px 14px",
              sm: "24px 24px",
              md: "28px 28px",
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "20px",
                sm: "24px",
                md: "26px",
              },
              fontWeight: 800,
              color: "#ffffff",
              mb: { xs: "6px", sm: "8px" },
              lineHeight: 1.2,
            }}
          >
            {isResume ? "Ready to resume?" : "Ready to start?"}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "12.5px" },
              lineHeight: 1.6,
              color: "#858b98",
              mb: { xs: "16px", sm: "22px" },
            }}
          >
            {isResume
              ? "You are resuming your active interview session. Verify your camera and microphone status below before continuing."
              : "Your interview will be conducted as a live voice conversation with your AI interviewer. Verify your camera and microphone status below before joining."}
          </Typography>

          <MediaPermissionCards
            mediaReady={mediaReady}
            cameraEnabled={cameraEnabled}
            micEnabled={micEnabled}
          />

          {mediaError && (
            <Box
              sx={{
                backgroundColor: "#351d20",
                border: "1px solid #633238",
                borderRadius: "9px",
                px: "12px",
                py: "9px",
                mb: "12px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#ff9ca5",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {mediaError}
              </Typography>
            </Box>
          )}

          {error && (
            <Box
              sx={{
                backgroundColor: "#351d20",
                border: "1px solid #633238",
                borderRadius: "9px",
                px: "12px",
                py: "9px",
                mb: "12px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#ff9ca5",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          <ReadyActionButtons
            loading={loading}
            isCheckingSession={isCheckingSession}
            isResume={isResume}
            onStart={onStart}
            onBack={onBack}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InterviewReadyScreen;
