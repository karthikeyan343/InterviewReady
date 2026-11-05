import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import type { ScoreBarProps } from "../types";

export const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, icon }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f7f9fc",
        border: "1px solid #edf0f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ color: "#1677e8", display: "flex" }}>{icon}</Box>
          <Typography
            sx={{
              fontSize: { xs: "11px", sm: "12px", md: "13px" },
              color: "#5f7392",
              lineHeight: 1.4,
            }}
          >
            {label}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "13px", md: "14px" },
            fontWeight: 800,
            color: "#172b4d",
            whiteSpace: "nowrap",
          }}
        >
          {value}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 7,
          borderRadius: 10,
          backgroundColor: "#e5ebf3",
          "& .MuiLinearProgress-bar": {
            borderRadius: 10,
            backgroundColor: "#1677e8",
          },
        }}
      />
    </Box>
  );
};
