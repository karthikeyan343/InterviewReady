import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../component/specifiedComponent/Dashboard/DashboardNavbar";

interface ReportFailedStateProps {
  rightAction: React.ReactNode;
  errorMessage?: string | null;
  retryError: string | null;
  retrying: boolean;
  onRetry: () => void;
}

export const ReportFailedState: React.FC<ReportFailedStateProps> = ({
  rightAction,
  errorMessage,
  retryError,
  retrying,
  onRetry,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
      }}
    >
      <DashboardNavbar hideNavLinks rightAction={rightAction} />
      <Box sx={{ px: { xs: 2, md: 8 }, py: 5 }}>
        <Box
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            border: "1px solid #f0d2d2",
            borderRadius: 3,
            p: 4,
            maxWidth: "600px",
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 800,
              color: "#c53b3b",
            }}
          >
            Your performance report could not be generated
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#7185a3",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {errorMessage ||
              "Gemini experienced an issue while analyzing the interview session. You can retry report generation without losing your interview."}
          </Typography>

          {retryError && (
            <Typography
              sx={{
                mt: 1.5,
                color: "#c53b3b",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {retryError}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={onRetry}
              disabled={retrying}
              startIcon={retrying ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                fontWeight: 700,
                backgroundColor: "#1677e8",
              }}
            >
              {retrying ? "Retrying..." : "Retry Report Generation"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#536887",
                borderColor: "#d0d7e2",
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
