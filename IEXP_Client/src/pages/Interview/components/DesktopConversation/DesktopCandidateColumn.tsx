import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import MicOffIcon from "@mui/icons-material/MicOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface DesktopCandidateColumnProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraEnabled: boolean;
  mediaReady: boolean;
  micEnabled: boolean;
  candidateTranscript: string;
  candidateCountdown: number | null;
  isGeminiSpeaking: boolean;
  isSavingTurn: boolean;
  isCompletingInterview: boolean;
}

export const DesktopCandidateColumn: React.FC<DesktopCandidateColumnProps> = ({
  videoRef,
  cameraEnabled,
  mediaReady,
  micEnabled,
  candidateTranscript,
  candidateCountdown,
  isGeminiSpeaking,
  isSavingTurn,
  isCompletingInterview,
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
      {/* Candidate Video Card */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          borderRadius: "14px",
          backgroundColor: "#1b1e24",
          border: "1px solid #272b33",
          overflow: "hidden",
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
                width: "72px",
                height: "72px",
                backgroundColor: "#2b303a",
                color: "#9aa1ad",
                fontSize: "22px",
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
            left: "12px",
            bottom: "12px",
            px: "9px",
            py: "4px",
            borderRadius: "6px",
            backgroundColor: "rgba(17,19,24,0.85)",
            backdropFilter: "blur(6px)",
            zIndex: 2,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Typography
            sx={{
              fontSize: "9px",
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
              right: "12px",
              bottom: "12px",
              width: "26px",
              height: "26px",
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
                fontSize: "13px",
                color: "#ff9ca5",
              }}
            />
          </Box>
        )}
      </Box>

      {/* Candidate Transcript Box */}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: "4px",
          }}
        >
          <Typography
            sx={{
              fontSize: "8px",
              color: "#7f8794",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            You
          </Typography>

          {candidateCountdown !== null &&
            candidateCountdown >= 0 &&
            !isGeminiSpeaking && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  px: "7px",
                  py: "2px",
                  borderRadius: "5px",
                  backgroundColor:
                    candidateCountdown <= 5
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(230, 155, 53, 0.2)",
                  border: "1px solid",
                  borderColor:
                    candidateCountdown <= 5 ? "#ef4444" : "#e69b35",
                  color: candidateCountdown <= 5 ? "#ff8080" : "#f5b041",
                }}
              >
                <AccessTimeIcon sx={{ fontSize: "12px" }} />
                <Typography sx={{ fontSize: "10px", fontWeight: 800 }}>
                  {candidateCountdown}s to answer
                </Typography>
              </Box>
            )}
        </Box>

        <Typography
          sx={{
            fontSize: "11px",
            color: "#e2e5ea",
            lineHeight: 1.55,
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {candidateTranscript}
        </Typography>
      </Box>

      {/* Status notices */}
      {isSavingTurn && (
        <Typography
          sx={{
            fontSize: "9px",
            color: "#7f8794",
            flexShrink: 0,
            px: "2px",
          }}
        >
          Saving conversation...
        </Typography>
      )}

      {isCompletingInterview && (
        <Typography
          sx={{
            fontSize: "9px",
            color: "#7f8794",
            flexShrink: 0,
            px: "2px",
          }}
        >
          Finishing interview...
        </Typography>
      )}
    </Box>
  );
};

export default DesktopCandidateColumn;
