import React from "react";
import { Box, Typography } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface MediaPermissionCardsProps {
  mediaReady: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;
}

export const MediaPermissionCards: React.FC<MediaPermissionCardsProps> = ({
  mediaReady,
  cameraEnabled,
  micEnabled,
}) => {
  return (
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
            color: mediaReady && cameraEnabled ? "#5ecb8a" : "#7e8796",
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
              <CheckCircleIcon sx={{ fontSize: "11px", color: "#5ecb8a" }} />
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
            color: mediaReady && micEnabled ? "#5ecb8a" : "#7e8796",
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
              <CheckCircleIcon sx={{ fontSize: "11px", color: "#5ecb8a" }} />
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
  );
};

export default MediaPermissionCards;
