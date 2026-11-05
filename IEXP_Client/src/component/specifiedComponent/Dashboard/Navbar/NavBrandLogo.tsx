import React from "react";
import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../../assets/LogoIR.png";

export const NavBrandLogo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    if (location.pathname !== "/dashboard") {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <Box
      onClick={handleGoHome}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleGoHome();
        }
      }}
      aria-label="InterviewReady Dashboard Home"
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        flexShrink: 0,
        outline: "none",
        "&:focus-visible": {
          outline: "2px solid #1468F2",
          outlineOffset: "4px",
          borderRadius: "8px",
        },
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="InterviewReady"
        sx={{
          height: {
            xs: "50px",
            sm: "55px",
            md: "60px",
          },
          width: "auto",
          display: "block",
        }}
      />
    </Box>
  );
};

