import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

import logo from "../../../assets/LogoIR.png";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about-us" },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);

    if (href.startsWith("#")) {
      const element = document.querySelector(href);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: "fixed",
          zIndex: 1200,

          top: {
            xs: scrolled ? "10px" : 0,
            md: scrolled ? "14px" : 0,
          },

          left: "50%",

          transform: "translateX(-50%)",

          width: {
            xs: scrolled ? "calc(100% - 20px)" : "100%",
            md: scrolled ? "calc(100% - 48px)" : "100%",
          },

          maxWidth: {
            xs: "none",
            md: scrolled ? "1240px" : "none",
          },

          borderRadius: {
            xs: scrolled ? "10px" : 0,
            md: scrolled ? "8px" : 0,
          },

          backgroundColor: scrolled
            ? "rgba(255, 255, 255, 0.96)"
            : "transparent",

          border: scrolled
            ? "1.5px solid rgba(220, 226, 239, 0.9)"
            : "1px solid transparent",

          boxShadow: scrolled
            ? "0 10px 35px rgba(20, 35, 70, 0.10)"
            : "none",

          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",

          transition:
            "top 0.3s ease, width 0.3s ease, max-width 0.3s ease, border-radius 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",

          fontFamily: '"Manrope", sans-serif',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            height: {
              xs: "68px",
              md: scrolled ? "68px" : "82px",
            },

            maxWidth: scrolled ? "none" : "1400px",

            mx: "auto",

            px: {
              xs: 2,
              sm: 3,
              md: 3,
              lg: 4,
            },

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            transition: "height 0.3s ease",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
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
              }}
            />
          </Box>
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
                    handleNavClick(item.href);
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

                  fontWeight: 800,

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
          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
              alignItems: "center",
              gap: {
                md: 1.5,
                lg: 2,
              },
              ml: {
                md: 3,
                lg: 4,
              },
            }}
          >
            <Button
              component={Link}
              to="/login"
              sx={{
                minWidth: "auto",
                px: 1.5,

                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  md: "14px",
                  lg: "16px",
                },
                fontWeight: 800,

                color:"#17203f",

                textTransform: "none",

                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#1769e0" ,
                },
              }}
            >
              Sign In
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{
                minWidth: {
                  md: "125px",
                  lg: "135px",
                },

                height: {
                  md: "44px",
                  lg: "46px",
                },

                px: 2.5,

                borderRadius: "22px",

                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  md: "14px",
                  lg: "15px",
                },
                fontWeight: 700,

                textTransform: "none",

                background:
                  "linear-gradient(135deg, #2878f0 0%, #1769e0 100%)",

                boxShadow:
                  "0 6px 18px rgba(37, 115, 235, 0.22)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1769e0 0%, #125bc8 100%)",

                  boxShadow:
                    "0 8px 22px rgba(37, 115, 235, 0.30)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
          <IconButton
            onClick={() => setMobileOpen(true)}
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },

              color:"#17203f",

              borderRadius: "10px",
            }}
          >
            <MenuIcon />
          </IconButton>
        </Container>
      </Box>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "82%",
                sm: "360px",
              },
              p: 3,
              fontFamily: '"Manrope", sans-serif',
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 5,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="InterviewReady"
            sx={{
              width: "155px",
            }}
          />

          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
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
                  handleNavClick(item.href);
                }
              }}
              sx={{
                textDecoration: "none",
                color: "#17203f",
                fontFamily: '"Manrope", sans-serif',
                fontSize: "16px",
                fontWeight: 600,
                px: 2,
                py: 1.5,
                borderRadius: "10px",

                "&:hover": {
                  backgroundColor: "#f3f6ff",
                  color: "#1769e0",
                },
              }}
            >
              {item.label}
            </Typography>
          ))}

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Button
              component={Link}
              to="/login"
              onClick={() => setMobileOpen(false)}
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 700,
                textTransform: "none",
                color: "#17203f",
              }}
            >
              Sign In
            </Button>

            <Button
              component={Link}
              to="/register"
              variant="contained"
              onClick={() => setMobileOpen(false)}
              sx={{
                height: "46px",
                borderRadius: "10px",
                fontFamily: '"Manrope", sans-serif',
                fontWeight: 700,
                textTransform: "none",
                background:
                  "linear-gradient(135deg, #2878f0 0%, #1769e0 100%)",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;