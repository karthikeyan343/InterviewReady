import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";

export const FooterSocialLinks: React.FC = () => {
  return (
    <Box
      sx={{
        gridColumn: {
          xs: "auto",
          sm: "auto",
        },
      }}
    >
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
            xs: 1,
            sm: 1,
          },
        }}
      >
        Follow Us
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: {
            xs: 0.2,
            sm: 0.5,
          },
          flexWrap: "wrap",
        }}
      >
        <IconButton
          size="small"
          sx={{
            color: "#34466d",
            p: 0.7,
            "&:hover": {
              color: "#1769e0",
              backgroundColor: "#eef4ff",
            },
          }}
        >
          <LinkedInIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#34466d",
            p: 0.7,
            "&:hover": {
              color: "#1769e0",
              backgroundColor: "#eef4ff",
            },
          }}
        >
          <TwitterIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#34466d",
            p: 0.7,
            "&:hover": {
              color: "#1769e0",
              backgroundColor: "#eef4ff",
            },
          }}
        >
          <YouTubeIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <IconButton
          size="small"
          sx={{
            color: "#34466d",
            p: 0.7,
            "&:hover": {
              color: "#1769e0",
              backgroundColor: "#eef4ff",
            },
          }}
        >
          <GitHubIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FooterSocialLinks;
