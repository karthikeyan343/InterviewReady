import React from "react";
import { Box, Typography } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTime } from "../utils";

interface InterviewTopBarProps {
  idleProcessingNotice?: string;
  reconnecting: boolean;
  reconnectNotice?: string;
  elapsedSeconds: number;
}

export const InterviewTopBar: React.FC<InterviewTopBarProps> = ({
  idleProcessingNotice,
  reconnecting,
  reconnectNotice,
  elapsedSeconds,
}) => {
  return (
    <>
      {/* 20-Second Idle Warning Notification Banner */}
      {idleProcessingNotice && !reconnecting && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: "10px", sm: "16px" },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: {
              xs: "calc(100% - 20px)",
              sm: "auto",
            },
            maxWidth: {
              xs: "calc(100% - 20px)",
              sm: "640px",
            },
            backgroundColor: "#202329",
            border: "1px solid #e69b35",
            borderRadius: "10px",
            px: { xs: "12px", sm: "18px" },
            py: { xs: "9px", sm: "11px" },
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 32px rgba(0,0,0,0.65)",
          }}
        >
          <Box
            sx={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#e69b35",
              flexShrink: 0,
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.3 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.3 },
              },
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "11px", sm: "12px" },
              lineHeight: 1.4,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {idleProcessingNotice}
          </Typography>
        </Box>
      )}

      {/* High Demand / Reconnecting Notification */}
      {reconnecting && (
        <Box
          sx={{
            position: "fixed",
            top: { xs: "10px", sm: "16px" },
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: {
              xs: "calc(100% - 20px)",
              sm: "auto",
            },
            maxWidth: {
              xs: "calc(100% - 20px)",
              sm: "640px",
            },
            backgroundColor: "#202329",
            border: "1px solid #356ae6",
            borderRadius: "10px",
            px: { xs: "12px", sm: "18px" },
            py: { xs: "9px", sm: "11px" },
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 32px rgba(0,0,0,0.65)",
          }}
        >
          <Box
            sx={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#356ae6",
              flexShrink: 0,
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.3 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.3 },
              },
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "11px", sm: "12px" },
              lineHeight: 1.4,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {reconnectNotice ||
              "Gemini is experiencing high demand. Please wait while we reconnect/resume your interview."}
          </Typography>
        </Box>
      )}

      {/* Top Header */}
      <Box
        sx={{
          height: {
            xs: "48px",
            sm: "56px",
          },
          minHeight: {
            xs: "48px",
            sm: "56px",
          },
          px: {
            xs: "12px",
            sm: "20px",
            md: "24px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #242830",
          backgroundColor: "#17191e",
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "8px", sm: "10px" },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: { xs: "30px", sm: "34px" },
              height: { xs: "30px", sm: "34px" },
              flexShrink: 0,
              borderRadius: "8px",
              backgroundColor: "#356ae6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SmartToyIcon sx={{ fontSize: { xs: "16px", sm: "18px" } }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 800,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              AI Interview
            </Typography>

            <Typography
              sx={{
                fontSize: "9px",
                color: "#7f8794",
                whiteSpace: "nowrap",
              }}
            >
              Live session
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: "8px",
              sm: "16px",
            },
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
            }}
          >
            <SignalCellularAltIcon
              sx={{
                fontSize: "14px",
                color: "#5ecb8a",
              }}
            />

            <Typography
              sx={{
                fontSize: "10px",
                color: "#9aa1ad",
                fontWeight: 600,
              }}
            >
              Good connection
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              px: { xs: "8px", sm: "10px" },
              py: "4px",
              borderRadius: "6px",
              backgroundColor: "#22252c",
              border: "1px solid #2d313b",
              whiteSpace: "nowrap",
            }}
          >
            <AccessTimeIcon
              sx={{
                fontSize: "12px",
                color: "#9aa1ad",
              }}
            />

            <Typography
              sx={{
                fontSize: { xs: "11px", sm: "12px" },
                fontWeight: 700,
                color: "#ffffff",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTime(elapsedSeconds)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

