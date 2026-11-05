import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

interface LandingDrawerAuthSectionProps {
  onAuthNav: (destination: string) => void;
}

export const LandingDrawerAuthSection: React.FC<LandingDrawerAuthSectionProps> = ({
  onAuthNav,
}) => {
  return (
    <>
      <Box
        sx={{
          height: "1px",
          backgroundColor: "#EEF2F8",
          my: 1.75,
          mx: 1,
        }}
      />

      {/* Sign In Navigation Row */}
      <Box
        component="button"
        type="button"
        onClick={() => onAuthNav("/login")}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: { xs: "58px", sm: "62px" },
          px: 1.5,
          borderRadius: "20px",
          cursor: "pointer",
          backgroundColor: "transparent",
          border: "1.5px solid transparent",
          outline: "none",
          font: "inherit",
          textAlign: "left",
          width: "100%",
          transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            backgroundColor: "rgba(240, 244, 253, 0.7)",
          },
          "&:focus-visible": {
            outline: "2px solid #1468F2",
            outlineOffset: "2px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.75,
          }}
        >
          <Box
            sx={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              backgroundColor: "#F0F4FC",
              color: "#08194D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LoginRoundedIcon sx={{ fontSize: "22px" }} />
          </Box>

          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "16px",
              fontWeight: 600,
              color: "#08194D",
            }}
          >
            Sign In
          </Typography>
        </Box>

        <ChevronRightRoundedIcon
          sx={{
            fontSize: "22px",
            color: "#8FA0BE",
          }}
        />
      </Box>

      {/* Get Started CTA */}
      <Button
        onClick={() => onAuthNav("/register")}
        variant="contained"
        fullWidth
        endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "20px" }} />}
        sx={{
          mt: 2,
          mb: 1.5,
          height: { xs: "52px", sm: "54px" },
          borderRadius: "22px",
          background:
            "linear-gradient(135deg, #0984E3 0%, #1769E0 45%, #6C38FF 100%)",
          boxShadow:
            "0 10px 24px -4px rgba(23, 105, 224, 0.38), 0 4px 12px -2px rgba(108, 56, 255, 0.28)",
          fontFamily: '"Manrope", sans-serif',
          fontSize: "16px",
          fontWeight: 600,
          textTransform: "none",
          color: "#FFFFFF",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #0779D3 0%, #145FCC 45%, #5E2DE3 100%)",
            boxShadow:
              "0 14px 28px -4px rgba(23, 105, 224, 0.45), 0 6px 16px -2px rgba(108, 56, 255, 0.35)",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "scale(0.98)",
          },
          "&:focus-visible": {
            outline: "2px solid #1468F2",
            outlineOffset: "2px",
          },
        }}
      >
        Get Started
      </Button>
    </>
  );
};

export default LandingDrawerAuthSection;
