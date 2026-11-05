import React from "react";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import type { User } from "./types";

interface DesktopUserActionsProps {
  user: User | null;
  userName: string;
  firstName: string;
  menuOpen: boolean;
  onOpenProfileMenu: (event: React.MouseEvent<HTMLElement>) => void;
  onOpenMobileMenu: () => void;
}

export const DesktopUserActions: React.FC<DesktopUserActionsProps> = ({
  user,
  userName,
  firstName,
  menuOpen,
  onOpenProfileMenu,
  onOpenMobileMenu,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: {
          xs: "6px",
          sm: "10px",
          md: "12px",
        },
        flexShrink: 0,
      }}
    >
      {/* Notification Button */}
      <IconButton
        aria-label="Notifications"
        sx={{
          width: "40px",
          height: "40px",
          color: "#5C6F96",
          backgroundColor: { xs: "transparent", sm: "#FFFFFF" },
          border: { xs: "none", sm: "1px solid #DCE6F6" },
          borderRadius: "12px",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            backgroundColor: "#EEF5FF",
            color: "#1468F2",
            borderColor: "rgba(20, 104, 242, 0.25)",
          },
          "&:focus-visible": {
            outline: "2px solid #1468F2",
            outlineOffset: "2px",
          },
        }}
      >
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 21 }} />
      </IconButton>

      {/* Vertical Divider (Desktop/Tablet) */}
      <Box
        sx={{
          width: "1px",
          height: "26px",
          backgroundColor: "#DCE6F6",
          display: {
            xs: "none",
            sm: "block",
          },
          mx: 0.25,
        }}
      />

      {/* User Profile Pill Button */}
      <Box
        onClick={onOpenProfileMenu}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-label="User account menu"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenProfileMenu(e as unknown as React.MouseEvent<HTMLElement>);
          }
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
          cursor: "pointer",
          borderRadius: "14px",
          border: { xs: "none", sm: "1px solid #DCE6F6" },
          backgroundColor: menuOpen
            ? "#EEF5FF"
            : { xs: "transparent", sm: "#FFFFFF" },
          borderColor: menuOpen ? "#1468F2" : "#DCE6F6",
          pl: { xs: "2px", sm: "6px" },
          pr: { xs: "2px", sm: "10px" },
          py: "4px",
          height: "44px",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          outline: "none",
          "&:hover": {
            backgroundColor: "#F4F7FD",
            borderColor: "rgba(20, 104, 242, 0.25)",
          },
          "&:focus-visible": {
            outline: "2px solid #1468F2",
            outlineOffset: "2px",
          },
        }}
      >
        <Avatar
          src={user?.avatar}
          alt={userName}
          sx={{
            width: 34,
            height: 34,
            background:
              "linear-gradient(135deg, #1468F2 0%, #2563EB 50%, #7C3AED 100%)",
            fontFamily: '"Manrope", sans-serif',
            fontSize: "13px",
            fontWeight: 700,
            color: "#FFFFFF",
            boxShadow: "0 2px 6px rgba(20, 104, 242, 0.25)",
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </Avatar>

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            minWidth: "72px",
            maxWidth: "120px",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "13px",
              fontWeight: 700,
              color: "#08194D",
              lineHeight: 1.25,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {firstName}
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: "11px",
              fontWeight: 600,
              color: "#5C6F96",
              lineHeight: 1.2,
            }}
          >
            Account
          </Typography>
        </Box>

        <KeyboardArrowDownRoundedIcon
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
            fontSize: 19,
            color: menuOpen ? "#1468F2" : "#5C6F96",
            transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease, color 0.2s ease",
          }}
        />
      </Box>

      {/* Mobile Hamburger Menu Button */}
      <IconButton
        aria-label="Open navigation menu"
        onClick={onOpenMobileMenu}
        sx={{
          display: {
            xs: "flex",
            md: "none",
          },
          width: "40px",
          height: "40px",
          color: "#08194D",
          backgroundColor: "#EFF4FC",
          border: "1px solid rgba(215, 226, 245, 0.7)",
          borderRadius: "12px",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          "&:hover": {
            backgroundColor: "#E2EBF9",
            color: "#1468F2",
          },
          "&:focus-visible": {
            outline: "2px solid #1468F2",
            outlineOffset: "2px",
          },
        }}
      >
        <MenuRoundedIcon sx={{ fontSize: 22 }} />
      </IconButton>
    </Box>
  );
};
