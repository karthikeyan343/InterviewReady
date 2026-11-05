import React from "react";
import { Box, Button } from "@mui/material";
import { ArrowForward, PlayArrow } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const HeroActionButtons: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        alignItems: {
          xs: "stretch",
          sm: "center",
        },
        gap: {
          xs: 1.4,
          sm: 1.8,
          md: 2,
        },
        width: {
          xs: "100%",
          sm: "auto",
        },
        mb: {
          xs: 3,
          sm: 3.5,
          md: 0,
        },
        flexShrink: 0,
      }}
    >
      {/* Primary CTA Button */}
      <Button
        component={Link}
        to="/register"
        variant="contained"
        endIcon={<ArrowForward />}
        sx={{
          minWidth: {
            xs: "100%",
            sm: "190px",
            lg: "210px",
          },
          height: {
            xs: "48px",
            sm: "50px",
            md: "clamp(46px, 5.6vh, 52px)",
          },
          px: { xs: 3, md: "clamp(20px, 1.6vw, 26px)" },
          borderRadius: "12px",
          fontFamily: '"Manrope", sans-serif',
          fontSize: "15px",
          fontWeight: 700,
          letterSpacing: "0.2px",
          textTransform: "none",
          color: "#ffffff",
          backgroundColor: "#1468F2",
          boxShadow: "0 8px 22px rgba(20, 104, 242, 0.32)",
          transition: "all 0.25s ease",
          "&:hover": {
            backgroundColor: "#0F55CF",
            boxShadow: "0 10px 28px rgba(20, 104, 242, 0.42)",
            transform: "translateY(-1px)",
          },
          "& .MuiButton-endIcon": {
            marginLeft: "8px",
            "& svg": {
              fontSize: "20px",
            },
          },
        }}
      >
        Start Practicing
      </Button>

      {/* Secondary Button */}
      <Button
        href="#how-it-works"
        variant="outlined"
        startIcon={
          <Box
            sx={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              border: "1.5px solid #1468F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PlayArrow
              sx={{
                fontSize: "14px",
                color: "#1468F2",
                ml: "1px",
              }}
            />
          </Box>
        }
        sx={{
          minWidth: {
            xs: "100%",
            sm: "180px",
            lg: "200px",
          },
          height: {
            xs: "48px",
            sm: "50px",
            md: "clamp(46px, 5.6vh, 52px)",
          },
          px: { xs: 2.5, md: "clamp(16px, 1.4vw, 22px)" },
          borderRadius: "12px",
          borderColor: "#D8E0EE",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          color: "#08194D",
          fontFamily: '"Manrope", sans-serif',
          textTransform: "none",
          fontSize: "15px",
          fontWeight: 700,
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          transition: "all 0.25s ease",
          "&:hover": {
            borderColor: "#B9C8E5",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
            transform: "translateY(-1px)",
          },
          "& .MuiButton-startIcon": {
            marginRight: "6px",
          },
        }}
      >
        See How It Works
      </Button>
    </Box>
  );
};

export default HeroActionButtons;
