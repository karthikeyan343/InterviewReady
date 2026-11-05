import React from "react";
import { Box, Typography } from "@mui/material";

export const HeroPillBadge: React.FC = () => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        px: { xs: 1.5, sm: 1.8, md: 2 },
        py: { xs: 0.65, sm: 0.7, md: "clamp(5px, 0.7vh, 7px)" },
        borderRadius: "50px",
        backgroundColor: "rgba(255, 255, 255, 0.94)",
        border: "1px solid rgba(0, 0, 0, 0.16)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        width: "fit-content",
        mb: {
          xs: 1.8,
          sm: 2,
          md: "clamp(12px, 1.8vh, 18px)",
        },
        boxShadow: "0 2px 10px rgba(20, 104, 242, 0.05)",
        flexShrink: 0,
      }}
    >
      {/* Red pulsating dot */}
      <Box
        sx={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: "#f21414aa",
          boxShadow: "0 0 8px rgba(242, 20, 20, 0.57)",
          flexShrink: 0,
          animation: "pulseDot 2s ease-in-out infinite",
        }}
      />
      <Typography
        component="span"
        sx={{
          color: "black",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "10.5px",
            sm: "11.5px",
            md: "12px",
          },
          fontWeight: 700,
          letterSpacing: {
            xs: "1.1px",
            sm: "1.5px",
          },
          lineHeight: 1.3,
          textTransform: "uppercase",
        }}
      >
        AI-POWERED INTERVIEW PREPARATION
      </Typography>
    </Box>
  );
};
