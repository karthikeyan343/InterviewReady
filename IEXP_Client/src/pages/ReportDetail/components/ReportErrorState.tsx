import React from "react";
import { Box, Typography } from "@mui/material";
import DashboardNavbar from "../../../component/specifiedComponent/Dashboard/DashboardNavbar";

interface ReportErrorStateProps {
  rightAction: React.ReactNode;
  error?: string | null;
}

export const ReportErrorState: React.FC<ReportErrorStateProps> = ({ rightAction, error }) => {
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
            mt: 3,
            backgroundColor: "#fff",
            border: "1px solid #f0d2d2",
            borderRadius: 3,
            p: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 800,
              color: "#172b4d",
            }}
          >
            Unable to load report
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#7185a3",
            }}
          >
            {error || "Report data is unavailable."}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
