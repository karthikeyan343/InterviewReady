import React from "react";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { authInputSx } from "../styles";

interface RegistrationFieldsProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const RegistrationFields: React.FC<RegistrationFieldsProps> = ({
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
  loading,
}) => {
  return (
    <>
      {/* FULL NAME */}
      <Box sx={{ mb: { xs: "7px", sm: "8px", md: "10px" } }}>
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "10px", sm: "11px", md: "12px" },
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
          sx={authInputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon
                    sx={{
                      fontSize: { xs: 16, sm: 17, md: 18 },
                      color: "#7185ab",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* EMAIL */}
      <Box sx={{ mb: { xs: "7px", sm: "8px", md: "10px" } }}>
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "10px", sm: "11px", md: "12px" },
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
          sx={authInputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon
                    sx={{
                      fontSize: { xs: 16, sm: 17, md: 18 },
                      color: "#7185ab",
                    }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* PASSWORD */}
      <Box sx={{ mb: { xs: "7px", sm: "8px", md: "10px" } }}>
        <Typography
          component="label"
          sx={{
            display: "block",
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "10px", sm: "11px", md: "12px" },
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
          sx={authInputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon
                    sx={{
                      fontSize: { xs: 16, sm: 17, md: 18 },
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
                        sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* CONFIRM PASSWORD */}
      <Box sx={{ mb: { xs: "6px", sm: "7px", md: "8px" } }}>
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
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm your password"
          variant="outlined"
          size="small"
          autoComplete="new-password"
          disabled={loading}
          sx={authInputSx}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon
                    sx={{
                      fontSize: { xs: 16, sm: 17, md: 18 },
                      color: "#7185ab",
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
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
                        sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }}
                      />
                    ) : (
                      <VisibilityOutlinedIcon
                        sx={{ fontSize: { xs: 16, sm: 17, md: 18 } }}
                      />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
    </>
  );
};
