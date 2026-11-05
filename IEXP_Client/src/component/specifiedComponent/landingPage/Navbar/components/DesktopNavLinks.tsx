import React from "react";
import { Box, Typography } from "@mui/material";
import { navItems } from "../types";

interface DesktopNavLinksProps {
  onNavClick: (href: string) => void;
}

export const DesktopNavLinks: React.FC<DesktopNavLinksProps> = ({ onNavClick }) => {
  return (
    <Box
      sx={{
        display: {
          xs: "none",
          md: "flex",
        },
        alignItems: "center",
        gap: {
          md: 3,
          lg: 4,
        },
        ml: "auto",
      }}
    >
      {navItems.map((item) => (
        <Typography
          key={item.label}
          component="a"
          href={item.href}
          onClick={(event) => {
            if (item.href.startsWith("#")) {
              event.preventDefault();
              onNavClick(item.href);
            }
          }}
          sx={{
            textDecoration: "none",
            cursor: "pointer",
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              md: "14px",
              lg: "16px",
              xl: "18px",
            },
            fontWeight: 600,
            color: "#17203f",
            transition: "color 0.25s ease",
            "&:hover": {
              color: "#1769e0",
            },
          }}
        >
          {item.label}
        </Typography>
      ))}
    </Box>
  );
};
