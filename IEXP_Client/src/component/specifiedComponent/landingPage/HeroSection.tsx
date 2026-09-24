import { Box, Button, Container, Typography } from "@mui/material";
import { ArrowForward, PlayArrow } from "@mui/icons-material";
import { Link } from "react-router-dom";
import heroBackground from "../../../assets/IRBgImg3.png";

const HeroSection = () => {
  return (
    <Box
      id="home"
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: {
          xs: "auto",
          sm: "720px",
          md: "620px",
          lg: "600px",
        },

        display: "flex",
        alignItems: "center",

        backgroundImage: `url(${heroBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",

        backgroundPosition: {
          xs: "76% center",
          sm: "72% center",
          md: "center center",
          lg: "center center",
        },

        fontFamily: '"Manrope", sans-serif',

        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,

          display: {
            xs: "block",
            sm: "none",
          },

          background:
            "linear-gradient(90deg, rgba(244,249,255,0.96) 0%, rgba(244,249,255,0.88) 48%, rgba(244,249,255,0.45) 100%)",

          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth={false}
        sx={{
          position: "relative",
          zIndex: 1,

          width: "100%",
          maxWidth: "1400px",

          mx: "auto",

          px: {
            xs: 2.5,
            sm: 4,
            md: 5,
            lg: 6,
          },
          pt: {
            xs: "115px",
            sm: "135px",
            md: "115px",
            lg: "110px",
          },

          pb: {
            xs: "45px",
            sm: "55px",
            md: "45px",
            lg: "40px",
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "580px",
              md: "570px",
              lg: "600px",
            },

            maxWidth: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              mb: {
                xs: 1.5,
                sm: 1.8,
                md: 2,
              },
            }}
          >
            <Box
              sx={{
                width: { xs: "6px", sm: "7px", md: "8px" },
                height: { xs: "6px", sm: "7px", md: "8px" },
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                flexShrink: 0,
                animation: "blinkDot 1.2s ease-in-out infinite",

                "@keyframes blinkDot": {
                  "0%, 100%": {
                    opacity: 1,
                    transform: "scale(1)",
                  },
                  "50%": {
                    opacity: 0.25,
                    transform: "scale(0.75)",
                  },
                },
              }}
            />

            <Typography
              component="p"
              sx={{
                m: 0,

                color: "#6174A6",

                fontFamily: '"Manrope", sans-serif',

                fontSize: {
                  xs: "10px",
                  sm: "12px",
                  md: "13px",
                },

                fontWeight: 700,

                letterSpacing: {
                  xs: "1.2px",
                  sm: "1.7px",
                  md: "2px",
                },

                lineHeight: 1.4,
              }}
            >
              AI-POWERED INTERVIEW PREPARATION
            </Typography>
          </Box>

          {/* Heading */}
          <Typography
            component="h1"
            sx={{
              m: 0,

              color: "#07194D",

              fontFamily: '"Manrope", sans-serif',

              fontSize: {
                xs: "38px",
                sm: "48px",
                md: "56px",
                lg: "60px",
              },

              lineHeight: {
                xs: 1.08,
                sm: 1.08,
                md: 1.06,
              },

              fontWeight: 800,

              letterSpacing: {
                xs: "-1.4px",
                sm: "-1.5px",
                md: "-2px",
              },
            }}
          >
            Build Confidence.
            <br />
            Get Interview{" "}
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
          <Typography
            component="p"
            sx={{
              m: 0,

              mt: {
                xs: 2,
                sm: 2.3,
                md: 2.5,
              },

              mb: {
                xs: 2.8,
                sm: 3.2,
                md: 3.5,
              },

              maxWidth: {
                xs: "470px",
                sm: "510px",
                md: "520px",
              },

              color: "#536994",

              fontFamily: '"Manrope", sans-serif',

              fontSize: {
                xs: "14px",
                sm: "15px",
                md: "16px",
                lg: "17px",
              },

              fontWeight: 500,

              lineHeight: {
                xs: 1.6,
                sm: 1.55,
                md: 1.55,
              },
            }}
          >
            Simulate real interview experiences, get AI feedback, and improve
            your skills — all in one place.
          </Typography>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",

              flexDirection: {
                xs: "column",
                sm: "row",
              },

              alignItems: {
                xs: "flex-start",
                sm: "center",
              },

              gap: {
                xs: 1.5,
                sm: 2,
              },
              width: "fit-content",

              maxWidth: "100%",
            }}
          >

            <Button
              component={Link}
              to="/register"
              variant="contained"
              endIcon={<ArrowForward />}
              sx={{
                minWidth: {
                  xs: "210px",
                  sm: "210px",
                },
                height: {
                  xs: "48px",
                  sm: "52px",
                },
                px: {
                  xs: 2,
                  sm: 2.5,
                },
                borderRadius: "8px",

                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "15px",
                },
                fontWeight: 700,
                letterSpacing: "0.1px",
                lineHeight: 1,
                textTransform: "none",

                color: "#ffffff",

                backgroundColor: "#1769e0",
                boxShadow: "0 7px 18px rgba(23, 105, 224, 0.22)",

                "&:hover": {
                  backgroundColor: "#125bc8",
                  boxShadow: "0 9px 22px rgba(23, 105, 224, 0.28)",
                },

                "& .MuiButton-endIcon": {
                  marginLeft: "10px",

                  "& svg": {
                    fontSize: "23px",
                  },
                },
              }}
            >
              Start Practicing
            </Button>
            <Button
              href="#how-it-works"
              variant="outlined"
              startIcon={<PlayArrow />}
              sx={{
                width: "auto",

                minWidth: {
                  xs: "235px",
                  sm: "185px",
                },

                height: "50px",

                px: {
                  xs: 3,
                  sm: 2.5,
                },

                borderRadius: "7px",

                borderColor: "#D8E0EE",

                backgroundColor: "rgba(255,255,255,0.94)",

                color: "#26385E",

                fontFamily: '"Manrope", sans-serif',

                textTransform: "none",

                fontSize: {
                  xs: "14px",
                  sm: "15px",
                },

                fontWeight: 700,

                whiteSpace: "nowrap",

                "&:hover": {
                  borderColor: "#B9C8E5",
                  backgroundColor: "#FFFFFF",
                },
              }}
            >
              See How It Works
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              mt: {
                xs: 3.5,
                sm: 4.5,
                md: 5,
              },
              flexWrap: "nowrap",

              width: "fit-content",

              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: "#08194D",

                  fontFamily: '"Manrope", sans-serif',

                  fontSize: {
                    xs: "21px",
                    sm: "23px",
                    md: "24px",
                  },

                  fontWeight: 800,

                  lineHeight: 1.2,
                }}
              >
                1,000+
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "#65769C",

                  fontFamily: '"Manrope", sans-serif',

                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                    md: "13px",
                  },

                  fontWeight: 500,

                  mt: 0.5,

                  whiteSpace: "nowrap",
                }}
              >
                Practice Sessions
              </Typography>
            </Box>
            <Box
              sx={{
                width: "1px",

                height: {
                  xs: "42px",
                  sm: "45px",
                },

                mx: {
                  xs: 1.5,
                  sm: 2.5,
                  md: 3,
                },

                backgroundColor: "#DCE3EF",

                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: "#08194D",

                  fontFamily: '"Manrope", sans-serif',

                  fontSize: {
                    xs: "21px",
                    sm: "23px",
                    md: "24px",
                  },

                  fontWeight: 800,

                  lineHeight: 1.2,
                }}
              >
                4.8/5
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "#65769C",

                  fontFamily: '"Manrope", sans-serif',

                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                    md: "13px",
                  },

                  fontWeight: 500,

                  mt: 0.5,

                  whiteSpace: "nowrap",
                }}
              >
                Demo Rating
              </Typography>
            </Box>
            <Box
              sx={{
                width: "1px",

                height: {
                  xs: "42px",
                  sm: "45px",
                },

                mx: {
                  xs: 1.5,
                  sm: 2.5,
                  md: 3,
                },

                backgroundColor: "#DCE3EF",

                flexShrink: 0,
              }}
            />
            <Box
              sx={{
                flexShrink: 0,
              }}
            >
              <Typography
                component="div"
                sx={{
                  color: "#08194D",

                  fontFamily: '"Manrope", sans-serif',

                  fontSize: {
                    xs: "21px",
                    sm: "23px",
                    md: "24px",
                  },

                  fontWeight: 800,

                  lineHeight: 1.2,
                }}
              >
                92%
              </Typography>

              <Typography
                component="div"
                sx={{
                  color: "#65769C",

                  fontFamily: '"Manrope", sans-serif',

                  fontSize: {
                    xs: "10px",
                    sm: "12px",
                    md: "13px",
                  },

                  fontWeight: 500,

                  mt: 0.5,

                  whiteSpace: "nowrap",
                }}
              >
                Would Recommend
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;