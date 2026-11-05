import React from "react";
import { Box, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { navigationItems } from "../../navConfig";

interface DrawerNavItemsProps {
  isNavigationItemActive: (path: string) => boolean;
  onNavigate: (path: string) => void;
}

export const DrawerNavItems: React.FC<DrawerNavItemsProps> = ({
  isNavigationItemActive,
  onNavigate,
}) => {
  return (
    <>
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
              onClick={() => onNavigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onNavigate(item.path);
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
    </>
  );
};

export default DrawerNavItems;
