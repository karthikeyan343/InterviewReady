import React from "react";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { loginInputSx } from "../styles";

interface LoginFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const LoginFields: React.FC<LoginFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
}) => {
  return (
    <>
      {/* Email */}
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
          sx={loginInputSx}
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

      {/* Password */}
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
          sx={loginInputSx}
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
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
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

      {/* Forgot Password Link */}
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
    </>
  );
};
