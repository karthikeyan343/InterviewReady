import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import ScheduleOutlinedIcon from "@mui/icons-material/Schedule";
import { formatDateTime } from "../utils";

interface SummaryCardProps {
  summary?: string | null;
  createdAt?: string | null;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, createdAt }) => {
  return (
    <Box
      sx={{
        mt: 2,
        backgroundColor: "#fff",
        border: "1px solid #e3e9f2",
        borderRadius: 3,
        p: { xs: 2.5, md: 3 },
      }}
    >
      <Typography sx={{ fontSize: { xs: "16px", sm: "18px", md: "19px" }, fontWeight: 800 }}>
        AI Summary
      </Typography>

      <Typography
        sx={{
          mt: 1.5,
          color: "#5f7392",
          lineHeight: { xs: 1.65, sm: 1.75, md: 1.8 },
          fontSize: { xs: "12px", sm: "13px", md: "14px" },
        }}
      >
        {summary || "No summary was provided in this report."}
      </Typography>

      <Divider sx={{ my: 2.5 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#7890ae",
        }}
      >
        <ScheduleOutlinedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: { xs: "10px", sm: "11px", md: "12px" } }}>
          Report generated {formatDateTime(createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};
