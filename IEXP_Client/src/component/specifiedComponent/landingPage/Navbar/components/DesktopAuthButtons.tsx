import React from "react";
import { Box, Button } from "@mui/material";

interface DesktopAuthButtonsProps {
  onAuthNav: (destination: string) => void;
}

export const DesktopAuthButtons: React.FC<DesktopAuthButtonsProps> = ({ onAuthNav }) => {
  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "flex",
        },
        alignItems: "center",
        gap: {
          md: 1.5,
          lg: 2,
        },
        ml: {
          md: 3,
          lg: 4,
        },
      }}
    >
      <Button
        onClick={() => onAuthNav("/login")}
        sx={{
          minWidth: "auto",
          px: 1.5,
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            md: "14px",
            lg: "16px",
          },
          fontWeight: 600,
          color: "#17203f",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "transparent",
            color: "#1769e0",
          },
        }}
      >
        Sign In
      </Button>

      <Button
        onClick={() => onAuthNav("/register")}
        variant="contained"
        sx={{
          minWidth: {
            md: "125px",
            lg: "135px",
          },
          height: {
            md: "44px",
            lg: "46px",
          },
          px: 2.5,
          borderRadius: "22px",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            md: "14px",
            lg: "15px",
          },
          fontWeight: 600,
          textTransform: "none",
          background: "linear-gradient(135deg, #2878f0 0%, #1769e0 100%)",
          boxShadow: "0 6px 18px rgba(37, 115, 235, 0.22)",
          "&:hover": {
            background: "linear-gradient(135deg, #1769e0 0%, #125bc8 100%)",
            boxShadow: "0 8px 22px rgba(37, 115, 235, 0.30)",
          },
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};
