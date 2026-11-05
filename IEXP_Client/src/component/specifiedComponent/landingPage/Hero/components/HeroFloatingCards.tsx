import React from "react";
import { Box, Typography } from "@mui/material";
import {
  ChatBubbleOutlined,
  DescriptionOutlined,
  TrendingUp,
  ChevronRight,
  Mic,
  CallEnd,
  Videocam,
} from "@mui/icons-material";

export const HeroFloatingCards: React.FC = () => {
  return (
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
  );
};
