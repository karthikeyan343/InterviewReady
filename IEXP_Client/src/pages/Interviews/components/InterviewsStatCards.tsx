import React from "react";
import { Box, Typography } from "@mui/material";

interface InterviewsStatCardsProps {
  totalInterviewsCount: number;
  completedInterviewsCount: number;
  averageScoreDisplay: string;
}

export const InterviewsStatCards: React.FC<InterviewsStatCardsProps> = ({
  totalInterviewsCount,
  completedInterviewsCount,
  averageScoreDisplay,
}) => {
  const stats = [
    [String(totalInterviewsCount), "Total Interviews"],
    [String(completedInterviewsCount), "Completed"],
    [averageScoreDisplay, "Average Score"],
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(3, 1fr)",
        },
        gap: 2,
        mb: 4,
      }}
    >
      {stats.map(([value, label]) => (
        <Box
          key={label}
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e4e9f1",
            borderRadius: "14px",
            p: 2.5,
          }}
        >
          <Typography
            sx={{
              color: "#7890ae",
              fontSize: 13,
            }}
          >
            {label}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 27,
              fontWeight: 800,
            }}
          >
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default InterviewsStatCards;
