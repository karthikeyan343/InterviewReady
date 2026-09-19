import React from "react";
import { Box, Container, Typography } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

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
        width: "100%",
        backgroundColor: "#ffffff",
        py: {
          xs: 3,
          sm: 4,
          md: 5,
        },
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
              fontSize: {
                xs: "13px",
                sm: "18px",
              },
              lineHeight: 1.4,
              fontWeight: 800,
              letterSpacing: "1.8px",
              color: "#6676d9",
              mb: 0.8,
            }}
          >
            FEATURES
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontSize: {
                xs: "25px",
                sm: "29px",
                md: "32px",
              },
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: "-0.6px",
              color: "#111b3d",
              mb: 1,
            }}
          >
            Everything You Need to Succeed
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "12px",
                sm: "13px",
                md: "14px",
              },
              lineHeight: 1.6,
              fontWeight: 500,
              color: "#7180a3",
            }}
          >
            Powerful tools designed to help you practice, improve, and land
            your dream job.
          </Typography>
        </Box>
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
                  xs: "125px",
                  sm: "128px",
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
                border: "1px solid #edf0f6",
                borderRadius: "8px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 14px rgba(30, 50, 90, 0.035)",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 22px rgba(30, 50, 90, 0.07)",
                  borderColor: "#e1e6f1",
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
                  borderRadius: "9px",
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
                    fontSize: {
                      xs: "14px",
                      sm: "15px",
                    },
                    lineHeight: 1.35,
                    fontWeight: 800,
                    color: "#17203f",
                    mb: 0.5,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "11px",
                      sm: "12px",
                    },
                    lineHeight: 1.55,
                    fontWeight: 500,
                    color: "#7885a4",
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