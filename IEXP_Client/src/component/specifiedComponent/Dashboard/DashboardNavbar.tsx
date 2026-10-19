import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import logo from "../../../assets/LogoIR.png";
import { clearAllUserCache } from "../../../services/apiQueries";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardNavbarProps {
  hideNavLinks?: boolean;
  rightAction?: React.ReactNode;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  hideNavLinks = false,
  rightAction,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || "User";
  const firstName = userName.split(" ")[0];

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: DashboardOutlinedIcon,
    },
    {
      label: "Interviews",
      path: "/interviews",
      icon: VideoCameraFrontOutlinedIcon,
    },
    {
      label: "Resume",
      path: "/resume",
      icon: DescriptionOutlinedIcon,
    },
    {
      label: "Reports",
      path: "/reports",
      icon: AssessmentOutlinedIcon,
    },
  ];

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === path) return;
    navigate(path, { replace: true });
  };

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleCloseMenu();
    setMobileMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    handleCloseMenu();
    setMobileMenuOpen(false);

    clearAllUserCache();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isNavigationItemActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/dashboard" && location.pathname.startsWith(`${path}/`))
    );
  };

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        height: { xs: "66px", sm: "70px", md: "72px" },
        backgroundColor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #DCE6F6",
        boxShadow: "0 2px 10px rgba(8, 25, 77, 0.03)",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1440px",
          height: "100%",
          mx: "auto",
          px: {
            xs: "16px",
            sm: "24px",
            md: "36px",
            lg: "48px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        {/* ── LEFT: Logo ── */}
        <Box
          onClick={() => {
            if (location.pathname !== "/dashboard") {
              navigate("/dashboard", { replace: true });
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              if (location.pathname !== "/dashboard") {
                navigate("/dashboard", { replace: true });
              }
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

        {/* ── CENTER: Desktop Navigation Items ── */}
        {!hideNavLinks && (
          <Box
            component="nav"
            aria-label="Dashboard main navigation"
            sx={{
              height: "100%",
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              gap: { md: "6px", lg: "8px" },
              mx: { md: 2, lg: 3 },
            }}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isNavigationItemActive(item.path);

              return (
                <Box
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleNavigation(item.path);
                    }
                  }}
                  sx={{
                    height: "42px",
                    px: { md: "13px", lg: "16px" },
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    color: isActive ? "#1468F2" : "#5C6F96",
                    backgroundColor: isActive ? "#EEF5FF" : "transparent",
                    border: isActive
                      ? "1px solid rgba(20, 104, 242, 0.14)"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "0 2px 6px rgba(20, 104, 242, 0.05)"
                      : "none",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    outline: "none",
                    "&:hover": {
                      color: "#1468F2",
                      backgroundColor: isActive ? "#EEF5FF" : "#F4F7FD",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #1468F2",
                      outlineOffset: "2px",
                    },
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: 19,
                      color: isActive ? "#1468F2" : "inherit",
                      transition: "color 0.2s ease",
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontSize: "14px",
                      fontWeight: isActive ? 700 : 600,
                      color: "inherit",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}

        {/* ── RIGHT: User Controls & Mobile Actions OR Custom Action ── */}
        {hideNavLinks ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {rightAction}
          </Box>
        ) : (
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
            onClick={handleProfileMenu}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-label="User account menu"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAnchorEl(e.currentTarget);
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
            onClick={() => setMobileMenuOpen(true)}
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
        )}

        {/* ── User Profile Dropdown Menu (MUI Menu) ── */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
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
            onClick={handleProfile}
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
            onClick={handleLogout}
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
      </Box>

      {/* ── UPGRADED MOBILE DRAWER ── */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        aria-label="Dashboard mobile navigation drawer"
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(8, 25, 77, 0.45)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important",
            },
          },
          paper: {
            sx: {
              width: {
                xs: "85%",
                sm: "360px",
              },
              maxWidth: "380px",
              height: "100%",
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: "28px",
              borderBottomLeftRadius: "28px",
              boxShadow: "-16px 0 48px rgba(8, 25, 77, 0.16)",
              borderLeft: "1px solid rgba(220, 230, 246, 0.8)",
              p: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              fontFamily: '"Manrope", sans-serif',
              "@media (prefers-reduced-motion: reduce)": {
                transition: "none !important",
              },
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            position: "relative",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* ── Drawer Header ── */}
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: { xs: 2.5, sm: 3 },
              pt: { xs: 2.5, sm: 3 },
              pb: 2,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="InterviewReady"
              sx={{
                height: { xs: "50px", sm: "54px" },
                width: "auto",
                display: "block",
              }}
            />

            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              sx={{
                width: "42px",
                height: "42px",
                borderRadius: "14px",
                backgroundColor: "#EFF4FC",
                border: "1px solid rgba(215, 226, 245, 0.7)",
                color: "#2C3E5A",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  backgroundColor: "#E2EBF9",
                  transform: "scale(1.04)",
                },
                "&:active": {
                  transform: "scale(0.96)",
                },
                "&:focus-visible": {
                  outline: "2px solid #1468F2",
                  outlineOffset: "2px",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: "21px" }} />
            </IconButton>
          </Box>

          {/* Thin divider below header */}
          <Box
            sx={{
              height: "1px",
              backgroundColor: "#EEF2F8",
              mx: { xs: 2.5, sm: 3 },
              mb: 2,
              flexShrink: 0,
            }}
          />

          {/* ── Scrollable Body ── */}
          <Box
            sx={{
              flex: "1 1 auto",
              overflowY: "auto",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              px: { xs: 2, sm: 2.5 },
              display: "flex",
              flexDirection: "column",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {/* Section Label */}
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
              MENU
            </Typography>

            {/* Navigation Items */}
            <Box
              component="nav"
              aria-label="Mobile dashboard navigation"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
              }}
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isNavigationItemActive(item.path);

                return (
                  <Box
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleNavigation(item.path);
                      }
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: { xs: "58px", sm: "62px" },
                      px: 1.5,
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
                      background: isActive
                        ? "linear-gradient(90deg, #EAF3FE 0%, #F1F3FE 100%)"
                        : "transparent",
                      border: isActive
                        ? "1.5px solid rgba(20, 104, 242, 0.16)"
                        : "1.5px solid transparent",
                      boxShadow: isActive
                        ? "0 2px 10px rgba(20, 104, 242, 0.05)"
                        : "none",
                      outline: "none",
                      "&:hover": {
                        backgroundColor: isActive
                          ? "linear-gradient(90deg, #EAF3FE 0%, #F1F3FE 100%)"
                          : "rgba(240, 244, 253, 0.7)",
                      },
                      "&:focus-visible": {
                        outline: "2px solid #1468F2",
                        outlineOffset: "2px",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.75,
                      }}
                    >
                      {/* Icon squircle */}
                      <Box
                        sx={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "14px",
                          backgroundColor: isActive ? "#D8E7FD" : "#F0F4FC",
                          color: isActive ? "#1468F2" : "#2563EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Icon sx={{ fontSize: "22px" }} />
                      </Box>

                      {/* Label */}
                      <Typography
                        sx={{
                          fontFamily: '"Manrope", sans-serif',
                          fontSize: "16px",
                          fontWeight: isActive ? 800 : 700,
                          color: isActive ? "#1468F2" : "#08194D",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>

                    {/* Right Chevron */}
                    <ChevronRightRoundedIcon
                      sx={{
                        fontSize: "22px",
                        color: isActive ? "#1468F2" : "#8FA0BE",
                        transition: "color 0.2s ease",
                      }}
                    />
                  </Box>
                );
              })}
            </Box>

            {/* Divider before User Profile Section */}
            <Box
              sx={{
                height: "1px",
                backgroundColor: "#EEF2F8",
                my: 2,
                mx: 1,
              }}
            />

            {/* Section Label: Account */}
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
              onClick={handleProfile}
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

              <ChevronRightRoundedIcon
                sx={{ fontSize: "22px", color: "#8FA0BE" }}
              />
            </Box>

            {/* Sign Out Action Row */}
            <Box
              component="button"
              type="button"
              onClick={handleLogout}
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

              <ChevronRightRoundedIcon
                sx={{ fontSize: "22px", color: "#DC2626" }}
              />
            </Box>

            <Box sx={{ height: 16, flexShrink: 0 }} />
          </Box>

          {/* ── Drawer Footer ── */}
          <Box
            sx={{
              flexShrink: 0,
              position: "relative",
              pt: 1.5,
              pb: { xs: 2.5, sm: 3 },
              px: { xs: 2.5, sm: 3 },
            }}
          >
            {/* Subtle decorative curved wave shape at bottom */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "110px",
                pointerEvents: "none",
                overflow: "hidden",
                borderBottomLeftRadius: "28px",
                zIndex: 0,
              }}
            >
              <svg
                viewBox="0 0 380 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                style={{ width: "100%", height: "100%" }}
              >
                <path
                  d="M0,40 C90,10 180,90 380,20 L380,110 L0,110 Z"
                  fill="url(#dashDrawerWave1)"
                  opacity="0.45"
                />
                <path
                  d="M0,70 C120,35 240,100 380,50 L380,110 L0,110 Z"
                  fill="url(#dashDrawerWave2)"
                  opacity="0.35"
                />
                <defs>
                  <linearGradient
                    id="dashDrawerWave1"
                    x1="0"
                    y1="0"
                    x2="380"
                    y2="110"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#D4E3FC" />
                    <stop offset="0.6" stopColor="#E9E2FD" />
                    <stop offset="1" stopColor="#F5F0FF" />
                  </linearGradient>
                  <linearGradient
                    id="dashDrawerWave2"
                    x1="0"
                    y1="0"
                    x2="380"
                    y2="110"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#BFD6FD" />
                    <stop offset="0.5" stopColor="#DDD4FC" />
                    <stop offset="1" stopColor="#EDE5FE" />
                  </linearGradient>
                </defs>
              </svg>
            </Box>

            {/* Footer message row */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <AutoAwesomeRoundedIcon
                sx={{
                  fontSize: "18px",
                  color: "#1468F2",
                  filter: "drop-shadow(0 2px 4px rgba(20, 104, 242, 0.25))",
                }}
              />

              <Box
                sx={{
                  width: "1px",
                  height: "16px",
                  backgroundColor: "#DCE6F6",
                }}
              />

              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#5C6F96",
                }}
              >
                Your next interview starts here.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DashboardNavbar;