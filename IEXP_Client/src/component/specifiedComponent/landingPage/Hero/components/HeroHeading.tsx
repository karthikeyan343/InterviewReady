import React from "react";
import { Box, Typography } from "@mui/material";

export const HeroHeading: React.FC = () => {
  return (
    <>
      {/* Heading */}
      <Typography
        component="h1"
        sx={{
          color: "#071638",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "34px",
            sm: "42px",
            md: "clamp(42px, 2.7vw + 1.2vh, 50px)",
            lg: "clamp(48px, 3.1vw + 1.2vh, 58px)",
            xl: "60px",
          },
          lineHeight: {
            xs: 1.15,
            sm: 1.12,
            md: 1.08,
          },
          fontWeight: 800,
          letterSpacing: {
            xs: "-1px",
            sm: "-1.5px",
            md: "-2px",
          },
          mb: {
            xs: 1.8,
            sm: 2,
            md: "clamp(12px, 1.6vh, 18px)",
          },
          flexShrink: 0,
        }}
      >
        Practice Smarter.
        <br />
        Get Interview
        <br />
        <Box
          component="span"
          sx={{
            color: "#1468F2",
            fontFamily: '"Manrope", sans-serif',
          }}
        >
          Ready.
        </Box>
      </Typography>

      {/* Subtitle */}
      <Typography
        component="p"
        sx={{
          color: "#4A5D8A",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "14.5px",
            sm: "15.5px",
            md: "clamp(14.5px, 0.9vw, 16.5px)",
          },
          fontWeight: 500,
          lineHeight: {
            xs: 1.55,
            md: 1.5,
          },
          maxWidth: {
            xs: "100%",
            sm: "520px",
          },
          mb: {
            xs: 2.8,
            sm: 3,
            md: "clamp(18px, 2.4vh, 26px)",
          },
          flexShrink: 0,
        }}
      >
        Simulate real interview experiences, get AI feedback, and build
        the confidence to land your next role.
      </Typography>
    </>
  );
};
