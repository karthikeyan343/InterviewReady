import React from "react";
import { Box, Typography } from "@mui/material";
import type { FooterLinkItem } from "../footerConfig";

interface FooterLinksColumnProps {
  title: string;
  links: FooterLinkItem[];
}

export const FooterLinksColumn: React.FC<FooterLinksColumnProps> = ({
  title,
  links,
}) => {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "13px",
            sm: "14px",
          },
          fontWeight: 700,
          color: "#17203f",
          mb: {
            xs: 1.2,
            sm: 1.5,
          },
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.9,
        }}
      >
        {links.map((item) => (
          <Typography
            key={item.label}
            component="a"
            href={item.href}
            sx={{
              fontFamily: '"Manrope", sans-serif',
              textDecoration: "none",
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              fontWeight: 400,
              color: "#7180a3",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "#1769e0",
              },
            }}
          >
            {item.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default FooterLinksColumn;
