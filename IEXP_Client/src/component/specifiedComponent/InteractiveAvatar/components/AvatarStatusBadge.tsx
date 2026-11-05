import React from "react";
import { Box, Typography } from "@mui/material";
import type { AvatarStatus } from "../types";

interface AvatarStatusBadgeProps {
  status: AvatarStatus;
}

export const AvatarStatusBadge: React.FC<AvatarStatusBadgeProps> = ({ status }) => {
  const statusLabel =
    status === "Speaking"
      ? "Speaking"
      : status === "Thinking"
      ? "Thinking"
      : "Listening";

  const statusColor =
    status === "Speaking"
      ? "#73d5ff"
      : status === "Thinking"
      ? "#a5c8ff"
      : "#72b9ff";

  return (
    <Box
      sx={{
        position: "absolute",
        top: 18,
        right: 18,
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        px: 1.25,
        py: 0.65,
        borderRadius: 99,
        background: "rgba(7, 42, 78, 0.46)",
        border: "1px solid rgba(78, 175, 255, 0.24)",
        backdropFilter: "blur(12px)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: statusColor,
          boxShadow: `0 0 10px ${statusColor}`,
        }}
      />

      <Typography
        sx={{
          color: statusColor,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 1.1,
          textTransform: "uppercase",
        }}
      >
        {statusLabel}
      </Typography>
    </Box>
  );
};

export default AvatarStatusBadge;
