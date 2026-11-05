import React from "react";
import { Box, Typography } from "@mui/material";
import {
  ChatBubbleOutlined,
  DescriptionOutlined,
  TrendingUp,
} from "@mui/icons-material";

export const HeroMobileBadges: React.FC = () => {
  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        flexWrap: "wrap",
        justifyContent: { xs: "center", sm: "flex-start" },
        gap: 1,
        my: { xs: 3, sm: 2.8 },
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.4,
          py: 0.7,
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(220, 230, 246, 0.9)",
          boxShadow: "0 2px 8px rgba(15, 30, 80, 0.04)",
        }}
      >
        <Box
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            backgroundColor: "#1468F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChatBubbleOutlined sx={{ fontSize: "14px", color: "#FFFFFF" }} />
        </Box>
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#08194D" }}>
          AI Interviewer
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.4,
          py: 0.7,
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(220, 230, 246, 0.9)",
          boxShadow: "0 2px 8px rgba(15, 30, 80, 0.04)",
        }}
      >
        <Box
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            backgroundColor: "#1468F2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DescriptionOutlined sx={{ fontSize: "14px", color: "#FFFFFF" }} />
        </Box>
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#08194D" }}>
          Instant Feedback
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.4,
          py: 0.7,
          borderRadius: "12px",
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(220, 230, 246, 0.9)",
          boxShadow: "0 2px 8px rgba(15, 30, 80, 0.04)",
        }}
      >
        <Box
          sx={{
            width: "24px",
            height: "24px",
            borderRadius: "6px",
            backgroundColor: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrendingUp sx={{ fontSize: "14px", color: "#FFFFFF" }} />
        </Box>
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#08194D" }}>
          Track Progress
        </Typography>
      </Box>
    </Box>
  );
};

export default HeroMobileBadges;

