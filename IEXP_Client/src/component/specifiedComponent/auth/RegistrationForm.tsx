import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircularProgress from "@mui/material/CircularProgress";

import { GoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: {
        xs: "37px",
        sm: "38px",
        md: "39px",
      },
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
      fontSize: {
        xs: "11px",
        sm: "12px",
        md: "13px",
      },
      fontWeight: 500,
      color: "#17244b",

      "&::placeholder": {
        color: "#8a9bb7",
        opacity: 1,
      },
    },
  };

  // ---------------------------------------------------------
  // NORMAL REGISTRATION
  // ---------------------------------------------------------

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // GOOGLE REGISTRATION
  // ---------------------------------------------------------

  const handleGoogleRegister = async (credential: string) => {
    try {
      setError("");
      setSuccess("");
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
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Google sign-up failed.");
        return;
      }

      if (!data.token) {
        setError(
          "Google sign-up failed. Authentication token was not received."
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
      console.error("Google sign-up error:", error);

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

        boxsizing: "border-box",
      }}
    >
      {/* ---------------------------------------------------
          TITLE
      --------------------------------------------------- */}

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

          mb: {
            xs: "3px",
            sm: "4px",
          },
        }}
      >
        Create your account
      </Typography>

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "10px",
            sm: "11px",
            md: "12px",
          },
          lineHeight: 1.4,
          fontWeight: 500,
          color: "#7182a8",

          mb: {
            xs: "10px",
            sm: "11px",
            md: "13px",
          },
        }}
      >
        Join InterviewReady and start your journey.
      </Typography>

      {/* ---------------------------------------------------
          ERROR
      --------------------------------------------------- */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            mb: "12px",
            py: 0,
            borderRadius: "6px",
            fontFamily: '"Manrope", sans-serif',
            fontSize: "11px",

            "& .MuiAlert-message": {
              fontSize: "11px",
            },

            "& .MuiAlert-icon": {
              fontSize: "17px",
            },
          }}
        >
          {error}
        </Alert>
      )}

      {/* ---------------------------------------------------
          SUCCESS
      --------------------------------------------------- */}

      {success && (
        <Alert
          severity="success"
          sx={{
            mb: "12px",
            py: 0,
            borderRadius: "6px",
            fontFamily: '"Manrope", sans-serif',

            "& .MuiAlert-message": {
              fontSize: "11px",
            },

            "& .MuiAlert-icon": {
              fontSize: "17px",
            },
          }}
        >
          {success}
        </Alert>
      )}

      {/* ---------------------------------------------------
          FULL NAME
      --------------------------------------------------- */}

      <Box
        sx={{
          mb: {
            xs: "7px",
            sm: "8px",
            md: "10px",
          },
        }}
      >
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "10px",
              sm: "11px",
              md: "12px",
            },
            lineHeight: 1.25,
            fontWeight: 700,
            color: "#24345c",
            mb: "5px",
          }}
        >
          Full Name
        </Typography>

        <TextField
          fullWidth
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your full name"
          variant="outlined"
          size="small"
          autoComplete="name"
          disabled={loading}
          sx={inputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon
                    sx={{
                      fontSize: {
                        xs: 16,
                        sm: 17,
                        md: 18,
                      },
                      color: "#7185ab",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* ---------------------------------------------------
          EMAIL
      --------------------------------------------------- */}

      <Box
        sx={{
          mb: {
            xs: "7px",
            sm: "8px",
            md: "10px",
          },
        }}
      >
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "10px",
              sm: "11px",
              md: "12px",
            },
            lineHeight: 1.25,
            fontWeight: 700,
            color: "#24345c",
            mb: "5px",
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
                      fontSize: {
                        xs: 16,
                        sm: 17,
                        md: 18,
                      },
                      color: "#7185ab",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* ---------------------------------------------------
          PASSWORD
      --------------------------------------------------- */}

      <Box
        sx={{
          mb: {
            xs: "7px",
            sm: "8px",
            md: "10px",
          },
        }}
      >
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "10px",
              sm: "11px",
              md: "12px",
            },
            lineHeight: 1.25,
            fontWeight: 700,
            color: "#24345c",
            mb: "5px",
          }}
        >
          Password
        </Typography>

        <TextField
          fullWidth
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          variant="outlined"
          size="small"
          autoComplete="new-password"
          disabled={loading}
          sx={inputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon
                    sx={{
                      fontSize: {
                        xs: 16,
                        sm: 17,
                        md: 18,
                      },
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
                        sx={{
                          fontSize: {
                            xs: 16,
                            sm: 17,
                            md: 18,
                          },
                        }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{
                          fontSize: {
                            xs: 16,
                            sm: 17,
                            md: 18,
                          },
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* ---------------------------------------------------
          CONFIRM PASSWORD
      --------------------------------------------------- */}

      <Box
        sx={{
          mb: {
            xs: "6px",
            sm: "7px",
            md: "8px",
          },
        }}
      >
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: "12px",
            lineHeight: 1.3,
            fontWeight: 700,
            color: "#24345c",
            mb: "5px",
          }}
        >
          Confirm Password
        </Typography>

        <TextField
          fullWidth
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          placeholder="Confirm your password"
          variant="outlined"
          size="small"
          autoComplete="new-password"
          disabled={loading}
          sx={inputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon
                    sx={{
                      fontSize: {
                        xs: 16,
                        sm: 17,
                        md: 18,
                      },
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
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    edge="end"
                    disabled={loading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
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
                    {showConfirmPassword ? (
                      <VisibilityOffOutlinedIcon
                        sx={{
                          fontSize: {
                            xs: 16,
                            sm: 17,
                            md: 18,
                          },
                        }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{
                          fontSize: {
                            xs: 16,
                            sm: 17,
                            md: 18,
                          },
                        }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* ---------------------------------------------------
          TERMS
      --------------------------------------------------- */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",

          mb: {
            xs: "9px",
            sm: "11px",
            md: "13px",
          },

          ml: {
            xs: "-2px",
            sm: "-3px",
            md: "-4px",
          },

          minWidth: 0,
        }}
      >
        <Checkbox
          checked={agreeTerms}
          onChange={(event) =>
            setAgreeTerms(event.target.checked)
          }
          size="small"
          disabled={loading}
          sx={{
            p: 0,
            mr: "5px",
            mt: "0px",
            color: "#a9b8cc",

            "&.Mui-checked": {
              color: "#1769e8",
            },
          }}
        />

        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "9px",
              sm: "10px",
              md: "11px",
            },
            lineHeight: 1.4,
            fontWeight: 500,
            color: "#7182a8",
            mt: "1.5px",
          }}
        >
          I agree to the{" "}
          <Typography
            component="a"
            href="#"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "inherit",
              fontWeight: 700,
              color: "#1769e8",
              textDecoration: "none",

              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Terms of Service
          </Typography>{" "}
          and{" "}
          <Typography
            component="a"
            href="#"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "inherit",
              fontWeight: 700,
              color: "#1769e8",
              textDecoration: "none",

              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Privacy Policy
          </Typography>
        </Typography>
      </Box>

      {/* ---------------------------------------------------
          CREATE ACCOUNT
      --------------------------------------------------- */}

      <Button
        fullWidth
        type="submit"
        variant="contained"
        disabled={loading}
        endIcon={
          loading ? (
            <CircularProgress
              size={17}
              sx={{ color: "#ffffff" }}
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
          height: {
            xs: "39px",
            sm: "40px",
            md: "42px",
          },

          borderRadius: "7px",
          backgroundColor: "#1769e8",
          boxShadow:
            "0 5px 14px rgba(23, 105, 232, 0.16)",

          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "12px",
            sm: "13px",
            md: "14px",
          },

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
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      {/* ---------------------------------------------------
          OR DIVIDER
      --------------------------------------------------- */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "12px",

          my: {
            xs: "9px",
            sm: "11px",
            md: "13px",
          },
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
            fontSize: {
              xs: "9px",
              sm: "10px",
              md: "11px",
            },
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

      {/* ---------------------------------------------------
          GOOGLE LOGIN
          
          IMPORTANT:
          This is now the actual GoogleLogin component,
          just like the working LoginForm.
      --------------------------------------------------- */}

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
          key={location.key}
          onSuccess={(credentialResponse) => {
            if (!credentialResponse.credential) {
              setError(
                "Google sign-up failed. No credential received."
              );
              return;
            }

            handleGoogleRegister(
              credentialResponse.credential
            );
          }}
          onError={() => {
            setLoading(false);
            setError(
              "Google sign-up failed. Please try again."
            );
          }}
          theme="outline"
          size="large"
          shape="rectangular"
          text="continue_with"
          width="100%"
        />
      </Box>

      {/* ---------------------------------------------------
          LOGIN LINK
      --------------------------------------------------- */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",

          mt: {
            xs: "9px",
            sm: "11px",
            md: "15px",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "9px",
              sm: "10px",
              md: "11px",
            },
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
            fontSize: {
              xs: "9px",
              sm: "10px",
              md: "11px",
            },
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

