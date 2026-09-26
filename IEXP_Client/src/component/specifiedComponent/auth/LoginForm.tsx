import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const MOBILE_LOGIN_BACKGROUND = "/images/login-background.jpg";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: "42px",
      borderRadius: "7px",
      fontFamily: '"Manrope", sans-serif',

      "& fieldset": {
        borderColor: "#d5deeb",
        borderWidth: "1px",
      },

      "&:hover fieldset": {
        borderColor: "#b8c8dc",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1769e8",
      },
    },

    "& .MuiInputBase-input": {
      fontFamily: '"Manrope", sans-serif',
      fontSize: { xs: "11px", sm: "12px", md: "13px" },
      fontWeight: 500,
      color: "#17244b",

      "&::placeholder": {
        color: "#8a9bb7",
        opacity: 1,
      },
    },
  };


  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      if (!data.token) {
        setError(
          "Login failed. Authentication token was not received."
        );
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async (credential: string) => {
    try {
      setError("");
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            credential,
            flow: "login",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Google sign-in failed."
        );
        return;
      }

      if (!data.token) {
        setError(
          "Google login failed. Authentication token was not received."
        );
        return;
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

      
      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: "14px",
            py: "2px",
            borderRadius: "7px",
            fontFamily: '"Manrope", sans-serif',

            "& .MuiAlert-message": {
              fontFamily: '"Manrope", sans-serif',
              fontSize: "12px",
              fontWeight: 500,
            },

            "& .MuiAlert-icon": {
              fontSize: "18px",
            },
          }}
        >
          {error}
        </Alert>
      )}

      
      <Box sx={{ mb: "16px" }}>
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "11px", sm: "12px", md: "13px" },
            lineHeight: 1.3,
            fontWeight: 700,
            color: "#24345c",
            mb: "6px",
          }}
        >
          Email
        </Typography>

        <TextField
          fullWidth
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          variant="outlined"
          size="small"
          autoComplete="email"
          disabled={loading}
          sx={inputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon
                    sx={{
                      fontSize: { xs: 17, sm: 18, md: 19 },
                      color: "#7185ab",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      
      <Box sx={{ mb: "8px" }}>
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "11px", sm: "12px", md: "13px" },
            lineHeight: 1.3,
            fontWeight: 700,
            color: "#24345c",
            mb: "6px",
          }}
        >
          Password
        </Typography>

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          variant="outlined"
          size="small"
          autoComplete="current-password"
          disabled={loading}
          sx={inputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon
                    sx={{
                      fontSize: { xs: 17, sm: 18, md: 19 },
                      color: "#7185ab",
                    }}
                  />
                </InputAdornment>
              ),

              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    edge="end"
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    sx={{
                      p: 0,
                      color: "#7185ab",

                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#1769e8",
                      },
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon
                        sx={{ fontSize: { xs: 17, sm: 18, md: 19 } }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{ fontSize: { xs: 17, sm: 18, md: 19 } }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: "18px",
        }}
      >
        <Typography
          component="a"
          href="#"
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: "12px",
            fontWeight: 600,
            color: "#1769e8",
            textDecoration: "none",
            cursor: "pointer",

            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          Forgot password?
        </Typography>
      </Box>

      
      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={loading}
        endIcon={
          loading ? (
            <CircularProgress
              size={18}
              sx={{
                color: "#ffffff",
              }}
            />
          ) : (
            <ArrowForwardIcon
              sx={{
                fontSize: "19px !important",
              }}
            />
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
            boxShadow:
              "0 6px 16px rgba(23, 105, 232, 0.22)",
          },

          "&.Mui-disabled": {
            backgroundColor: "#8db7f4",
            color: "#ffffff",
          },
        }}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          my: "18px",
        }}
      >
        <Box
          sx={{
            flex: 1,
            height: "1px",
            backgroundColor: "#d9e1ed",
          }}
        />

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

        <Box
          sx={{
            flex: 1,
            height: "1px",
            backgroundColor: "#d9e1ed",
          }}
        />
      </Box>

      
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",

          "& > div": {
            width: "100%",
          },

          "& iframe": {
            maxWidth: "100% !important",
          },

          "@media (max-width: 599.95px)": {
            overflow: "hidden",
          },
        }}
      >
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) {
              setError(
                "Google sign-in failed. No credential received."
              );
              return;
            }

            handleGoogleLogin(
              credentialResponse.credential
            );
          }}
          onError={() => {
            setError(
              "Google sign-in failed. Please try again."
            );
          }}
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
          width="100%"
        />
      </Box>

      
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
            fontSize: {
              xs:'11px',
              sm:'13px',
              md:'14px',
            },
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
            fontSize: {
              xs:'13px',
              sm:'14px',
            },
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