import React from "react";
import { Avatar, Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import type { User } from "./types";

interface UserProfileMenuProps {
  anchorEl: HTMLElement | null;
  menuOpen: boolean;
  user: User | null;
  userName: string;
  onClose: () => void;
  onProfile: () => void;
  onLogout: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  anchorEl,
  menuOpen,
  user,
  userName,
  onClose,
  onProfile,
  onLogout,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            mt: "10px",
            minWidth: "230px",
            maxWidth: "300px",
            borderRadius: "16px",
            border: "1px solid #DCE6F6",
            boxShadow:
              "0 14px 40px rgba(8, 25, 77, 0.12), 0 2px 10px rgba(8, 25, 77, 0.04)",
            p: "6px",
            overflow: "hidden",
            fontFamily: '"Manrope", sans-serif',
          },
        },
      }}
    >
      {/* User Info Header Card */}
      <Box
        sx={{
          px: "14px",
          py: "12px",
          mb: "6px",
          borderRadius: "12px",
          backgroundColor: "#F8FAFD",
          border: "1px solid #EEF2F8",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "11px",
          }}
        >
          <Avatar
            src={user?.avatar}
            alt={userName}
            sx={{
              width: 36,
              height: 36,
              background:
                "linear-gradient(135deg, #1468F2 0%, #2563EB 50%, #7C3AED 100%)",
              fontSize: "13px",
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: "13px",
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
                fontSize: "11px",
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
      </Box>

      <Divider sx={{ borderColor: "#EEF2F8", my: "4px", mx: "4px" }} />

      {/* Profile Action */}
      <MenuItem
        onClick={onProfile}
        sx={{
          minHeight: "42px",
          px: "12px",
          py: "8px",
          borderRadius: "10px",
          gap: "10px",
          fontFamily: '"Manrope", sans-serif',
          fontSize: "13px",
          fontWeight: 600,
          color: "#08194D",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: "#EEF5FF",
            color: "#1468F2",
            "& .MuiSvgIcon-root": {
              color: "#1468F2",
            },
          },
        }}
      >
        <PersonOutlineOutlinedIcon
          sx={{
            fontSize: 19,
            color: "#5C6F96",
            transition: "color 0.15s ease",
          }}
        />
        Profile
      </MenuItem>

      {/* Sign Out Action */}
      <MenuItem
        onClick={onLogout}
        sx={{
          minHeight: "42px",
          px: "12px",
          py: "8px",
          borderRadius: "10px",
          gap: "10px",
          fontFamily: '"Manrope", sans-serif',
          fontSize: "13px",
          fontWeight: 600,
          color: "#DC2626",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: "#FFF1F2",
            color: "#B91C1C",
            "& .MuiSvgIcon-root": {
              color: "#B91C1C",
            },
          },
        }}
      >
        <LogoutOutlinedIcon
          sx={{
            fontSize: 19,
            color: "#DC2626",
            transition: "color 0.15s ease",
          }}
        />
        Sign out
      </MenuItem>
    </Menu>
  );
};
