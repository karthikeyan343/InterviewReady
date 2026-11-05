import React from "react";
import { Box, Typography } from "@mui/material";

interface ResumeAlertsProps {
  message?: string;
  error?: string;
}

export const ResumeAlerts: React.FC<ResumeAlertsProps> = ({ message, error }) => {
  return (
    <>
      {message && (
        <Box
          sx={{
            width: "100%",
            mb: 3,
            p: {
              xs: 1.5,
              sm: 2,
            },
            borderRadius: "12px",
            backgroundColor: "#eaf8ef",
            border: "1px solid #cdebd8",
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              color: "#26834a",
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "12px",
                sm: "14px",
              },
              lineHeight: 1.5,
            }}
          >
            {message}
          </Typography>
        </Box>
      )}

      {error && (
        <Box
          sx={{
            width: "100%",
            mb: 3,
            p: {
              xs: 1.5,
              sm: 2,
            },
            borderRadius: "12px",
            backgroundColor: "#fff4f3",
            border: "1px solid #f0d0d0",
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              color: "#c0392b",
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "12px",
                sm: "14px",
              },
              lineHeight: 1.5,
              overflowWrap: "break-word",
            }}
          >
            {error}
          </Typography>
        </Box>
      )}
    </>
  );
};
export default ResumeAlerts;
