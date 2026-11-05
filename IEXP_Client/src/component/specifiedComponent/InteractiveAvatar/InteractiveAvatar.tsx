import React from "react";
import { Box } from "@mui/material";
import type { InteractiveAvatarProps } from "./types";
import { useAvatarCanvas } from "./hooks/useAvatarCanvas";
import AvatarStatusBadge from "./components/AvatarStatusBadge";

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  status,
  audioLevel = 0,
}) => {
  const { canvasRef, containerRef } = useAvatarCanvas(status, audioLevel);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
        overflow: "hidden",
        borderRadius: 4,
        background:
          "radial-gradient(circle at 50% 35%, #0b2442 0%, #061426 38%, #020711 100%)",
        border: "1px solid rgba(70, 164, 255, 0.12)",
        boxShadow: "inset 0 0 80px rgba(0, 104, 210, 0.08)",
      }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />

      <AvatarStatusBadge status={status} />
    </Box>
  );
};

export default InteractiveAvatar;
