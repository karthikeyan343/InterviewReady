import React from "react";
import { Box, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MicIcon from "@mui/icons-material/Mic";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface MobileLiveConversationCardProps {
  interviewerTranscript: string;
  candidateTranscript: string;
  candidateCountdown: number | null;
  isGeminiSpeaking: boolean;
  isSavingTurn: boolean;
}

export const MobileLiveConversationCard: React.FC<MobileLiveConversationCardProps> = ({
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
        backgroundColor: "#171a21",
        border: "1px solid #272b33",
        borderRadius: "14px",
        p: { xs: "10px 12px", sm: "14px 16px" },
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        overflow: "hidden",
      }}
    >
      {/* AI Question Section */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            mb: "4px",
            flexShrink: 0,
          }}
        >
          <SmartToyIcon sx={{ fontSize: "14px", color: "#356ae6" }} />
          <Typography
            sx={{
              fontSize: "9px",
              color: "#858b98",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            AI Interviewer
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            pr: "4px",
            "&::-webkit-scrollbar": {
              width: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#353a44",
              borderRadius: "8px",
            },
            scrollbarWidth: "thin",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "13px" },
              color: "#f1f3f7",
              lineHeight: 1.55,
              fontWeight: 500,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {interviewerTranscript}
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          height: "1px",
          backgroundColor: "#272b33",
          width: "100%",
          flexShrink: 0,
        }}
      />

      {/* Candidate Speech Section */}
      <Box
        sx={{
          flexShrink: 0,
          maxHeight: { xs: "72px", sm: "90px" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "6px",
            mb: "3px",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <MicIcon sx={{ fontSize: "13px", color: "#5ecb8a" }} />
            <Typography
              sx={{
                fontSize: "9px",
                color: "#858b98",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              You
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {candidateCountdown !== null &&
              candidateCountdown >= 0 &&
              !isGeminiSpeaking && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    px: "6px",
                    py: "1px",
                    borderRadius: "4px",
                    backgroundColor:
                      candidateCountdown <= 5
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(230, 155, 53, 0.2)",
                    border: "1px solid",
                    borderColor:
                      candidateCountdown <= 5 ? "#ef4444" : "#e69b35",
                    color:
                      candidateCountdown <= 5 ? "#ff8080" : "#f5b041",
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: "11px" }} />
                  <Typography sx={{ fontSize: "9px", fontWeight: 800 }}>
                    {candidateCountdown}s to answer
                  </Typography>
                </Box>
              )}

            {isSavingTurn && (
              <Typography
                sx={{
                  fontSize: "9px",
                  color: "#7f8794",
                }}
              >
                Saving...
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            overflowY: "auto",
            pr: "4px",
            "&::-webkit-scrollbar": {
              width: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#353a44",
              borderRadius: "8px",
            },
            scrollbarWidth: "thin",
          }}
        >
          <Typography
            sx={{
              fontSize: "11.5px",
              color: "#dce0e8",
              lineHeight: 1.5,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {candidateTranscript}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileLiveConversationCard;
