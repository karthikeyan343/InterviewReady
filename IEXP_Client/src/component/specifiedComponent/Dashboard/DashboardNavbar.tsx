import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

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

import logo from "../../../assets/LogoIR.png";
import { useLocation, useNavigate } from "react-router-dom";
import { clearAllUserCache } from "../../../services/apiQueries";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const DashboardNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const menuOpen = Boolean(anchorEl);

  const storedUser = localStorage.getItem("user");

  const user: User | null = storedUser
    ? JSON.parse(storedUser)
    : null;

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
    navigate(path);
  };

  const handleProfileMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleCloseMenu();
    navigate("/profile");
  };

  const handleLogout = () => {
    handleCloseMenu();

    clearAllUserCache();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isNavigationItemActive = (path: string) => {
    return (
      location.pathname === path ||
      (path !== "/dashboard" &&
        location.pathname.startsWith(`${path}/`))
    );
  };

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        height: "68px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e8edf5",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1440px",
          height: "100%",
          mx: "auto",
          px: {
            xs: "18px",
            sm: "26px",
            md: "40px",
            lg: "48px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="InterviewReady"
          sx={{
            width: {
              xs: "155px",
              sm: "175px",
              md: "200px",
            },
            height: "auto",
            display: "block",
            flexShrink: 0,
          }}
        />

        <Box
          sx={{
            height: "100%",
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            gap: "6px",
            ml: "30px",
            flex: 1,
            minWidth: 0,
          }}
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              isNavigationItemActive(item.path);

            return (
              <Box
                key={item.path}
                onClick={() =>
                  handleNavigation(item.path)
                }
                sx={{
                  height: "100%",
                  px: "16px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  cursor: "pointer",
                  color: isActive
                    ? "#1769e8"
                    : "#52627f",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "#1769e8",
                  },
                }}
              >
                <Icon
                  sx={{
                    display: {
                      xs: "none",
                      lg: "block",
                    },
                    fontSize: 18,
                  }}
                />

                <Typography
                  sx={{
                    fontFamily:
                      '"Manrope", sans-serif',
                    fontSize: "12px",
                    fontWeight: isActive
                      ? 700
                      : 600,
                    color: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: "5px",
              sm: "12px",
            },
            flexShrink: 0,
          }}
        >
          <IconButton
            aria-label="Notifications"
            sx={{
              width: "36px",
              height: "36px",
              color: "#52627f",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f4f7fc",
                color: "#1769e8",
              },
            }}
          >
            <NotificationsNoneOutlinedIcon
              sx={{
                fontSize: 21,
              }}
            />
          </IconButton>

          <Box
            sx={{
              width: "1px",
              height: "27px",
              backgroundColor: "#e5eaf2",
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />

          <Box
            onClick={handleProfileMenu}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              cursor: "pointer",
              borderRadius: "9px",
              px: {
                xs: "3px",
                sm: "7px",
              },
              py: "5px",
              "&:hover": {
                backgroundColor: "#f6f8fc",
              },
            }}
          >
            <Avatar
              src={user?.avatar}
              alt={userName}
              sx={{
                width: 34,
                height: 34,
                backgroundColor: "#1769e8",
                fontFamily:
                  '"Manrope", sans-serif',
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {userName
                .charAt(0)
                .toUpperCase()}
            </Avatar>

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                minWidth: "75px",
              }}
            >
              <Typography
                sx={{
                  fontFamily:
                    '"Manrope", sans-serif',
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#17244b",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "115px",
                }}
              >
                {firstName}
              </Typography>

              <Typography
                sx={{
                  fontFamily:
                    '"Manrope", sans-serif',
                  fontSize: "9px",
                  fontWeight: 500,
                  color: "#8a9bb7",
                  lineHeight: 1.3,
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
                fontSize: 18,
                color: "#7182a8",
              }}
            />
          </Box>

          <IconButton
            aria-label="Open navigation menu"
            onClick={() =>
              setMobileMenuOpen(true)
            }
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
              width: "36px",
              height: "36px",
              color: "#52627f",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f4f7fc",
                color: "#1769e8",
              },
            }}
          >
            <MenuRoundedIcon
              sx={{
                fontSize: 23,
              }}
            />
          </IconButton>
        </Box>

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
                mt: "8px",
                minWidth: "210px",
                borderRadius: "10px",
                border:
                  "1px solid #e8edf5",
                boxShadow:
                  "0 10px 35px rgba(25, 45, 80, 0.10)",
                overflow: "hidden",
              },
            },
          }}
        >
          <Box
            sx={{
              px: "15px",
              py: "13px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Avatar
                src={user?.avatar}
                alt={userName}
                sx={{
                  width: 34,
                  height: 34,
                  backgroundColor: "#1769e8",
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {userName
                  .charAt(0)
                  .toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily:
                      '"Manrope", sans-serif',
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#17244b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userName}
                </Typography>

                <Typography
                  sx={{
                    fontFamily:
                      '"Manrope", sans-serif',
                    fontSize: "9px",
                    fontWeight: 500,
                    color: "#8a9bb7",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "140px",
                  }}
                >
                  {user?.email || "No email"}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          <MenuItem
            onClick={handleProfile}
            sx={{
              minHeight: "42px",
              px: "15px",
              gap: "10px",
              fontFamily:
                '"Manrope", sans-serif',
              fontSize: "11px",
              fontWeight: 600,
              color: "#394968",
              "&:hover": {
                backgroundColor: "#f5f8fd",
                color: "#1769e8",
              },
            }}
          >
            <PersonOutlineOutlinedIcon
              sx={{
                fontSize: 18,
              }}
            />

            Profile
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            sx={{
              minHeight: "42px",
              px: "15px",
              gap: "10px",
              fontFamily:
                '"Manrope", sans-serif',
              fontSize: "11px",
              fontWeight: 600,
              color: "#d14343",
              "&:hover": {
                backgroundColor: "#fff4f4",
                color: "#c62828",
              },
            }}
          >
            <LogoutOutlinedIcon
              sx={{
                fontSize: 18,
              }}
            />

            Sign out
          </MenuItem>
        </Menu>
      </Box>

<Drawer
  anchor="right"
  open={mobileMenuOpen}
  onClose={() => setMobileMenuOpen(false)}
  ModalProps={{
    keepMounted: true,
  }}
  slotProps={{
    paper: {
      sx: {
        width: {
          xs: "82%",
          sm: "340px",
        },
        maxWidth: "340px",
        backgroundColor: "#ffffff",
        boxShadow:
          "-8px 0 30px rgba(25, 45, 80, 0.10)",
      },
    },
  }}
>
        <Box
          sx={{
            height: "68px",
            px: {
              xs: "18px",
              sm: "24px",
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom:
              "1px solid #e8edf5",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="InterviewReady"
            sx={{
              width: {
                xs: "145px",
                sm: "160px",
              },
              height: "auto",
              display: "block",
            }}
          />

          <IconButton
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            sx={{
              width: "36px",
              height: "36px",
              color: "#52627f",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f4f7fc",
                color: "#1769e8",
              },
            }}
          >
            <CloseRoundedIcon
              sx={{
                fontSize: 22,
              }}
            />
          </IconButton>
        </Box>

        <Box
          sx={{
            px: {
              xs: "12px",
              sm: "16px",
            },
            py: "18px",
          }}
        >
          <Typography
            sx={{
              px: "12px",
              mb: "8px",
              fontFamily:
                '"Manrope", sans-serif',
              fontSize: "10px",
              fontWeight: 700,
              color: "#8a9bb7",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            Navigation
          </Typography>

          <List
            disablePadding
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                isNavigationItemActive(
                  item.path
                );

              return (
                <ListItemButton
                  key={item.path}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  sx={{
                    minHeight: "48px",
                    px: "12px",
                    borderRadius: "9px",
                    color: isActive
                      ? "#1769e8"
                      : "#52627f",
                    backgroundColor: isActive
                      ? "#eef5ff"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "#eef5ff"
                        : "#f6f8fc",
                      color: "#1769e8",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "38px",
                      color: "inherit",
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: 20,
                      }}
                    />
                  </ListItemIcon>

<ListItemText
  primary={item.label}
  slotProps={{
    primary: {
      sx: {
        fontFamily: '"Manrope", sans-serif',
        fontSize: "13px",
        fontWeight: isActive ? 700 : 600,
      },
    },
  }}
/>
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DashboardNavbar;