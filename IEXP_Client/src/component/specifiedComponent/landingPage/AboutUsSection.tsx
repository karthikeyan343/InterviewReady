import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { Link } from "react-router-dom";

import aboutBackground from "../../../assets/AboutUsBg.png";
import aboutImage from "../../../assets/AboutUsImg.png";

const aboutPoints = [
  {
    icon: <TrackChangesOutlinedIcon />,
    title: "Our Mission",
    description:
      "To empower every learner with the right tools and practice to achieve their career goals.",
  },
  {
    icon: <GroupsOutlinedIcon />,
    title: "Who We Are",
    description:
      "A team passionate about creating practical opportunities through technology.",
  },
  {
    icon: <LightbulbOutlinedIcon />,
    title: "What We Believe",
    description:
      "With the right practice and guidance, everyone can unlock their potential and succeed.",
  },
];

const AboutUsSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="about-us"
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundImage: `url(${aboutBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: '"Manrope", sans-serif',
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
      }}
    >

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(245,250,255,0.18), rgba(255,255,255,0.08))",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          px: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            alignItems: "center",
            gap: {
              xs: 5,
              sm: 6,
              md: 7,
              lg: 8,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              order: {
                xs: 2,
                md: 1,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                borderRadius: {
                  xs: "16px",
                  sm: "20px",
                  md: "22px",
                },
                overflow: "hidden",
                boxShadow:
                  "0 20px 50px rgba(42, 104, 190, 0.12)",
              }}
            >
              <Box
                component="img"
                src={aboutImage}
                alt="InterviewReady AI interview preparation"
                sx={{
                  display: "block",
                  width: "100%",
                  height: {
                    xs: "300px",
                    sm: "390px",
                    md: "470px",
                    lg: "500px",
                  },
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              order: {
                xs: 1,
                md: 2,
              },
              pl: {
                xs: 0,
                md: 1,
                lg: 2,
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                  md: "12px",
                },
                fontWeight: 800,
                letterSpacing: "1.8px",
                color: "#6676d9",
                mb: 1,
              }}
            >
              ABOUT US
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "30px",
                  sm: "36px",
                  md: "42px",
                  lg: "46px",
                },
                lineHeight: 1.14,
                fontWeight: 800,
                letterSpacing: "-1.2px",
                color: "#111b3d",
                mb: 2.2,
              }}
            >
              Helping you become
              <br />
              interview{" "}
              <Box
                component="span"
                sx={{
                  color: "#1769e0",
                }}
              >
                ready.
              </Box>
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                  md: "15px",
                },
                lineHeight: 1.7,
                fontWeight: 500,
                color: "#61749c",
                maxWidth: "570px",
                mb: 3.2,
              }}
            >
              InterviewReady is built to make interview preparation simple,
              effective, and accessible. We combine AI-powered practice with
              personalized feedback to help you build confidence, improve your
              skills, and perform your best in real interviews.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: {
                  xs: 2,
                  md: 2.5,
                },
              }}
            >
              {aboutPoints.map((point) => (
                <Box
                  key={point.title}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: {
                      xs: 1.5,
                      sm: 1.8,
                    },
                  }}
                >

                  <Box
                    sx={{
                      flexShrink: 0,
                      width: {
                        xs: 46,
                        sm: 50,
                      },
                      height: {
                        xs: 46,
                        sm: 50,
                      },
                      borderRadius: "11px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(228, 240, 255, 0.9)",
                      border: "1px solid rgba(210, 228, 251, 0.9)",
                      color: "#1769e0",

                      "& svg": {
                        fontSize: {
                          xs: 23,
                          sm: 25,
                        },
                      },
                    }}
                  >
                    {point.icon}
                  </Box>

                  {/* Text */}
                  <Box
                    sx={{
                      pt: 0.2,
                    }}
                  >
                    <Typography
                      component="h3"
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontSize: {
                          xs: "15px",
                          sm: "16px",
                          md: "17px",
                        },
                        lineHeight: 1.35,
                        fontWeight: 800,
                        color: "#111b3d",
                        mb: 0.3,
                      }}
                    >
                      {point.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontSize: {
                          xs: "12px",
                          sm: "13px",
                          md: "14px",
                        },
                        lineHeight: 1.55,
                        fontWeight: 500,
                        color: "#667ba4",
                        maxWidth: "500px",
                      }}
                    >
                      {point.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* CTA */}
            <Button
              variant="contained"
              component={Link}
              to="/register"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 3.5,
                minWidth: {
                  xs: "150px",
                  sm: "165px",
                },
                height: {
                  xs: "44px",
                  sm: "48px",
                },
                px: {
                  xs: 2.2,
                  sm: 2.7,
                },
                borderRadius: "7px",

                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "12px",
                  sm: "13px",
                  md: "14px",
                },
                fontWeight: 700,
                textTransform: "none",

                background:
                  "linear-gradient(135deg, #2878f0 0%, #1769e0 100%)",

                boxShadow:
                  "0 8px 20px rgba(23, 105, 224, 0.20)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #1769e0 0%, #125bc8 100%)",
                  boxShadow:
                    "0 10px 24px rgba(23, 105, 224, 0.28)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsSection;