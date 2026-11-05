import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRegistration } from "./hooks/useRegistration";
import { FormAlerts } from "./components/FormAlerts";
import { RegistrationFields } from "./components/RegistrationFields";
import { TermsAgreement } from "./components/TermsAgreement";
import { GoogleAuthButton } from "./components/GoogleAuthButton";

const RegistrationForm: React.FC = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    agreeTerms,
    setAgreeTerms,
    error,
    setError,
    success,
    loading,
    handleRegister,
    handleGoogleRegister,
  } = useRegistration();

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      sx={{
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: "390px",
          md: "400px",
          lg: "410px",
        },
        boxSizing: "border-box",
        backgroundColor: "white",
        borderRadius: {
          xs: "12px",
          sm: "13px",
        },
        px: {
          xs: "18px",
          sm: "22px",
          md: "28px",
          lg: "30px",
        },
        py: {
          xs: "18px",
          sm: "20px",
          md: "24px",
          lg: "26px",
        },
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      {/* Title */}
      <Typography
        component="h1"
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "21px",
            sm: "23px",
            md: "25px",
            lg: "27px",
          },
          lineHeight: 1.2,
          fontWeight: 800,
          letterSpacing: "-0.7px",
          color: "#101b46",
          mb: { xs: "3px", sm: "4px" },
        }}
      >
        Create your account
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: { xs: "10px", sm: "11px", md: "12px" },
          lineHeight: 1.4,
          fontWeight: 500,
          color: "#7182a8",
          mb: { xs: "10px", sm: "11px", md: "13px" },
        }}
      >
        Join InterviewReady and start your journey.
      </Typography>

      {/* Alerts */}
      <FormAlerts
        error={error}
        success={success}
        onClearError={() => setError("")}
      />

      {/* Fields */}
      <RegistrationFields
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        loading={loading}
      />

      {/* Terms */}
      <TermsAgreement
        checked={agreeTerms}
        disabled={loading}
        onChange={setAgreeTerms}
      />

      {/* Submit Button */}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={loading}
        endIcon={
          loading ? (
            <CircularProgress size={17} sx={{ color: "#ffffff" }} />
          ) : (
            <ArrowForwardIcon sx={{ fontSize: "19px !important" }} />
          )
        }
        sx={{
          height: { xs: "39px", sm: "40px", md: "42px" },
          borderRadius: "7px",
          backgroundColor: "#1769e8",
          boxShadow: "0 5px 14px rgba(23, 105, 232, 0.16)",
          fontFamily: '"Manrope", sans-serif',
          fontSize: { xs: "12px", sm: "13px", md: "14px" },
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
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      {/* OR Divider */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          my: { xs: "9px", sm: "11px", md: "13px" },
        }}
      >
        <Box sx={{ flex: 1, height: "1px", backgroundColor: "#d9e1ed" }} />
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "9px", sm: "10px", md: "11px" },
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
        onSuccess={handleGoogleRegister}
        onError={() => {
          setError("Google sign-up failed. Please try again.");
        }}
        text="continue_with"
      />

      {/* Login Link */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          mt: { xs: "9px", sm: "11px", md: "15px" },
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "9px", sm: "10px", md: "11px" },
            fontWeight: 500,
            color: "#7182a8",
          }}
        >
          Already have an account?
        </Typography>

        <Typography
          component="a"
          href="/login"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "9px", sm: "10px", md: "11px" },
            fontWeight: 700,
            color: "#1769e8",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Sign In
        </Typography>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
