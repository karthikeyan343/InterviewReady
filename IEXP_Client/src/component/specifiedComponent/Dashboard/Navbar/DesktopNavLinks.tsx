import React from "react";
import { Box, Typography } from "@mui/material";
import { navigationItems } from "./navConfig";

interface DesktopNavLinksProps {
  isNavigationItemActive: (path: string) => boolean;
  handleNavigation: (path: string) => void;
}

export const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({
  isNavigationItemActive,
  handleNavigation,
}) => {
  return (
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
  );
};

