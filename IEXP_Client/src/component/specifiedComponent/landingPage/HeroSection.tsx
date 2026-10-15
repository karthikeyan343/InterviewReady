import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import {
  ArrowForward,
  PlayArrow,
  ChatBubbleOutlined,
  AutoAwesomeOutlined,
  TrendingUp,
  DescriptionOutlined,
  ChevronRight,
  Mic,
  CallEnd,
  Videocam,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import heroBgUnified from "../../../assets/ModernTechConsultingHeroScene.png";

const HeroSection: React.FC = () => {
  const featurePills = [
    {
      id: "interview",
      title: "Real Interview",
      subtitle: "Experience",
      Icon: ChatBubbleOutlined,
      color: "#1468F2",
      iconBackground: "rgba(20, 104, 242, 0.12)",
    },
    {
      id: "feedback",
      title: "Instant",
      subtitle: "AI Feedback",
      Icon: AutoAwesomeOutlined,
      color: "#9333EA",
      iconBackground: "rgba(147, 51, 234, 0.12)",
    },
    {
      id: "progress",
      title: "Track",
      subtitle: "Your Progress",
      Icon: TrendingUp,
      color: "#10B981",
      iconBackground: "rgba(16, 185, 129, 0.12)",
    },
  ];
  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        minHeight: { xs: "100vh", md: "100svh" },
        height: { md: "100svh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "space-between",
        backgroundColor: "#FFFFFF",
        backgroundImage: {
          xs: `linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.55) 60%, rgba(255, 255, 255, 0.2) 100%), url(${heroBgUnified})`,
          md: `url(${heroBgUnified})`,
        },
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: {
          xs: "85% bottom",
          sm: "80% bottom",
          md: "right bottom",
        },
        fontFamily: '"Manrope", sans-serif',
        overflowX: "hidden",
        overflowY: { xs: "visible", md: "hidden" },
        pt: {
          xs: "84px",
          sm: "88px",
          md: "76px",
        },
        pb: {
          xs: "36px",
          sm: "44px",
          md: "24px",
        },
        "@media (max-height: 640px) and (min-width: 900px)": {
          minHeight: "640px",
          height: "auto",
        },
        "@keyframes pulseDot": {
          "0%, 100%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.25)",
            opacity: 0.6,
          },
        },
        "@keyframes floatCard1": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-6px)",
          },
        },
        "@keyframes floatCard2": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        "@keyframes floatCard3": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-7px)",
          },
        },
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1440px",
          mx: "auto",
          px: {
            xs: 2.5,
            sm: 4,
            md: 5,
            lg: 6,
          },
          // The section includes 76px top + 24px bottom padding on desktop.
          // Keep the row inside the available section content height.
          height: {
            xs: "auto",
            md: "calc(100svh - 100px)",
          },
          minHeight: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "stretch",
          justifyContent: "space-between",
          // Column widths already occupy nearly all available space; avoid
          // adding a second large gap that squeezes the hero artwork/text.
          gap: { xs: 4, md: 0, lg: 1 },
        }}
      >
        {/* ── Left Column: Distributed Vertically Across Full Viewport Height on Desktop ── */}
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "46%",
              lg: "45%",
              xl: "44%",
            },
            maxWidth: {
              xs: "100%",
              md: "580px",
              lg: "620px",
            },
            height: {
              xs: "auto",
              md: "100%",
            },
            boxSizing: "border-box",
            // The source design places the copy lower than the navbar and
            // keeps the benefit row above the bottom edge on shorter screens.
            paddingTop: { md: "clamp(42px, 6.6vh, 50px)" },
            paddingBottom: { md: "clamp(48px, 9vh, 68px)" },
            display: "flex",
            flexDirection: "column",
            justifyContent: { xs: "flex-start", md: "space-between" },
            flexShrink: 0,
            zIndex: 3,
          }}
        >
          {/* Top Content Block: Badge, Heading, Subtitle, Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-evenly",
              width: "100%",
              height: '90%',
            }}
          >
            {/* Pill Badge */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                px: { xs: 1.5, sm: 1.8, md: 2 },
                py: { xs: 0.65, sm: 0.7, md: "clamp(5px, 0.7vh, 7px)" },
                borderRadius: "50px",
                backgroundColor: "rgba(255, 255, 255, 0.94)",
                border: "1px solid rgba(20, 104, 242, 0.16)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                width: "fit-content",
                mb: {
                  xs: 1.8,
                  sm: 2,
                  md: "clamp(12px, 1.8vh, 18px)",
                },
                boxShadow: "0 2px 10px rgba(20, 104, 242, 0.05)",
                flexShrink: 0,
              }}
            >
              {/* Blue dot */}
              <Box
                sx={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#f21414aa",
                  boxShadow: "0 0 8px rgba(242, 20, 20, 0.57)",
                  flexShrink: 0,
                  animation: "pulseDot 2s ease-in-out infinite",
                }}
              />
              <Typography
                component="span"
                sx={{
                  color: "#475569",
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: {
                    xs: "10.5px",
                    sm: "11.5px",
                    md: "12px",
                  },
                  fontWeight: 700,
                  letterSpacing: {
                    xs: "1.1px",
                    sm: "1.5px",
                  },
                  lineHeight: 1.3,
                  textTransform: "uppercase",
                }}
              >
                AI-POWERED INTERVIEW PREPARATION
              </Typography>
            </Box>

            {/* Heading */}
            <Typography
              component="h1"
              sx={{
                color: "#071638",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "34px",
                  sm: "42px",
                  md: "clamp(42px, 2.7vw + 1.2vh, 50px)",
                  lg: "clamp(48px, 3.1vw + 1.2vh, 58px)",
                  xl: "60px",
                },
                lineHeight: {
                  xs: 1.15,
                  sm: 1.12,
                  md: 1.08,
                },
                fontWeight: 800,
                letterSpacing: {
                  xs: "-1px",
                  sm: "-1.5px",
                  md: "-2px",
                },
                mb: {
                  xs: 1.8,
                  sm: 2,
                  md: "clamp(12px, 1.6vh, 18px)",
                },
                flexShrink: 0,
              }}
            >
              Practice Smarter.
              <br />
              Get Interview
              <br />
              <Box
                component="span"
                sx={{
                  color: "#1468F2",
                  fontFamily: '"Manrope", sans-serif',
                }}
              >
                Ready.
              </Box>
            </Typography>

            {/* Subtitle */}
            <Typography
              component="p"
              sx={{
                color: "#4A5D8A",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "14.5px",
                  sm: "15.5px",
                  md: "clamp(14.5px, 0.9vw, 16.5px)",
                },
                fontWeight: 500,
                lineHeight: {
                  xs: 1.55,
                  md: 1.5,
                },
                maxWidth: {
                  xs: "100%",
                  sm: "520px",
                },
                mb: {
                  xs: 2.8,
                  sm: 3,
                  md: "clamp(18px, 2.4vh, 26px)",
                },
                flexShrink: 0,
              }}
            >
              Simulate real interview experiences, get AI feedback, and build
              the confidence to land your next role.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                gap: {
                  xs: 1.4,
                  sm: 1.8,
                  md: 2,
                },
                width: {
                  xs: "100%",
                  sm: "fit-content",
                },
                mb: {
                  xs: 3,
                  sm: 3.5,
                  md: 0,
                },
                flexShrink: 0,
              }}
            >
              {/* Primary Button */}
              <Button
                component={Link}
                to="/register"
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: "190px",
                    lg: "210px",
                  },
                  height: {
                    xs: "48px",
                    sm: "50px",
                    md: "clamp(46px, 5.6vh, 52px)",
                  },
                  px: { xs: 3, md: "clamp(20px, 1.6vw, 26px)" },
                  borderRadius: "12px",
                  fontFamily: '"Manrope", sans-serif',
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "0.2px",
                  textTransform: "none",
                  color: "#ffffff",
                  backgroundColor: "#1468F2",
                  boxShadow: "0 8px 22px rgba(20, 104, 242, 0.32)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "#0F55CF",
                    boxShadow: "0 10px 28px rgba(20, 104, 242, 0.42)",
                    transform: "translateY(-1px)",
                  },
                  "& .MuiButton-endIcon": {
                    marginLeft: "8px",
                    "& svg": {
                      fontSize: "20px",
                    },
                  },
                }}
              >
                Start Practicing
              </Button>

              {/* Secondary Button */}
              <Button
                href="#how-it-works"
                variant="outlined"
                startIcon={
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: "1.5px solid #1468F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <PlayArrow
                      sx={{
                        fontSize: "14px",
                        color: "#1468F2",
                        ml: "1px",
                      }}
                    />
                  </Box>
                }
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: "180px",
                    lg: "200px",
                  },
                  height: {
                    xs: "48px",
                    sm: "50px",
                    md: "clamp(46px, 5.6vh, 52px)",
                  },
                  px: { xs: 2.5, md: "clamp(16px, 1.4vw, 22px)" },
                  borderRadius: "12px",
                  borderColor: "#D8E0EE",
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                  color: "#08194D",
                  fontFamily: '"Manrope", sans-serif',
                  textTransform: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "#B9C8E5",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
                    transform: "translateY(-1px)",
                  },
                  "& .MuiButton-startIcon": {
                    marginRight: "6px",
                  },
                }}
              >
                See How It Works
              </Button>
            </Box>
          </Box>

          {/* ── Mobile Feature Badges (Screens < md) ── */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
              gap: 1,
              my: { xs: 3, sm: 2.8 },
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.4,
                py: 0.7,
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(220, 230, 246, 0.9)",
                boxShadow: "0 2px 8px rgba(15, 30, 80, 0.04)",
              }}
            >
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  backgroundColor: "#1468F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChatBubbleOutlined sx={{ fontSize: "14px", color: "#FFFFFF" }} />
              </Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#08194D" }}>
                AI Interviewer
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.4,
                py: 0.7,
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(220, 230, 246, 0.9)",
                boxShadow: "0 2px 8px rgba(15, 30, 80, 0.04)",
              }}
            >
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  backgroundColor: "#1468F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DescriptionOutlined sx={{ fontSize: "14px", color: "#FFFFFF" }} />
              </Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#08194D" }}>
                Instant Feedback
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.4,
                py: 0.7,
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(220, 230, 246, 0.9)",
                boxShadow: "0 2px 8px rgba(15, 30, 80, 0.04)",
              }}
            >
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  backgroundColor: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp sx={{ fontSize: "14px", color: "#FFFFFF" }} />
              </Box>
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#08194D" }}>
                Track Progress
              </Typography>
            </Box>
          </Box>

          {/* ── Bottom 3 Feature Highlights (Never hidden or cut off on small screens) ── */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, max-content)",
              justifyContent: "start",
              alignItems: "center",

              columnGap: {
                xs: 0.8,
                sm: 1.2,
                md: 1.5,
              },

              rowGap: {
                xs: 1,
                sm: 1.2,
                md: 1.4,
              },

              width: "fit-content",
              maxWidth: "100%",

              mt: {
                xs: 2.2,
                sm: 2.8,
                md: 2,
              },

              flexShrink: 0,
              boxSizing: "border-box",
            }}
          >
            {featurePills.map((feature) => {
              const Icon = feature.Icon;
              const isLastPill = feature.id === "progress";

              return (
                <Box
                  key={feature.id}
                  sx={{
                    gridColumn: isLastPill ? "1 / -1" : "auto",
                    justifySelf: isLastPill ? "center" : "start",

                    display: "inline-flex",
                    alignItems: "center",
                    gap: {
                      xs: 0.75,
                      sm: 1,
                    },

                    width: "fit-content",
                    maxWidth: "100%",
                    minWidth: 0,
                    boxSizing: "border-box",

                    px: {
                      xs: 1,
                      sm: 1.4,
                      md: 1.5,
                    },

                    py: {
                      xs: 0.75,
                      sm: 0.9,
                      md: 1,
                    },

                    borderRadius: "999px",

                    backgroundColor: "rgba(255, 255, 255, 0.42)",

                    border: "1px solid rgba(255, 255, 255, 0.8)",

                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",

                    boxShadow: `
            0 6px 18px rgba(38, 89, 170, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.7)
          `,

                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",

                    "&:hover": {
                      transform: "translateY(-2px)",
                      backgroundColor: "rgba(255, 255, 255, 0.68)",
                      boxShadow: "0 10px 24px rgba(38, 89, 170, 0.14)",
                    },
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: {
                        xs: "30px",
                        sm: "34px",
                      },

                      height: {
                        xs: "30px",
                        sm: "34px",
                      },

                      minWidth: {
                        xs: "30px",
                        sm: "34px",
                      },

                      borderRadius: "10px",

                      backgroundColor: feature.iconBackground,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      sx={{
                        fontSize: {
                          xs: "16px",
                          sm: "18px",
                        },
                        color: feature.color,
                      }}
                    />
                  </Box>

                  {/* Feature Text */}
                  <Box
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 700,

                        fontSize: {
                          xs: "10px",
                          sm: "12px",
                        },

                        color: "#08194D",
                        lineHeight: 1.25,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 500,

                        fontSize: {
                          xs: "9px",
                          sm: "11px",
                        },

                        color: "#5C6F96",
                        lineHeight: 1.25,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {feature.subtitle}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* ── Right Column: Visual Stage (Proper Height & Width, Never Overlaps Left Column) ── */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            width: { md: "52%", lg: "54%", xl: "55%" },
            height: "100%",
            position: "relative",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            flexShrink: 0,
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          {/* Interactive Floating Stage (Cards & Call Controls) */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              pointerEvents: "none",
            }}
          >

            {/* Card 1: AI Interviewer (Top-Right of candidate) */}
            <Box
              sx={{
                position: "absolute",
                top: { md: "8%", lg: "9%" },
                right: { md: "1%", lg: "3%" },
                display: "flex",
                alignItems: "center",
                gap: 1.3,
                px: { md: 1.6, lg: 2 },
                py: { md: 0.9, lg: 1.1 },
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: "floatCard1 4.5s ease-in-out infinite",
                zIndex: 5,
                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
                },
              }}
            >
              <Box
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#1468F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(20, 104, 242, 0.3)",
                }}
              >
                <ChatBubbleOutlined
                  sx={{
                    fontSize: "18px",
                    color: "#FFFFFF",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 700,
                    fontSize: { md: "12.5px", lg: "13.5px" },
                    color: "#08194D",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  AI Interviewer
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 500,
                    fontSize: { md: "10px", lg: "11px" },
                    color: "#64748B",
                    lineHeight: 1.2,
                    mt: 0.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  Role-specific questions
                </Typography>
              </Box>
              <ChevronRight sx={{ fontSize: "18px", color: "#94A3B8", ml: 0.2 }} />
            </Box>

            {/* Card 2: Instant Feedback (Middle-Left, to the left of her shoulder) */}
            <Box
              sx={{
                position: "absolute",
                top: { md: "42%", lg: "42%" },
                left: { md: "-4%", lg: "-2%" },
                display: "flex",
                alignItems: "center",
                gap: 1.3,
                px: { md: 1.6, lg: 2 },
                py: { md: 0.9, lg: 1.1 },
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: "floatCard2 5s ease-in-out infinite 0.7s",
                zIndex: 5,
                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
                },
              }}
            >
              <Box
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#1468F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(20, 104, 242, 0.3)",
                }}
              >
                <DescriptionOutlined
                  sx={{
                    fontSize: "18px",
                    color: "#FFFFFF",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 700,
                    fontSize: { md: "12.5px", lg: "13.5px" },
                    color: "#08194D",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  Instant Feedback
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 500,
                    fontSize: { md: "10px", lg: "11px" },
                    color: "#64748B",
                    lineHeight: 1.2,
                    mt: 0.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  Improve your answers
                </Typography>
              </Box>
              <ChevronRight sx={{ fontSize: "18px", color: "#94A3B8", ml: 0.2 }} />
            </Box>

            {/* Card 3: Track Progress (Middle-Right, to the right of her shoulder) */}
            <Box
              sx={{
                position: "absolute",
                top: { md: "42%", lg: "42%" },
                right: { md: "-2%", lg: "0%" },
                display: "flex",
                alignItems: "center",
                gap: 1.3,
                px: { md: 1.6, lg: 2 },
                py: { md: 0.9, lg: 1.1 },
                borderRadius: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
                cursor: "pointer",
                pointerEvents: "auto",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                animation: "floatCard3 4.8s ease-in-out infinite 1.4s",
                zIndex: 5,
                "&:hover": {
                  transform: "translateY(-4px) scale(1.02)",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)",
                },
              }}
            >
              <Box
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                }}
              >
                <TrendingUp
                  sx={{
                    fontSize: "19px",
                    color: "#FFFFFF",
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 700,
                    fontSize: { md: "12.5px", lg: "13.5px" },
                    color: "#08194D",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  Track Progress
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 500,
                    fontSize: { md: "10px", lg: "11px" },
                    color: "#64748B",
                    lineHeight: 1.2,
                    mt: 0.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  See your growth
                </Typography>
              </Box>
              <ChevronRight sx={{ fontSize: "18px", color: "#94A3B8", ml: 0.2 }} />
            </Box>

            {/* Floating Call Controls (Mic, End Call, Video on laptop) */}
            <Box
              sx={{
                position: "absolute",
                bottom: { md: "14%", lg: "14%" },
                left: { md: "46%", lg: "48%" },
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                zIndex: 6,
                p: 0.7,
                borderRadius: "32px",
                backgroundColor: "rgba(15, 23, 42, 0.25)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                pointerEvents: "auto",
              }}
            >
              <Box
                sx={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(30, 41, 59, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(30, 41, 59, 0.9)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <Mic sx={{ fontSize: "18px", color: "#FFFFFF" }} />
              </Box>
              <Box
                sx={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "#EF4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(239, 68, 68, 0.45)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#DC2626",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <CallEnd sx={{ fontSize: "20px", color: "#FFFFFF" }} />
              </Box>
              <Box
                sx={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(30, 41, 59, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(30, 41, 59, 0.9)",
                    transform: "scale(1.08)",
                  },
                }}
              >
                <Videocam sx={{ fontSize: "18px", color: "#FFFFFF" }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;