import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import VideoCameraFrontOutlinedIcon from "@mui/icons-material/VideoCameraFrontOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";

import howItWorksImage from "../../../assets/HowItWorksImg.png";

const steps = [
  {
    number: "1",
    icon: <DescriptionOutlinedIcon />,
    title: "Upload Your Resume",
    description:
      "Let InterviewReady understand your background.",
  },
  {
    number: "2",
    icon: <TuneOutlinedIcon />,
    title: "Choose Your Interview",
    description:
      "Select the role, experience level, and difficulty.",
  },
  {
    number: "3",
    icon: <VideoCameraFrontOutlinedIcon />,
    title: "Practice with AI",
    description:
      "Answer questions in a realistic interview environment.",
  },
  {
    number: "4",
    icon: <BarChartOutlinedIcon />,
    title: "Get Detailed Feedback",
    description:
      "Review your performance and improve your skills.",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        width: "100%",
        backgroundColor: "aliceblue",
        fontFamily: '"Manrope", sans-serif',
        overflow: "hidden",
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
        <Box
          sx={{
            textAlign: "center",
            mb: {
              xs: 5,
              md: 6.5,
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "13px",
                sm: "13px",
                md: "18px",
              },
              lineHeight: 1.4,
              fontWeight: 800,
              letterSpacing: "1.8px",
              color: "#6676d9",
              mb: 1,
            }}
          >
            HOW IT WORKS
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "28px",
                sm: "34px",
                md: "38px",
              },
              lineHeight: 1.2,
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "#111b3d",
              mb: 1.2,
            }}
          >
            Get started in 4 simple steps
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
              color: "#7180a3",
            }}
          >
            Go from preparation to progress in minutes.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            columnGap: {
              xs: 3,
              md: 2,
              lg: 3,
            },
            rowGap: {
              xs: 4,
              sm: 5,
              md: 0,
            },
            mb: {
              xs: 7,
              md: 9,
            },
          }}
        >
          {steps.map((step, index) => (
            <Box
              key={step.number}
              sx={{
                position: "relative",
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                flexDirection: {
                  xs: "row",
                  md: "column",
                },
                textAlign: {
                  xs: "left",
                  md: "center",
                },
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: {
                    xs: 52,
                    md: 56,
                  },
                  height: {
                    xs: 52,
                    md: 56,
                  },
                  mr: {
                    xs: 2,
                    md: 0,
                  },
                  mb: {
                    xs: 0,
                    md: 1.8,
                  },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#eef4ff",
                  color: "#2176e8",
                  border: "1px solid #dce8ff",

                  "& svg": {
                    fontSize: {
                      xs: 23,
                      md: 26,
                    },
                  },
                }}
              >
                {step.icon}
                <Box
                  sx={{
                    position: "absolute",
                    top: {
                      xs: -5,
                      md: -6,
                    },
                    left: {
                      xs: -5,
                      md: -6,
                    },
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1769e0",
                    color: "#ffffff",
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: "10px",
                    fontWeight: 800,
                    border: "2px solid #ffffff",
                  }}
                >
                  {step.number}
                </Box>
              </Box>
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: {
                      xs: "15px",
                      sm: "15px",
                      md: "15px",
                    },
                    lineHeight: 1.4,
                    fontWeight: 800,
                    color: "#17203f",
                    mb: 0.6,
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontSize: {
                      xs: "12px",
                      sm: "12px",
                      md: "12px",
                    },
                    lineHeight: 1.55,
                    fontWeight: 500,
                    color: "#7885a4",
                    maxWidth: {
                      xs: "none",
                      md: "190px",
                    },
                    mx: {
                      xs: 0,
                      md: "auto",
                    },
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
              {index < steps.length - 1 && (
                <ArrowForwardRoundedIcon
                  sx={{
                    display: {
                      xs: "none",
                      md: "block",
                    },
                    position: "absolute",
                    top: "24px",
                    right: {
                      md: "-18px",
                      lg: "-24px",
                    },
                    fontSize: 22,
                    color: "#60749d",
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.05fr 0.95fr",
            },
            alignItems: "stretch",
            minHeight: {
              md: "300px",
            },
            overflow: "hidden",
            borderRadius: {
              xs: "14px",
              md: "0px",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: {
                xs: "250px",
                sm: "340px",
                md: "300px",
              },
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={howItWorksImage}
              alt="Practice interview with InterviewReady"
              sx={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#ffffff",
              px: {
                xs: 2.5,
                sm: 4,
                md: 5,
              },
              py: {
                xs: 4,
                md: 3,
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "10px",
                  sm: "11px",
                  md: "11px",
                },
                fontWeight: 800,
                letterSpacing: "1.5px",
                color: "#6676d9",
                mb: 1.2,
              }}
            >
              A MORE CONFIDENT YOU
            </Typography>

            <Typography
              component="h3"
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "26px",
                  sm: "30px",
                  md: "32px",
                },
                lineHeight: 1.18,
                fontWeight: 800,
                letterSpacing: "-0.7px",
                color: "#111b3d",
                mb: 1.5,
                maxWidth: "420px",
              }}
            >
              Practice today.
              <br />
              Perform tomorrow.
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                  md: "14px",
                },
                lineHeight: 1.65,
                fontWeight: 500,
                color: "#7180a3",
                maxWidth: "430px",
                mb: 2.5,
              }}
            >
              InterviewReady helps you build the confidence and skills you
              need to crack interviews and achieve your career goals.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowRightAltRoundedIcon />}
              sx={{
                alignSelf: "flex-start",
                minWidth: "160px",
                height: "44px",
                px: 2.2,
                borderRadius: "7px",
                backgroundColor: "#1769e0",
                boxShadow: "0 5px 14px rgba(23, 105, 224, 0.18)",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#125bc8",
                  boxShadow: "0 7px 18px rgba(23, 105, 224, 0.24)",
                },
              }}
            >
              Start Your Journey
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;