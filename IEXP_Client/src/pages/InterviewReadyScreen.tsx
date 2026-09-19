import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export interface InterviewReadyScreenProps {
  id?: string;
  loading: boolean;
  mediaReady: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;
  mediaError: string;
  error: string;
  onStart: () => void;
  onBack: () => void;
}

const InterviewReadyScreen: React.FC<InterviewReadyScreenProps> = ({
  id,
  loading,
  mediaReady,
  cameraEnabled,
  micEnabled,
  mediaError,
  error,
  onStart,
  onBack,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        backgroundColor: "#111318",
        color: "#ffffff",
        fontFamily:
          '"Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: "12px", sm: "24px" },
        py: { xs: "16px", sm: "32px" },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: "560px", md: "620px" },
          backgroundColor: "#1b1e24",
          border: "1px solid #282c35",
          borderRadius: { xs: "14px", sm: "18px" },
          overflow: "hidden",
          boxShadow: "0 16px 45px rgba(0, 0, 0, 0.55)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Header */}
        <Box
          sx={{
            px: { xs: "14px", sm: "24px" },
            py: { xs: "12px", sm: "16px" },
            borderBottom: "1px solid #262a32",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: "32px", sm: "34px" },
                height: { xs: "32px", sm: "34px" },
                borderRadius: "8px",
                backgroundColor: "#356ae6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SmartToyIcon
                sx={{
                  fontSize: { xs: "17px", sm: "19px" },
                  color: "#ffffff",
                }}
              />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "13px" },
                  fontWeight: 800,
                  color: "#ffffff",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                InterviewReady
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: "9px", sm: "10px" },
                  color: "#858b98",
                  mt: "1px",
                  whiteSpace: "nowrap",
                }}
              >
                AI Interview Room
              </Typography>
            </Box>
          </Box>

          {id && (
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: "10px",
                color: "#7e8796",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
              title={id}
            >
              ID: {id}
            </Typography>
          )}
        </Box>

        {/* Card Body */}
        <Box
          sx={{
            p: {
              xs: "16px 14px",
              sm: "24px 24px",
              md: "28px 28px",
            },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "20px",
                sm: "24px",
                md: "26px",
              },
              fontWeight: 800,
              color: "#ffffff",
              mb: { xs: "6px", sm: "8px" },
              lineHeight: 1.2,
            }}
          >
            Ready to start?
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "12.5px" },
              lineHeight: 1.6,
              color: "#858b98",
              mb: { xs: "16px", sm: "22px" },
            }}
          >
            Your interview will be conducted as a live voice conversation with
            your AI interviewer. Verify your camera and microphone status below
            before joining.
          </Typography>

          {/* Media Permission Cards - Side by side on both mobile & desktop */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: { xs: "10px", sm: "12px" },
              mb: { xs: "16px", sm: "20px" },
            }}
          >
            {/* Camera Card */}
            <Box
              sx={{
                height: { xs: "100px", sm: "115px" },
                borderRadius: "12px",
                backgroundColor: "#111318",
                border: "1px solid",
                borderColor:
                  mediaReady && cameraEnabled
                    ? "rgba(94, 203, 138, 0.45)"
                    : "#282c35",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: "10px",
                transition: "border-color 0.2s ease",
              }}
            >
              <VideocamIcon
                sx={{
                  fontSize: { xs: "24px", sm: "26px" },
                  color:
                    mediaReady && cameraEnabled ? "#5ecb8a" : "#7e8796",
                  mb: "4px",
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: "11px", sm: "12px" },
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Camera
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  mt: "2px",
                }}
              >
                {mediaReady && cameraEnabled ? (
                  <>
                    <CheckCircleIcon
                      sx={{ fontSize: "11px", color: "#5ecb8a" }}
                    />
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "#5ecb8a",
                        fontWeight: 600,
                      }}
                    >
                      Connected
                    </Typography>
                  </>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "#858b98",
                    }}
                  >
                    Required
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Microphone Card */}
            <Box
              sx={{
                height: { xs: "100px", sm: "115px" },
                borderRadius: "12px",
                backgroundColor: "#111318",
                border: "1px solid",
                borderColor:
                  mediaReady && micEnabled
                    ? "rgba(94, 203, 138, 0.45)"
                    : "#282c35",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: "10px",
                transition: "border-color 0.2s ease",
              }}
            >
              <MicIcon
                sx={{
                  fontSize: { xs: "24px", sm: "26px" },
                  color:
                    mediaReady && micEnabled ? "#5ecb8a" : "#7e8796",
                  mb: "4px",
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: "11px", sm: "12px" },
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                Microphone
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  mt: "2px",
                }}
              >
                {mediaReady && micEnabled ? (
                  <>
                    <CheckCircleIcon
                      sx={{ fontSize: "11px", color: "#5ecb8a" }}
                    />
                    <Typography
                      sx={{
                        fontSize: "10px",
                        color: "#5ecb8a",
                        fontWeight: 600,
                      }}
                    >
                      Connected
                    </Typography>
                  </>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: "#858b98",
                    }}
                  >
                    Required
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Media Error Notice */}
          {mediaError && (
            <Box
              sx={{
                backgroundColor: "#351d20",
                border: "1px solid #633238",
                borderRadius: "9px",
                px: "12px",
                py: "9px",
                mb: "12px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#ff9ca5",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {mediaError}
              </Typography>
            </Box>
          )}

          {/* General Error Notice */}
          {error && (
            <Box
              sx={{
                backgroundColor: "#351d20",
                border: "1px solid #633238",
                borderRadius: "9px",
                px: "12px",
                py: "9px",
                mb: "12px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#ff9ca5",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {error}
              </Typography>
            </Box>
          )}

          {/* Bottom Actions */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: { xs: "stretch", sm: "flex-end" },
              gap: { xs: "8px", sm: "10px" },
              mt: "4px",
            }}
          >
            <Button
              variant="contained"
              onClick={onStart}
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: "17px !important" }} />
                )
              }
              sx={{
                order: { xs: 1, sm: 2 },
                height: { xs: "44px", sm: "40px" },
                px: "22px",
                borderRadius: "9px",
                textTransform: "none",
                fontFamily: '"Manrope", sans-serif',
                fontSize: { xs: "12.5px", sm: "12px" },
                fontWeight: 800,
                backgroundColor: "#356ae6",
                boxShadow: "none",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  backgroundColor: "#2f5fd0",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? "Joining Interview..." : "Join Interview"}
            </Button>

            <Button
              onClick={onBack}
              disabled={loading}
              startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
              sx={{
                order: { xs: 2, sm: 1 },
                height: { xs: "40px", sm: "40px" },
                px: "16px",
                borderRadius: "9px",
                textTransform: "none",
                fontFamily: '"Manrope", sans-serif',
                fontSize: "12px",
                fontWeight: 700,
                color: "#9aa1ad",
                border: "1px solid #30343d",
                width: { xs: "100%", sm: "auto" },
                "&:hover": {
                  borderColor: "#444b57",
                  backgroundColor: "rgba(255,255,255,0.04)",
                },
              }}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InterviewReadyScreen;
