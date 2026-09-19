import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

import LoginForm from "../component/specifiedComponent/auth/LoginForm";
import loginImage from "../assets/HowItWorksImg.png";

const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",
        display: "flex",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      {/* Desktop Image Section */}
      <Box
        sx={{
          width: { xs: "0%", md: "60%" },
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          display: { xs: "none", md: "block" },
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={loginImage}
          alt="InterviewReady interview preparation"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Login Section */}
      <Box
        sx={{
          width: { xs: "100%", md: "40%" },
          height: "100vh",
          minHeight: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: '"Manrope", sans-serif',

          /*
           * Mobile / Tablet Background
           */
          backgroundColor: {
            xs: "transparent",
            md: "#ffffff",
          },

          backgroundImage: {
            xs: `linear-gradient(
              rgba(255, 255, 255, 0.68),
              rgba(255, 255, 255, 0.68)
            ), url(${loginImage})`,
            md: "none",
          },

          backgroundSize: {
            xs: "cover",
            md: "initial",
          },

          backgroundPosition: {
            xs: "58% center",
            sm: "58% center",
            md: "initial",
          },

          backgroundRepeat: {
            xs: "no-repeat",
            md: "initial",
          },
        }}
      >
        {/* Back To Home */}
        <Box
          sx={{
            width: "100%",
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            px: {
              xs: 2,
              sm: 3,
              md: 3,
              lg: 4,
            },
            pt: {
              xs: 2,
              sm: 2,
              md: 2,
            },
            pb: 0,
            position: "relative",
            zIndex: 3,
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#526b98",
              textDecoration: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "13px",
                sm: "14px",
                md: "14px",
                lg: "15px",
              },
              fontWeight: 600,
              whiteSpace: "nowrap",

              "&:hover": {
                color: "#1769e8",
              },
            }}
          >
            <IconButton
              size="small"
              sx={{
                p: 0,
                color: "inherit",

                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <ArrowBackIcon
                sx={{
                  fontSize: {
                    xs: 18,
                    md: 20,
                  },
                }}
              />
            </IconButton>

            <Typography
              component="span"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: "inherit",
                fontWeight: "inherit",
                color: "inherit",
              }}
            >
              Back to Home
            </Typography>
          </Box>
        </Box>

        {/* Login Form Container */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            px: {
              xs: 2,
              sm: 2.5,
              md: 2,
              lg: 3,
            },

            pt: {
              xs: 2,
              sm: 2,
              md: 1.5,
              lg: 1.5,
            },

            pb: {
              xs: 1.5,
              md: 1.5,
            },

            overflow: "hidden",
            position: "relative",
            zIndex: 2,

            /*
             * Responsive Login Card
             *
             * LoginForm itself is still used unchanged.
             * These styles override only its outer form container.
             */
            "& > form": {
              width: "100%",
              maxWidth: {
                xs: "390px",
                sm: "480px",
                md: "470px",
                lg: "490px",
              },

              "@media (max-width: 899.95px)": {
                backgroundColor: "rgba(255, 255, 255, 0.93)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                boxShadow: "0 12px 35px rgba(20, 40, 80, 0.14)",
              },

              "@media (min-width: 900px)": {
                backgroundColor: "#ffffff",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                boxShadow: "0 8px 28px rgba(30, 55, 95, 0.06)",
              },
            },
          }}
        >
          <LoginForm />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;