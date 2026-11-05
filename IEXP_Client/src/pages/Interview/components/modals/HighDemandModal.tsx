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
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

interface HighDemandModalProps {
  open: boolean;
  onReturnToDashboard: () => void;
}

export const HighDemandModal: React.FC<HighDemandModalProps> = ({
  open,
  onReturnToDashboard,
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
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            color: "#3b82f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CloudQueueIcon sx={{ fontSize: 22 }} />
        </Box>
        <Typography sx={{ fontSize: "17px", fontWeight: 800, color: "#ffffff" }}>
          High Service Demand
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 1.5 }}>
        <Typography sx={{ fontSize: "14px", color: "#d1d5db", lineHeight: 1.6, fontWeight: 500 }}>
          Sorry for the inconvenience. Gemini is currently experiencing high demand. Please continue this interview after 5 minutes.
        </Typography>

        <Box
          sx={{
            mt: 2,
            p: 1.8,
            borderRadius: "10px",
            backgroundColor: "#242934",
            border: "1px solid #333a4a",
          }}
        >
          <Typography sx={{ fontSize: "12px", color: "#9ca3af", lineHeight: 1.5 }}>
            Your answered questions and interview progress have been safely saved. You can resume anytime from your Dashboard.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5, justifyContent: "flex-end" }}>
        <Button
          onClick={onReturnToDashboard}
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
          Return to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
};

