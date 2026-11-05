import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { Link } from "react-router-dom";
import howItWorksImage from "../../../../../assets/HowItWorksImg.png";

export const HowItWorksBanner: React.FC = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1.05fr 0.95fr",
        },
        alignItems: "stretch",
        minHeight: {
          md: "300px",
        },
        overflow: "hidden",
        borderRadius: {
          xs: "14px",
          md: "0px",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: {
            xs: "250px",
            sm: "340px",
            md: "300px",
          },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={howItWorksImage}
          alt="Practice interview with InterviewReady"
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          px: {
            xs: 2.5,
            sm: 4,
            md: 5,
          },
          py: {
            xs: 4,
            md: 3,
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "10px",
              sm: "11px",
              md: "11px",
            },
            fontWeight: 700,
            letterSpacing: "1.5px",
            color: "#6676d9",
            mb: 1.2,
          }}
        >
          A MORE CONFIDENT YOU
        </Typography>

        <Typography
          component="h3"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "26px",
              sm: "30px",
              md: "32px",
            },
            lineHeight: 1.18,
            fontWeight: 700,
            letterSpacing: "-0.7px",
            color: "#111b3d",
            mb: 1.5,
            maxWidth: "420px",
          }}
        >
          Practice today.
          <br />
          Perform tomorrow.
        </Typography>

        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "13px",
              sm: "14px",
              md: "14px",
            },
            lineHeight: 1.65,
            fontWeight: 400,
            color: "#7180a3",
            maxWidth: "430px",
            mb: 2.5,
          }}
        >
          InterviewReady helps you build the confidence and skills you need to
          crack interviews and achieve your career goals.
        </Typography>

        <Button
          component={Link}
          to="/register"
          variant="contained"
          endIcon={<ArrowRightAltRoundedIcon />}
          sx={{
            alignSelf: "flex-start",
            minWidth: "160px",
            height: "44px",
            px: 2.2,
            borderRadius: "7px",
            backgroundColor: "#1769e0",
            boxShadow: "0 5px 14px rgba(23, 105, 224, 0.18)",
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "12px",
              sm: "13px",
            },
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#125bc8",
              boxShadow: "0 7px 18px rgba(23, 105, 224, 0.24)",
            },
          }}
        >
          Start Your Journey
        </Button>
      </Box>
    </Box>
  );
};

export default HowItWorksBanner;
