import React from "react";
import { Box } from "@mui/material";

import RegistrationForm from "../component/specifiedComponent/auth/RegistrationForm";
import loginImage from "../assets/HowItWorksImg.png";

const RegistrationPage: React.FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",
        display: "flex",
        overflow: "hidden",
        fontFamily: '"Manrope", sans-serif',
        backgroundColor: "#ffffff",
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

      {/* Registration Section */}
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
        {/* Registration Form Area */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            px: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
              lg: 3,
            },

            py: {
              xs: 2,
              sm: 2.5,
              md: 3,
              lg: 3.5,
            },

            overflow: "hidden",
            position: "relative",
            zIndex: 2,

            "& > form": {
              width: "100%",

              maxWidth: {
                xs: "calc(100vw - 24px)",
                sm: "400px",
                md: "390px",
                lg: "400px",
              },

              boxSizing: "border-box",

              "@media (max-width: 899.95px)": {
                backgroundColor: "rgba(255, 255, 255, 0.93)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                boxShadow: "0 12px 35px rgba(20, 40, 80, 0.14)",
                borderRadius: "13px",
              },

              "@media (min-width: 900px)": {
                backgroundColor: "#ffffff",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                boxShadow: "none",
                borderRadius: 0,
              },
            },
          }}
        >
          <RegistrationForm />
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationPage;