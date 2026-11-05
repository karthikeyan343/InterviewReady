import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import type { User } from "../types";

interface DrawerAccountSectionProps {
  user: User | null;
  userName: string;
  onProfile: () => void;
  onLogout: () => void;
}

export const DrawerAccountSection: React.FC<DrawerAccountSectionProps> = ({
  user,
  userName,
  onProfile,
  onLogout,
}) => {
  return (
    <>
      <Box
        sx={{
          height: "1px",
          backgroundColor: "#EEF2F8",
          my: 2,
          mx: 1,
        }}
      />

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: "#5C6F96",
          textTransform: "uppercase",
          mb: 1.5,
          px: 1,
        }}
      >
        ACCOUNT
      </Typography>

      {/* User Profile Card */}
      <Box
        sx={{
          p: "14px",
          borderRadius: "18px",
          backgroundColor: "#F8FAFD",
          border: "1px solid #DCE6F6",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Avatar
          src={user?.avatar}
          alt={userName}
          sx={{
            width: 42,
            height: 42,
            background:
              "linear-gradient(135deg, #1468F2 0%, #2563EB 50%, #7C3AED 100%)",
            fontFamily: '"Manrope", sans-serif',
            fontSize: "15px",
            fontWeight: 700,
            color: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(20, 104, 242, 0.25)",
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "14px",
              fontWeight: 700,
              color: "#08194D",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {userName}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "12px",
              fontWeight: 500,
              color: "#5C6F96",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email || "No email"}
          </Typography>
        </Box>
      </Box>

      {/* Profile Action Row */}
      <Box
        component="button"
        type="button"
        onClick={onProfile}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
          px: 1.5,
          borderRadius: "18px",
          cursor: "pointer",
          backgroundColor: "transparent",
          border: "1.5px solid transparent",
          outline: "none",
          font: "inherit",
          width: "100%",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            backgroundColor: "rgba(240, 244, 253, 0.7)",
          },
          "&:focus-visible": {
            outline: "2px solid #1468F2",
            outlineOffset: "2px",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              backgroundColor: "#F0F4FC",
              color: "#1468F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PersonOutlineOutlinedIcon sx={{ fontSize: 21 }} />
          </Box>

          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "15px",
              fontWeight: 700,
              color: "#08194D",
            }}
          >
            Profile
          </Typography>
        </Box>

        <ChevronRightRoundedIcon sx={{ fontSize: "22px", color: "#8FA0BE" }} />
      </Box>

      {/* Sign Out Action Row */}
      <Box
        component="button"
        type="button"
        onClick={onLogout}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "56px",
          px: 1.5,
          mt: 0.5,
          borderRadius: "18px",
          cursor: "pointer",
          backgroundColor: "transparent",
          border: "1.5px solid transparent",
          outline: "none",
          font: "inherit",
          width: "100%",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            backgroundColor: "#FFF1F2",
          },
          "&:focus-visible": {
            outline: "2px solid #DC2626",
            outlineOffset: "2px",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
          <Box
            sx={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              backgroundColor: "#FFF1F2",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LogoutOutlinedIcon sx={{ fontSize: 21 }} />
          </Box>

          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "15px",
              fontWeight: 700,
              color: "#DC2626",
            }}
          >
            Sign out
          </Typography>
        </Box>

        <ChevronRightRoundedIcon sx={{ fontSize: "22px", color: "#DC2626" }} />
      </Box>
    </>
  );
};

export default DrawerAccountSection;
