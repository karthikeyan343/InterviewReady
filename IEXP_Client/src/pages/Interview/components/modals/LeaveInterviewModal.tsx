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
import LogoutIcon from "@mui/icons-material/Logout";

interface LeaveInterviewModalProps {
  open: boolean;
  answeredCount: number;
  totalQuestions: number;
  onClose: () => void;
  onConfirmLeave: () => void;
}

export const LeaveInterviewModal: React.FC<LeaveInterviewModalProps> = ({
  open,
  answeredCount,
  totalQuestions,
  onClose,
  onConfirmLeave,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LogoutIcon sx={{ fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
          Leave this interview?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1.5 }}>
        <Typography sx={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.6, fontWeight: 500 }}>
          Your progress will be saved and you can continue this interview later.
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 1.8,
            borderRadius: "10px",
            backgroundColor: "#242934",
            border: "1px solid #333a4a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "#9ca3af" }}>
            Saved progress:
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#60a5fa" }}>
            {answeredCount} / {totalQuestions || 20} answered
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, gap: 1.2, justifyContent: "flex-end" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#2563eb",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "13px",
            px: 2.5,
            py: 0.9,
            borderRadius: "8px",
            boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
            "&:hover": {
              backgroundColor: "#1d4ed8",
            },
          }}
        >
          Continue Interview
        </Button>

        <Button
          onClick={onConfirmLeave}
          variant="outlined"
          sx={{
            color: "#9ca3af",
            borderColor: "#374151",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "13px",
            px: 2,
            py: 0.9,
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#242934",
              borderColor: "#4b5563",
              color: "#ffffff",
            },
          }}
        >
          Leave Interview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

