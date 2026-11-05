import React from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../component/specifiedComponent/Dashboard/DashboardNavbar";

interface ReportProcessingStateProps {
  rightAction: React.ReactNode;
}

export const ReportProcessingState: React.FC<ReportProcessingStateProps> = ({ rightAction }) => {
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
            border: "1px solid #e2e8f4",
            borderRadius: 3,
            p: { xs: 3, md: 6 },
            textAlign: "center",
            maxWidth: "680px",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#edf4ff",
              color: "#1677e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <HourglassEmptyIcon sx={{ fontSize: 28 }} />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 20, md: 24 },
              fontWeight: 800,
              color: "#172b4d",
              mb: 1,
            }}
          >
            Your performance report is being prepared
          </Typography>

          <Typography
            sx={{
              color: "#7185a3",
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 480,
              mx: "auto",
              mb: 3,
            }}
          >
            Gemini is analyzing your responses and generating detailed feedback. This typically takes 10–20 seconds.
          </Typography>

          <LinearProgress
            sx={{
              height: 6,
              borderRadius: 4,
              maxWidth: 320,
              mx: "auto",
              mb: 3,
            }}
          />

          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              color: "#1677e8",
            }}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
