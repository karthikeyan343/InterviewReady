import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../component/specifiedComponent/Dashboard/DashboardNavbar";

interface ReportNotRequiredStateProps {
  rightAction: React.ReactNode;
}

export const ReportNotRequiredState: React.FC<ReportNotRequiredStateProps> = ({ rightAction }) => {
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
              color: "#172b4d",
            }}
          >
            Report Not Generated
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#7185a3",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            This interview was completed before answering at least 50% of the questions. A performance report was not generated.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{
              mt: 3,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
