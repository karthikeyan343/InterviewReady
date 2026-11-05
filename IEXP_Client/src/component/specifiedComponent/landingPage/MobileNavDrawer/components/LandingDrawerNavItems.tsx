import React from "react";
import { Box, Typography } from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { navDrawerItems } from "../navDrawerConfig";

interface LandingDrawerNavItemsProps {
  activeSection: string;
  onNavClick: (href: string) => void;
}

export const LandingDrawerNavItems: React.FC<LandingDrawerNavItemsProps> = ({
  activeSection,
  onNavClick,
}) => {
  return (
    <>
      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: "12px",
          fontWeight: 700,
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

                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: "16px",
                    fontWeight: isActive ? 700 : 600,
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

export default LandingDrawerNavItems;
