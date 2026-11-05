import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

interface NoAnswerReminderModalProps {
  open: boolean;
  onAnswerNow: () => void;
}

export const NoAnswerReminderModal: React.FC<NoAnswerReminderModalProps> = ({
  open,
  onAnswerNow,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1c1f26",
            color: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #2d3340",
            maxWidth: "460px",
            p: 1,
            boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2, px: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "10px",
            backgroundColor: "rgba(230, 155, 53, 0.15)",
            color: "#e69b35",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
          Please answer the question
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1.5 }}>
        <Typography sx={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.6, fontWeight: 500 }}>
          We haven't detected an answer yet. Please answer the current question to continue.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, justifyContent: "flex-end" }}>
        <Button
          id="answer-now-btn"
          onClick={onAnswerNow}
          variant="contained"
          sx={{
            backgroundColor: "#2563eb",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "13px",
            px: 3,
            py: 1,
            borderRadius: "8px",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
            "&:hover": {
              backgroundColor: "#1d4ed8",
            },
          }}
        >
          Answer Now
        </Button>
      </DialogActions>
    </Dialog>
  );
};

