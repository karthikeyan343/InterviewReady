import React from "react";
import { Box, Typography } from "@mui/material";

export const HowItWorksHeader: React.FC = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: {
          xs: 5,
          md: 6.5,
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "13px",
            sm: "13px",
            md: "18px",
          },
          lineHeight: 1.4,
          fontWeight: 700,
          letterSpacing: "1.8px",
          color: "#6676d9",
          mb: 1,
        }}
      >
        HOW IT WORKS
      </Typography>

      <Typography
        component="h2"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "28px",
            sm: "34px",
            md: "38px",
          },
          lineHeight: 1.2,
          fontWeight: 700,
          letterSpacing: "-0.8px",
          color: "#111b3d",
          mb: 1.2,
        }}
      >
        Get started in 4 simple steps
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "13px",
            sm: "14px",
            md: "15px",
          },
          lineHeight: 1.6,
          fontWeight: 400,
          color: "#7180a3",
        }}
      >
        Go from preparation to progress in minutes.
      </Typography>
    </Box>
  );
};

export default HowItWorksHeader;
