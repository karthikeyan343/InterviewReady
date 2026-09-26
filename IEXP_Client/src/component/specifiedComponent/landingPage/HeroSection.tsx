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
        alignItems: {
          xs: "flex-start",
          md: "center",
        },

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
      {/* Mobile background overlay gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: {
            xs: "block",
            sm: "none",
          },
          background:
            "linear-gradient(90deg, rgba(244,249,255,0.92) 0%, rgba(244,249,255,0.70) 44%, rgba(244,249,255,0.10) 100%)",
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
            xs: "90px",
            sm: "115px",
            md: "115px",
            lg: "110px",
          },

          pb: {
            xs: "45px",
            sm: "50px",
            md: "45px",
            lg: "40px",
          },

          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* Main hero focal content (Badge, Heading, Subtitle, Buttons) */}
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "580px",
              md: "570px",
              lg: "600px",
            },
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            pt: {
              xs: 1,
              sm: 2,
              md: 0,
            },
          }}
        >
          {/* Badge shown at top with distinct gap */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              px: { xs: 1.6, sm: 1.8 },
              py: { xs: 0.7, sm: 0.8 },
              borderRadius: "20px",
              backgroundColor: {
                xs: "rgba(255, 255, 255, 0.88)",
                sm: "transparent",
              },
              border: {
                xs: "1px solid rgba(20, 104, 242, 0.16)",
                sm: "none",
              },
              backdropFilter: { xs: "blur(8px)", sm: "none" },
              WebkitBackdropFilter: { xs: "blur(8px)", sm: "none" },
              width: "fit-content",
              mb: {
                xs: 2.8,
                sm: 2.5,
                md: 2,
              },
            }}
          >
            <Box
              sx={{
                width: { xs: "7px", sm: "7px", md: "8px" },
                height: { xs: "7px", sm: "7px", md: "8px" },
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                boxShadow: "0 0 8px rgba(239, 68, 68, 0.5)",
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
                color: "#475569",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "11px",
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
                xs: "36px",
                sm: "46px",
                md: "56px",
                lg: "60px",
              },
              lineHeight: {
                xs: 1.12,
                sm: 1.08,
                md: 1.06,
              },
              fontWeight: 800,
              letterSpacing: {
                xs: "-1.2px",
                sm: "-1.5px",
                md: "-2px",
              },
              mb: {
                xs: 2.2,
                sm: 2.3,
                md: 2.5,
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

          {/* Subtitle */}
          <Typography
            component="p"
            sx={{
              m: 0,
              mb: {
                xs: 3.2,
                sm: 3.2,
                md: 3.5,
              },
              maxWidth: {
                xs: "100%",
                sm: "510px",
                md: "520px",
              },
              color: "#4A5D8A",
              fontFamily: '"Manrope", sans-serif',
              fontSize: {
                xs: "14.5px",
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
                width: "auto",
                minWidth: {
                  xs: "210px",
                  sm: "210px",
                },
                height: {
                  xs: "48px",
                  sm: "52px",
                },
                px: {
                  xs: 2.5,
                  sm: 3,
                },
                borderRadius: "8px",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "14px",
                  sm: "15px",
                },
                fontWeight: 700,
                letterSpacing: "0.1px",
                lineHeight: 1,
                textTransform: "none",
                color: "#ffffff",
                backgroundColor: "#1769e0",
                boxShadow: "0 7px 20px rgba(23, 105, 224, 0.28)",

                "&:hover": {
                  backgroundColor: "#125bc8",
                  boxShadow: "0 9px 24px rgba(23, 105, 224, 0.35)",
                },

                "& .MuiButton-endIcon": {
                  marginLeft: "10px",
                  "& svg": {
                    fontSize: "22px",
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
                  xs: "185px",
                  sm: "185px",
                },
                height: {
                  xs: "48px",
                  sm: "52px",
                },
                px: {
                  xs: 2.5,
                  sm: 2.5,
                },
                borderRadius: "8px",
                borderColor: {
                  xs: "rgba(216, 224, 238, 0.95)",
                  sm: "#D8E0EE",
                },
                backgroundColor: "rgba(255,255,255,0.92)",
                backdropFilter: { xs: "blur(8px)", sm: "none" },
                WebkitBackdropFilter: { xs: "blur(8px)", sm: "none" },
                color: "#26385E",
                fontFamily: '"Manrope", sans-serif',
                textTransform: "none",
                fontSize: {
                  xs: "14px",
                  sm: "15px",
                },
                fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",

                "&:hover": {
                  borderColor: "#B9C8E5",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                },

                "& .MuiButton-startIcon": {
                  marginRight: "6px",
                  "& svg": {
                    fontSize: "20px",
                    color: "#1769e0",
                  },
                },
              }}
            >
              See How It Works
            </Button>
          </Box>
        </Box>

        {/* Stats Section / Social Proof */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: {
              xs: "space-between",
              sm: "flex-start",
            },
            mt: {
              xs: 3.5,
              sm: 4,
              md: 5,
            },
            width: {
              xs: "100%",
              sm: "fit-content",
            },
            maxWidth: {
              xs: "100%",
              sm: "580px",
            },
            p: {
              xs: "13px 8px",
              sm: "16px 20px",
              md: 0,
            },
            borderRadius: {
              xs: "14px",
              md: 0,
            },
            backgroundColor: {
              xs: "rgba(255, 255, 255, 0.82)",
              md: "transparent",
            },
            backdropFilter: {
              xs: "blur(12px)",
              md: "none",
            },
            WebkitBackdropFilter: {
              xs: "blur(12px)",
              md: "none",
            },
            border: {
              xs: "1px solid rgba(220, 230, 246, 0.9)",
              md: "none",
            },
            boxShadow: {
              xs: "0 8px 24px rgba(15, 30, 80, 0.06)",
              md: "none",
            },
            flexShrink: 0,
          }}
        >
          {/* Stat 1 */}
          <Box
            sx={{
              flex: { xs: 1, sm: "initial" },
              textAlign: { xs: "center", sm: "left" },
              flexShrink: 0,
              px: { xs: 0.5, sm: 0 },
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "#08194D",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "18px",
                  sm: "23px",
                  md: "24px",
                },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
              }}
            >
              1,000+
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "#5C6F96",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "9.5px",
                  sm: "12px",
                  md: "13px",
                },
                fontWeight: 600,
                mt: 0.4,
                letterSpacing: { xs: "-0.2px", sm: "normal" },
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
                xs: "32px",
                sm: "42px",
                md: "45px",
              },
              mx: {
                xs: 0.5,
                sm: 2.5,
                md: 3,
              },
              backgroundColor: "#DCE3EF",
              flexShrink: 0,
            }}
          />

          {/* Stat 2 */}
          <Box
            sx={{
              flex: { xs: 1, sm: "initial" },
              textAlign: { xs: "center", sm: "left" },
              flexShrink: 0,
              px: { xs: 0.5, sm: 0 },
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "#08194D",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "18px",
                  sm: "23px",
                  md: "24px",
                },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
              }}
            >
              4.8/5
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "#5C6F96",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "9.5px",
                  sm: "12px",
                  md: "13px",
                },
                fontWeight: 600,
                mt: 0.4,
                letterSpacing: { xs: "-0.2px", sm: "normal" },
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
                xs: "32px",
                sm: "42px",
                md: "45px",
              },
              mx: {
                xs: 0.5,
                sm: 2.5,
                md: 3,
              },
              backgroundColor: "#DCE3EF",
              flexShrink: 0,
            }}
          />

          {/* Stat 3 */}
          <Box
            sx={{
              flex: { xs: 1, sm: "initial" },
              textAlign: { xs: "center", sm: "left" },
              flexShrink: 0,
              px: { xs: 0.5, sm: 0 },
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "#08194D",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "18px",
                  sm: "23px",
                  md: "24px",
                },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
              }}
            >
              92%
            </Typography>

            <Typography
              component="div"
              sx={{
                color: "#5C6F96",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "9.5px",
                  sm: "12px",
                  md: "13px",
                },
                fontWeight: 600,
                mt: 0.4,
                letterSpacing: { xs: "-0.2px", sm: "normal" },
                whiteSpace: "nowrap",
              }}
            >
              Would Recommend
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;