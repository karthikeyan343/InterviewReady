import React from "react";
import { Box, Typography } from "@mui/material";
import type { InterviewFilterType } from "../types";

interface InterviewsEmptyStateProps {
  loading: boolean;
  error?: string;
  selectedFilter: InterviewFilterType;
}

export const InterviewsEmptyState: React.FC<InterviewsEmptyStateProps> = ({
  loading,
  error,
  selectedFilter,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e4e9f1",
          borderRadius: "14px",
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography sx={{ color: "#7890ae" }}>Loading interviews...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #f0d0d0",
          borderRadius: "14px",
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography sx={{ color: "#c0392b" }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e4e9f1",
        borderRadius: "14px",
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontWeight: 700 }}>
        {selectedFilter === "Left"
          ? "No left interviews"
          : selectedFilter === "Completed"
          ? "No completed interviews"
          : "No interviews yet"}
      </Typography>
      <Typography sx={{ mt: 0.5, color: "#7890ae", fontSize: 14 }}>
        {selectedFilter === "Left"
          ? "Interviews you leave temporarily will appear here so you can continue them."
          : selectedFilter === "Completed"
          ? "Completed interviews with their reports will appear here."
          : "Start a new interview to see it here."}
      </Typography>
    </Box>
  );
};

export default InterviewsEmptyState;
