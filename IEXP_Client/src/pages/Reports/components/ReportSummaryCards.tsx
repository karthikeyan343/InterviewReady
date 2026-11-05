import React from "react";
import { Box, Typography } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface ReportSummaryCardsProps {
  completedCount: number;
  averageScore: number | null;
  bestScore: number | null;
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({
  completedCount,
  averageScore,
  bestScore,
}) => {
  const summaryItems = [
    {
      label: "Reports Generated",
      value: completedCount,
      icon: <AssessmentOutlinedIcon />,
    },
    {
      label: "Average Score",
      value: averageScore !== null ? `${averageScore}%` : "—",
      icon: <TrendingUpIcon />,
    },
    {
      label: "Best Score",
      value: bestScore !== null ? `${bestScore}%` : "—",
      icon: <AssessmentOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        mt: 3,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(3, 1fr)",
        },
        gap: 2,
      }}
    >
      {summaryItems.map((item) => (
        <Box
          key={item.label}
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e4e9f1",
            borderRadius: "14px",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              backgroundColor: "#edf4ff",
              color: "#1677e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.icon}
          </Box>

          <Box>
            <Typography sx={{ color: "#7890ae", fontSize: { xs: "11px", sm: "12px", md: "13px" } }}>
              {item.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.3,
                fontSize: { xs: "20px", sm: "23px", md: "27px" },
                fontWeight: 800,
              }}
            >
              {item.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
