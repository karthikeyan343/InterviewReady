import React from "react";
import { Box, Typography } from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

export const DrawerFooter: React.FC = () => {
  return (
    <Box
      sx={{
        flexShrink: 0,
        position: "relative",
        pt: 1.5,
        pb: { xs: 2.5, sm: 3 },
        px: { xs: 2.5, sm: 3 },
      }}
    >
      {/* Subtle decorative curved wave shape at bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "110px",
          pointerEvents: "none",
          overflow: "hidden",
          borderBottomLeftRadius: "28px",
          zIndex: 0,
        }}
      >
        <svg
          viewBox="0 0 380 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%" }}
        >
          <path
            d="M0,40 C90,10 180,90 380,20 L380,110 L0,110 Z"
            fill="url(#dashDrawerWave1)"
            opacity="0.45"
          />
          <path
            d="M0,70 C120,35 240,100 380,50 L380,110 L0,110 Z"
            fill="url(#dashDrawerWave2)"
            opacity="0.35"
          />
          <defs>
            <linearGradient
              id="dashDrawerWave1"
              x1="0"
              y1="0"
              x2="380"
              y2="110"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D4E3FC" />
              <stop offset="0.6" stopColor="#E9E2FD" />
              <stop offset="1" stopColor="#F5F0FF" />
            </linearGradient>
            <linearGradient
              id="dashDrawerWave2"
              x1="0"
              y1="0"
              x2="380"
              y2="110"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#BFD6FD" />
              <stop offset="0.5" stopColor="#DDD4FC" />
              <stop offset="1" stopColor="#EDE5FE" />
            </linearGradient>
          </defs>
        </svg>
      </Box>

      {/* Footer message row */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <AutoAwesomeRoundedIcon
          sx={{
            fontSize: "18px",
            color: "#1468F2",
            filter: "drop-shadow(0 2px 4px rgba(20, 104, 242, 0.25))",
          }}
        />

        <Box
          sx={{
            width: "1px",
            height: "16px",
            backgroundColor: "#DCE6F6",
          }}
        />

        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: "13px",
            fontWeight: 500,
            color: "#5C6F96",
          }}
        >
          Your next interview starts here.
        </Typography>
      </Box>
    </Box>
  );
};

export default DrawerFooter;
