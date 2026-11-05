import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface ReadyActionButtonsProps {
  loading: boolean;
  isCheckingSession: boolean;
  isResume: boolean;
  onStart: () => void;
  onBack: () => void;
}

export const ReadyActionButtons: React.FC<ReadyActionButtonsProps> = ({
  loading,
  isCheckingSession,
  isResume,
  onStart,
  onBack,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: { xs: "stretch", sm: "flex-end" },
        gap: { xs: "8px", sm: "10px" },
        mt: "4px",
      }}
    >
      <Button
        variant="contained"
        onClick={onStart}
        disabled={loading || isCheckingSession}
        startIcon={
          loading || isCheckingSession ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <PlayArrowIcon sx={{ fontSize: "17px !important" }} />
          )
        }
        sx={{
          order: { xs: 1, sm: 2 },
          height: { xs: "44px", sm: "40px" },
          px: "22px",
          borderRadius: "9px",
          textTransform: "none",
          fontFamily: '"Manrope", sans-serif',
          fontSize: { xs: "12.5px", sm: "12px" },
          fontWeight: 800,
          backgroundColor: "#356ae6",
          boxShadow: "none",
          width: { xs: "100%", sm: "auto" },
          "&:hover": {
            backgroundColor: "#2f5fd0",
            boxShadow: "none",
          },
        }}
      >
        {loading
          ? isResume
            ? "Resuming Interview..."
            : "Joining Interview..."
          : isCheckingSession
          ? "Checking Session..."
          : isResume
          ? "Resume Interview"
          : "Join Interview"}
      </Button>

      <Button
        onClick={onBack}
        disabled={loading || isCheckingSession}
        startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
        sx={{
          order: { xs: 2, sm: 1 },
          height: { xs: "40px", sm: "40px" },
          px: "16px",
          borderRadius: "9px",
          textTransform: "none",
          fontFamily: '"Manrope", sans-serif',
          fontSize: "12px",
          fontWeight: 700,
          color: "#9aa1ad",
          border: "1px solid #30343d",
          width: { xs: "100%", sm: "auto" },
          "&:hover": {
            borderColor: "#444b57",
            backgroundColor: "rgba(255,255,255,0.04)",
          },
        }}
      >
        Back
      </Button>
    </Box>
  );
};

export default ReadyActionButtons;
