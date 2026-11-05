import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLogin } from "./hooks/useLogin";
import { FormAlerts } from "./components/FormAlerts";
import { LoginFields } from "./components/LoginFields";
import { GoogleAuthButton } from "./components/GoogleAuthButton";

const MOBILE_LOGIN_BACKGROUND = "/images/login-background.jpg";

const LoginForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    error,
    setError,
    loading,
    handleLogin,
    handleGoogleLogin,
  } = useLogin();

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        width: "100%",
        maxWidth: "390px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        borderRadius: "13px",
        boxShadow: "0 8px 28px rgba(30, 55, 95, 0.06)",
        px: "32px",
        py: "30px",
        fontFamily: '"Manrope", sans-serif',

        "&::before": {
          content: '""',
          position: "fixed",
          inset: 0,
          zIndex: -2,
          display: { xs: "block", sm: "none" },
          backgroundImage: `
            linear-gradient(
              rgba(255, 255, 255, 0.68),
              rgba(255, 255, 255, 0.68)
            ),
            url("${MOBILE_LOGIN_BACKGROUND}")
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        },

        "&::after": {
          content: '""',
          position: "fixed",
          inset: 0,
          zIndex: -1,
          display: { xs: "block", sm: "none" },
          backgroundColor: "rgba(255, 255, 255, 0.18)",
          pointerEvents: "none",
        },

        "@media (max-width: 599.95px)": {
          maxWidth: "calc(100% - 24px)",
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          borderRadius: "13px",
          px: "24px",
          py: "26px",
        },
      }}
    >
      {/* Title */}
      <Typography
        component="h1"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: { xs: "22px", sm: "25px", md: "28px" },
          lineHeight: 1.2,
          fontWeight: 800,
          letterSpacing: "-0.7px",
          color: "#101b46",
          mb: "5px",
        }}
      >
        Welcome back
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: { xs: "11px", sm: "12px", md: "13px" },
          lineHeight: 1.5,
          fontWeight: 500,
          color: "#7182a8",
          mb: "21px",
        }}
      >
        Sign in to continue your interview preparation.
      </Typography>

      {/* Alerts */}
      <FormAlerts
        error={error}
        onClearError={() => setError("")}
      />

      {/* Fields */}
      <LoginFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        loading={loading}
      />

      {/* Submit Button */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={loading}
        endIcon={
          loading ? (
            <CircularProgress size={18} sx={{ color: "#ffffff" }} />
          ) : (
            <ArrowForwardIcon sx={{ fontSize: "19px !important" }} />
          )
        }
        sx={{
          height: "44px",
          borderRadius: "7px",
          backgroundColor: "#1769e8",
          boxShadow: "0 5px 14px rgba(23, 105, 232, 0.16)",
          fontFamily: '"Manrope", sans-serif',
          fontSize: "14px",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#1260d8",
            boxShadow: "0 6px 16px rgba(23, 105, 232, 0.22)",
          },
          "&.Mui-disabled": {
            backgroundColor: "#8db7f4",
            color: "#ffffff",
          },
        }}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      {/* OR Divider */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          my: "18px",
        }}
      >
        <Box sx={{ flex: 1, height: "1px", backgroundColor: "#d9e1ed" }} />
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: "11px",
            fontWeight: 600,
            color: "#7182a8",
          }}
        >
          OR
        </Typography>
        <Box sx={{ flex: 1, height: "1px", backgroundColor: "#d9e1ed" }} />
      </Box>

      {/* Google Login */}
      <GoogleAuthButton
        onSuccess={handleGoogleLogin}
        onError={() => {
          setError("Google sign-in failed. Please try again.");
        }}
        text="continue_with"
      />

      {/* Create Account Link */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          mt: "20px",
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "11px", sm: "13px", md: "14px" },
            fontWeight: 500,
            color: "#7182a8",
          }}
        >
          Don&apos;t have an account?
        </Typography>

        <Typography
          component="a"
          href="/register"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "13px", sm: "14px" },
            fontWeight: 700,
            color: "#1769e8",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Create account
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
