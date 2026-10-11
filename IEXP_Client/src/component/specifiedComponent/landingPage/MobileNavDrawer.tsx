import React from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import logo from "../../../assets/LogoIR.png";

export interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navDrawerItems: MobileNavItem[] = [
  {
    label: "Home",
    href: "#home",
    icon: HomeOutlinedIcon,
  },
  {
    label: "Features",
    href: "#features",
    icon: GridViewOutlinedIcon,
  },
  {
    label: "How It Works",
    href: "#how-it-works",
    icon: SettingsOutlinedIcon,
  },
  {
    label: "About Us",
    href: "#about-us",
    icon: PeopleOutlineRoundedIcon,
  },
];

interface MobileNavDrawerProps {
  open: boolean;
  onClose: () => void;
  activeSection: string;
  onNavClick: (href: string) => void;
  onAuthNav: (destination: string) => void;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  onClose,
  activeSection,
  onNavClick,
  onAuthNav,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-label="Mobile navigation drawer"
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
              sm: "380px",
            },
            maxWidth: "420px",
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
        {/* ── Header ── */}
        <Box
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 2.5, sm: 3 },
            pt: { xs: 2.5, sm: 3.5 },
            pb: 2,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="InterviewReady"
            sx={{
              height: { xs: "32px", sm: "36px" },
              width: "auto",
              display: "block",
            }}
          />

          <IconButton
            onClick={onClose}
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
            aria-label="Mobile main navigation"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
            }}
          >
            {navDrawerItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeSection === item.href;

              return (
                <Box
                  key={item.label}
                  component="a"
                  href={item.href}
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    onNavClick(item.href);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onNavClick(item.href);
                    }
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: { xs: "58px", sm: "62px" },
                    px: 1.5,
                    borderRadius: "20px",
                    textDecoration: "none",
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
                    {/* Icon container */}
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
                      <IconComp sx={{ fontSize: "22px" }} />
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

          {/* Divider before auth navigation */}
          <Box
            sx={{
              height: "1px",
              backgroundColor: "#EEF2F8",
              my: 1.75,
              mx: 1,
            }}
          />

          {/* Sign In Navigation Row */}
          <Box
            component="button"
            type="button"
            onClick={() => onAuthNav("/login")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: { xs: "58px", sm: "62px" },
              px: 1.5,
              borderRadius: "20px",
              cursor: "pointer",
              backgroundColor: "transparent",
              border: "1.5px solid transparent",
              outline: "none",
              font: "inherit",
              textAlign: "left",
              width: "100%",
              transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": {
                backgroundColor: "rgba(240, 244, 253, 0.7)",
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
              <Box
                sx={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  backgroundColor: "#F0F4FC",
                  color: "#08194D",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <LoginRoundedIcon sx={{ fontSize: "22px" }} />
              </Box>

              <Typography
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#08194D",
                }}
              >
                Sign In
              </Typography>
            </Box>

            <ChevronRightRoundedIcon
              sx={{
                fontSize: "22px",
                color: "#8FA0BE",
              }}
            />
          </Box>

          {/* Get Started CTA */}
          <Button
            onClick={() => onAuthNav("/register")}
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: "20px" }} />}
            sx={{
              mt: 2,
              mb: 1.5,
              height: { xs: "52px", sm: "54px" },
              borderRadius: "22px",
              background: "linear-gradient(135deg, #0984E3 0%, #1769E0 45%, #6C38FF 100%)",
              boxShadow:
                "0 10px 24px -4px rgba(23, 105, 224, 0.38), 0 4px 12px -2px rgba(108, 56, 255, 0.28)",
              fontFamily: '"Manrope", sans-serif',
              fontSize: "16px",
              fontWeight: 700,
              textTransform: "none",
              color: "#FFFFFF",
              transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #0779D3 0%, #145FCC 45%, #5E2DE3 100%)",
                boxShadow:
                  "0 14px 28px -4px rgba(23, 105, 224, 0.45), 0 6px 16px -2px rgba(108, 56, 255, 0.35)",
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              "&:focus-visible": {
                outline: "2px solid #1468F2",
                outlineOffset: "2px",
              },
            }}
          >
            Get Started
          </Button>

          {/* Spacer for short screens scrolling */}
          <Box sx={{ height: 12, flexShrink: 0 }} />
        </Box>

        {/* ── Footer ── */}
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
              height: "120px",
              pointerEvents: "none",
              overflow: "hidden",
              borderBottomLeftRadius: "28px",
              zIndex: 0,
            }}
          >
            <svg
              viewBox="0 0 380 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              <path
                d="M0,45 C90,10 180,95 380,25 L380,120 L0,120 Z"
                fill="url(#mobileDrawerWave1)"
                opacity="0.45"
              />
              <path
                d="M0,75 C120,40 240,110 380,55 L380,120 L0,120 Z"
                fill="url(#mobileDrawerWave2)"
                opacity="0.35"
              />
              <defs>
                <linearGradient
                  id="mobileDrawerWave1"
                  x1="0"
                  y1="0"
                  x2="380"
                  y2="120"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#D4E3FC" />
                  <stop offset="0.6" stopColor="#E9E2FD" />
                  <stop offset="1" stopColor="#F5F0FF" />
                </linearGradient>
                <linearGradient
                  id="mobileDrawerWave2"
                  x1="0"
                  y1="0"
                  x2="380"
                  y2="120"
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
                color: "#1769E0",
                filter: "drop-shadow(0 2px 4px rgba(23, 105, 224, 0.25))",
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
  );
};

export default MobileNavDrawer;
