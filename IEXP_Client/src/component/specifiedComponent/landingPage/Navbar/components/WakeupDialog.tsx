import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface WakeupDialogProps {
  open: boolean;
  popupError: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const WakeupDialog: React.FC<WakeupDialogProps> = ({
  open,
  popupError,
  onClose,
  onRetry,
}) => {
  return (
    <Dialog
      open={open}
      onClose={popupError ? onClose : undefined}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            px: { xs: 3, sm: 4 },
            py: { xs: 3.5, sm: 4 },
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            fontFamily: '"Manrope", sans-serif',
            boxShadow: "0 24px 60px rgba(15, 30, 80, 0.14)",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {!popupError ? (
          /* Waking state */
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <CircularProgress
                size={44}
                thickness={4}
                sx={{ color: "#1769e0" }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: "18px",
                fontWeight: 700,
                color: "#07194D",
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              Starting InterviewReady...
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                color: "#536994",
                lineHeight: 1.6,
              }}
            >
              Our server is waking up. This usually takes a few seconds.
            </Typography>
          </>
        ) : (
          /* Failed / error state */
          <>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: "18px",
                fontWeight: 700,
                color: "#07194D",
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              Could not reach the server
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: "14px",
                fontWeight: 400,
                color: "#536994",
                lineHeight: 1.6,
                mb: 3,
              }}
            >
              The server didn't respond in time. Please check your connection
              and try again.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1.5,
              }}
            >
              <Button
                onClick={onClose}
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#536994",
                  borderRadius: "8px",
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={onRetry}
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "8px",
                  backgroundColor: "#1769e0",
                  boxShadow: "0 6px 16px rgba(23, 105, 224, 0.22)",
                  "&:hover": {
                    backgroundColor: "#125bc8",
                  },
                }}
              >
                Retry
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
