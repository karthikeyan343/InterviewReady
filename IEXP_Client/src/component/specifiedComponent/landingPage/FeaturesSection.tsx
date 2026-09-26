import React from "react";
import { Box, Container, Typography } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import featuresBackground from "../../../assets/HeroBgIR1.png";

const features = [
  {
    icon: <ChatOutlinedIcon />,
    title: "AI Mock Interviews",
    description:
      "Practice with realistic, role-specific questions powered by AI.",
    iconBackground: "#e8f1ff",
    iconColor: "#2878e8",
  },
  {
    icon: <DescriptionOutlinedIcon />,
    title: "Resume Analysis",
    description:
      "Get detailed feedback and actionable suggestions to improve your resume.",
    iconBackground: "#e2f8ee",
    iconColor: "#16a05d",
  },
  {
    icon: <BarChartOutlinedIcon />,
    title: "Track Your Progress",
    description:
      "Monitor your performance over time and see real improvement.",
    iconBackground: "#f1e6ff",
    iconColor: "#8747e8",
  },
  {
    icon: <TrackChangesOutlinedIcon />,
    title: "Personalized Feedback",
    description:
      "Get AI-driven insights on your answers, communication skills, and more.",
    iconBackground: "#fff0e2",
    iconColor: "#f47721",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="features"
      sx={{
        position: "relative",
        width: "100%",
        backgroundImage: `url(${featuresBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: {
          xs: "center center",
          sm: "center center",
          md: "center center",
        },
        fontFamily: '"Manrope", sans-serif',
        overflow: "hidden",
        py: {
          xs: 5,
          sm: 6,
          md: 7,
        },
      }}
    >
      {/* Background overlay gradient allowing the image to show through clearly */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(180deg, rgba(244, 249, 255, 0.48) 0%, rgba(244, 249, 255, 0.22) 50%, rgba(244, 249, 255, 0.50) 100%)",
            md: "linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.55) 100%)",
          },
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
        {/* Section Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: {
              xs: 4,
              sm: 5,
              md: 6,
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "12px",
                sm: "14px",
              },
              lineHeight: 1.4,
              fontWeight: 800,
              letterSpacing: "1.8px",
              color: "#1769e0",
              mb: 0.8,
            }}
          >
            FEATURES
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "26px",
                sm: "30px",
                md: "34px",
              },
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: "-0.6px",
              color: "#08194D",
              mb: 1,
            }}
          >
            Everything You Need to Succeed
          </Typography>

          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "13px",
                sm: "14px",
                md: "15px",
              },
              lineHeight: 1.6,
              fontWeight: 500,
              color: "#5C6F96",
              maxWidth: "520px",
              mx: "auto",
            }}
          >
            Powerful tools designed to help you practice, improve, and land your
            dream job.
          </Typography>
        </Box>

        {/* Feature Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
            },
            gap: {
              xs: 2,
              sm: 2.5,
              md: 3,
            },
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature.title}
              sx={{
                minHeight: {
                  xs: "115px",
                  sm: "125px",
                  md: "130px",
                },
                display: "flex",
                alignItems: "center",
                gap: {
                  xs: 2,
                  sm: 2.5,
                },
                px: {
                  xs: 2,
                  sm: 2.5,
                  md: 3,
                },
                py: {
                  xs: 2,
                  sm: 2.2,
                },
                borderRadius: "14px",
                backgroundColor: {
                  xs: "rgba(255, 255, 255, 0.72)",
                  sm: "rgba(255, 255, 255, 0.76)",
                  md: "rgba(255, 255, 255, 0.80)",
                },
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.85)",
                boxShadow: "0 8px 24px rgba(15, 30, 80, 0.06)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  backgroundColor: "rgba(255, 255, 255, 0.94)",
                  boxShadow: "0 12px 30px rgba(15, 30, 80, 0.12)",
                  borderColor: "rgba(20, 104, 242, 0.3)",
                },
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: {
                    xs: 46,
                    sm: 48,
                    md: 48,
                  },
                  height: {
                    xs: 46,
                    sm: 48,
                    md: 48,
                  },
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: feature.iconBackground,
                  color: feature.iconColor,
                  "& svg": {
                    fontSize: {
                      xs: 23,
                      sm: 24,
                    },
                  },
                }}
              >
                {feature.icon}
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: {
                      xs: "15px",
                      sm: "16px",
                    },
                    lineHeight: 1.35,
                    fontWeight: 800,
                    color: "#08194D",
                    mb: 0.5,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: {
                      xs: "12px",
                      sm: "13px",
                    },
                    lineHeight: 1.55,
                    fontWeight: 500,
                    color: "#5C6F96",
                    maxWidth: "430px",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesSection;