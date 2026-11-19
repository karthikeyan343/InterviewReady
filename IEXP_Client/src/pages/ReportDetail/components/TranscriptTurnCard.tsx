import React, { useState } from "react";
import { Box, Typography, Chip, IconButton, Tooltip } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import type { ConversationTurn } from "../../../services/apiQueries";

interface TranscriptTurnCardProps {
  turn: ConversationTurn;
}

export const TranscriptTurnCard: React.FC<TranscriptTurnCardProps> = ({ turn }) => {
  const [copied, setCopied] = useState(false);
  const isInterviewer = turn.speaker === "interviewer";
  const isSkipped =
    !isInterviewer &&
    (turn.text.toLowerCase().startsWith("[skipped") ||
      turn.text.toLowerCase().startsWith("[no answer"));

  const timeStr = turn.timestamp
    ? new Date(turn.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(turn.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: isInterviewer ? "#F8FAFC" : "#FFFFFF",
        border: "1px solid",
        borderColor: isInterviewer ? "#DCE6F6" : "#E2E8F0",
        borderLeft: "4px solid",
        borderLeftColor: isInterviewer ? "#1468F2" : isSkipped ? "#F59E0B" : "#10B981",
        borderRadius: "12px",
        p: { xs: 2, sm: 2.5 },
        mb: 2,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.2,
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            size="small"
            icon={
              isInterviewer ? (
                <SmartToyOutlinedIcon sx={{ fontSize: "16px !important" }} />
              ) : (
                <PersonOutlineOutlinedIcon sx={{ fontSize: "16px !important" }} />
              )
            }
            label={isInterviewer ? "AI Interviewer" : "Candidate (You)"}
            sx={{
              fontWeight: 700,
              fontSize: "12px",
              backgroundColor: isInterviewer ? "#E8F1FD" : "#ECFDF5",
              color: isInterviewer ? "#1468F2" : "#059669",
              border: "1px solid",
              borderColor: isInterviewer ? "rgba(20, 104, 242, 0.2)" : "rgba(16, 185, 129, 0.2)",
            }}
          />

          {turn.isQuestion && (
            <Chip
              size="small"
              label={`Question #${turn.sequence}`}
              sx={{
                fontWeight: 700,
                fontSize: "11px",
                backgroundColor: "#F1F5F9",
                color: "#475569",
              }}
            />
          )}

          {isSkipped && (
            <Chip
              size="small"
              label="Skipped"
              sx={{
                fontWeight: 700,
                fontSize: "11px",
                backgroundColor: "#FEF3C7",
                color: "#D97706",
              }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {timeStr && (
            <Typography sx={{ fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>
              {timeStr}
            </Typography>
          )}

          <Tooltip title={copied ? "Copied!" : "Copy text"}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                color: copied ? "#10B981" : "#94A3B8",
                p: "4px",
                "&:hover": { color: "#1468F2", backgroundColor: "#F1F5F9" },
              }}
            >
              {copied ? <CheckIcon sx={{ fontSize: "16px" }} /> : <ContentCopyIcon sx={{ fontSize: "16px" }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: { xs: "13.5px", sm: "14.5px" },
          lineHeight: 1.7,
          color: isInterviewer ? "#1E293B" : isSkipped ? "#94A3B8" : "#334155",
          fontStyle: isSkipped ? "italic" : "normal",
          whiteSpace: "pre-wrap",
        }}
      >
        {turn.text}
      </Typography>
    </Box>
  );
};
