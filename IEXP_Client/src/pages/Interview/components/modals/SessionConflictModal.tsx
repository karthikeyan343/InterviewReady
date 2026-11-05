import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface SessionConflictModalProps {
  open: boolean;
  onReturnToDashboard: () => void;
}

export const SessionConflictModal: React.FC<SessionConflictModalProps> = ({
  open,
  onReturnToDashboard,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onReturnToDashboard}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "14px",
            p: 1.5,
            maxWidth: "460px",
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.18)",
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", fontSize: "19px", pb: 1 }}>
        Active Session on Another Device
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#475569", fontSize: "14px", lineHeight: 1.6 }}>
          This interview session is currently active in another browser window, tab, or device. To prevent lost answers and interview state desynchronization, simultaneous multi-device access is not permitted.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1, justifyContent: "flex-end", gap: 1 }}>
        <Button
          onClick={onReturnToDashboard}
          variant="contained"
          sx={{
            backgroundColor: "#2563eb",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "8px",
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

