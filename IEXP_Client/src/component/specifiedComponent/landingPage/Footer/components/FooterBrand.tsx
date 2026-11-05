import React from "react";
import { Box, Typography } from "@mui/material";
import logo from "../../../../../assets/LogoIR.png";

export const FooterBrand: React.FC = () => {
  return (
    <Box
      sx={{
        gridColumn: {
          xs: "1 / -1",
          sm: "auto",
        },
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="InterviewReady"
        sx={{
          width: {
            xs: "165px",
            sm: "200px",
          },
          height: "auto",
          display: "block",
          mb: 1.2,
        }}
      />

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "12px",
            sm: "13px",
          },
          fontWeight: 400,
          color: "#7180a3",
          lineHeight: 1.5,
        }}
      >
        Practice. Improve. Get Hired.
      </Typography>
    </Box>
  );
};

export default FooterBrand;
