import React from "react";
import { Box, Typography } from "@mui/material";

export const FooterCopyright: React.FC = () => {
  return (
    <Box
      sx={{
        mt: {
          xs: 3.5,
          sm: 5,
        },
        pt: {
          xs: 2,
          sm: 2.5,
        },
        borderTop: "1px solid #edf0f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        textAlign: {
          xs: "center",
          sm: "left",
        },
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "10px",
            sm: "11px",
          },
          fontWeight: 400,
          color: "#7180a3",
        }}
      >
        © 2026 InterviewReady. All rights reserved.
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "10px",
            sm: "11px",
          },
          fontWeight: 400,
          color: "#7180a3",
        }}
      >
        Built for ambitious minds.
      </Typography>
    </Box>
  );
};

export default FooterCopyright;
