import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
} from "@mui/material";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";

import logo from "../../../assets/LogoIR.png";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderTop: "1px solid #e5eaf2",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
          pt: {
            xs: 5,
            sm: 6,
            md: 6,
          },
          pb: {
            xs: 2.5,
            sm: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1.6fr 1fr 1fr 1fr 1fr",
              md: "1.8fr 1fr 1fr 1fr 1fr",
            },

            columnGap: {
              xs: 3,
              sm: 3,
              md: 5,
              lg: 6,
            },

            rowGap: {
              xs: 4,
              sm: 0,
            },
          }}
        >
          <Box
            sx={{
              gridColumn: {
                xs: "1 / -1",
                sm: "auto",
              },
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="InterviewReady"
              sx={{
                width: {
                  xs: "165px",
                  sm: "200px",
                },
                height: "auto",
                display: "block",
                mb: 1.2,
              }}
            />

            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },
                fontWeight: 500,
                color: "#7180a3",
                lineHeight: 1.5,
              }}
            >
              Practice. Improve. Get Hired.
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },
                fontWeight: 800,
                color: "#17203f",
                mb: 1.5,
              }}
            >
              Product
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.9,
              }}
            >
              {[
                "Features",
                "How It Works",
                "Pricing",
                "Updates",
              ].map((item) => (
                <Typography
                  key={item}
                  component="a"
                  href={
                    item === "Features"
                      ? "#features"
                      : item === "How It Works"
                        ? "#how-it-works"
                        : "#"
                  }
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    textDecoration: "none",
                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                    fontWeight: 500,
                    color: "#7180a3",
                    transition: "color 0.2s ease",

                    "&:hover": {
                      color: "#1769e0",
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },
                fontWeight: 800,
                color: "#17203f",
                mb: 1.5,
              }}
            >
              Company
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.9,
              }}
            >
              {[
                "About",
                "Careers",
                "Blog",
                "Contact",
              ].map((item) => (
                <Typography
                  key={item}
                  component="a"
                  href={
                    item === "About"
                      ? "#about-us"
                      : "#"
                  }
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    textDecoration: "none",
                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                    fontWeight: 500,
                    color: "#7180a3",
                    transition: "color 0.2s ease",

                    "&:hover": {
                      color: "#1769e0",
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },
                fontWeight: 800,
                color: "#17203f",
                mb: 1.5,
              }}
            >
              Legal
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.9,
              }}
            >
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
              ].map((item) => (
                <Typography
                  key={item}
                  component="a"
                  href="#"
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    textDecoration: "none",
                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                    fontWeight: 500,
                    color: "#7180a3",
                    transition: "color 0.2s ease",

                    "&:hover": {
                      color: "#1769e0",
                    },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              gridColumn: {
                xs: "1 / -1",
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
                fontWeight: 800,
                color: "#17203f",
                mb: 1,
              }}
            >
              Follow Us
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
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
                <LinkedInIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
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
                <TwitterIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
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
                <YouTubeIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
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
                <GitHubIcon
                  sx={{
                    fontSize: 20,
                  }}
                />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: {
              xs: 4,
              sm: 5,
            },

            pt: 2.5,

            borderTop: "1px solid #edf0f5",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            gap: 2,

            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "10px",
                sm: "11px",
              },
              fontWeight: 500,
              color: "#7180a3",
            }}
          >
            © 2026 InterviewReady. All rights reserved.
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "10px",
                sm: "11px",
              },
              fontWeight: 500,
              color: "#7180a3",
            }}
          >
            Built for ambitious minds.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;