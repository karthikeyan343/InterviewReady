import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import LogoutIcon from "@mui/icons-material/Logout";
import CallEndIcon from "@mui/icons-material/CallEnd";

interface InterviewBottomControlsProps {
  micEnabled: boolean;
  cameraEnabled: boolean;
  speakerEnabled: boolean;
  isCompletingInterview: boolean;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
  onLeaveInterview: () => void;
  onEndInterview: () => void;
}

export const InterviewBottomControls: React.FC<InterviewBottomControlsProps> = ({
  micEnabled,
  cameraEnabled,
  speakerEnabled,
  isCompletingInterview,
  onToggleMic,
  onToggleCamera,
  onToggleSpeaker,
  onLeaveInterview,
  onEndInterview,
}) => {
  return (
    <Box
      sx={{
        minHeight: {
          xs: "auto",
          sm: "68px",
        },
        px: { xs: "8px", sm: "18px" },
        py: { xs: "8px", sm: "10px" },
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        borderTop: "1px solid #242830",
        backgroundColor: "#17191e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingBottom: {
          xs: "calc(8px + env(safe-area-inset-bottom, 0px))",
          sm: "10px",
        },
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: {
            xs: "grid",
            sm: "flex",
          },
          gridTemplateColumns: {
            xs: "repeat(4, minmax(0, 1fr))",
            sm: "none",
          },
          rowGap: {
            xs: "6px",
            sm: "0px",
          },
          columnGap: {
            xs: "6px",
            sm: "0px",
          },
          gap: {
            sm: "12px",
          },
          alignItems: "center",
          width: {
            xs: "100%",
            sm: "auto",
          },
          maxWidth: "100%",
          boxSizing: "border-box",
          minWidth: 0,
          justifyContent: "center",
        }}
      >
        {/* Mic Toggle */}
        <IconButton
          onClick={onToggleMic}
          aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
          sx={{
            gridColumn: { xs: "1", sm: "auto" },
            width: { xs: "100%", sm: "44px" },
            height: { xs: "40px", sm: "44px" },
            minWidth: 0,
            borderRadius: { xs: "9px", sm: "50%" },
            backgroundColor: micEnabled ? "#252932" : "#a8323e",
            color: "#ffffff",
            border: "1px solid",
            borderColor: micEnabled ? "#343944" : "#b83a47",
            "&:hover": {
              backgroundColor: micEnabled ? "#2f3440" : "#b83a47",
            },
          }}
        >
          {micEnabled ? (
            <MicIcon sx={{ fontSize: "19px" }} />
          ) : (
            <MicOffIcon sx={{ fontSize: "19px" }} />
          )}
        </IconButton>

        {/* Camera Toggle */}
        <IconButton
          onClick={onToggleCamera}
          aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
          sx={{
            gridColumn: { xs: "2", sm: "auto" },
            width: { xs: "100%", sm: "44px" },
            height: { xs: "40px", sm: "44px" },
            minWidth: 0,
            borderRadius: { xs: "9px", sm: "50%" },
            backgroundColor: cameraEnabled ? "#252932" : "#a8323e",
            color: "#ffffff",
            border: "1px solid",
            borderColor: cameraEnabled ? "#343944" : "#b83a47",
            "&:hover": {
              backgroundColor: cameraEnabled ? "#2f3440" : "#b83a47",
            },
          }}
        >
          {cameraEnabled ? (
            <VideocamIcon sx={{ fontSize: "19px" }} />
          ) : (
            <VideocamOffIcon sx={{ fontSize: "19px" }} />
          )}
        </IconButton>

        {/* Speaker Toggle */}
        <IconButton
          onClick={onToggleSpeaker}
          aria-label={speakerEnabled ? "Mute speaker" : "Unmute speaker"}
          sx={{
            gridColumn: { xs: "3", sm: "auto" },
            width: { xs: "100%", sm: "44px" },
            height: { xs: "40px", sm: "44px" },
            minWidth: 0,
            borderRadius: { xs: "9px", sm: "50%" },
            backgroundColor: "#252932",
            color: "#ffffff",
            border: "1px solid #343944",
            "&:hover": {
              backgroundColor: "#2f3440",
            },
          }}
        >
          {speakerEnabled ? (
            <VolumeUpIcon sx={{ fontSize: "19px" }} />
          ) : (
            <VolumeOffIcon sx={{ fontSize: "19px" }} />
          )}
        </IconButton>

        {/* More Actions */}
        <IconButton
          aria-label="More options"
          sx={{
            gridColumn: { xs: "4", sm: "auto" },
            width: { xs: "100%", sm: "44px" },
            height: { xs: "40px", sm: "44px" },
            minWidth: 0,
            borderRadius: { xs: "9px", sm: "50%" },
            backgroundColor: "#252932",
            color: "#ffffff",
            border: "1px solid #343944",
            "&:hover": {
              backgroundColor: "#2f3440",
            },
          }}
        >
          <MoreHorizIcon sx={{ fontSize: "20px" }} />
        </IconButton>

        {/* Leave Interview Button */}
        <Button
          onClick={onLeaveInterview}
          disabled={isCompletingInterview}
          startIcon={
            <LogoutIcon
              sx={{
                fontSize: "17px !important",
              }}
            />
          }
          sx={{
            gridColumn: { xs: "span 2", sm: "auto" },
            width: { xs: "100%", sm: "auto" },
            height: { xs: "40px", sm: "44px" },
            minWidth: 0,
            px: { xs: "8px", sm: "16px" },
            ml: { xs: "0px", sm: "6px" },
            borderRadius: "9px",
            backgroundColor: "#252932",
            color: "#dce0e8",
            border: "1px solid #343944",
            textTransform: "none",
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "12px", sm: "12px" },
            fontWeight: 700,
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: "#2f3440",
              borderColor: "#404654",
              color: "#ffffff",
            },
          }}
        >
          Leave Interview
        </Button>

        {/* End Interview Button */}
        <Button
          onClick={onEndInterview}
          disabled={isCompletingInterview}
          startIcon={
            <CallEndIcon
              sx={{
                fontSize: "17px !important",
              }}
            />
          }
          sx={{
            gridColumn: { xs: "span 2", sm: "auto" },
            width: { xs: "100%", sm: "auto" },
            height: { xs: "40px", sm: "44px" },
            minWidth: 0,
            px: { xs: "8px", sm: "18px" },
            ml: { xs: "0px", sm: "6px" },
            borderRadius: "9px",
            backgroundColor: "#c53b48",
            color: "#ffffff",
            textTransform: "none",
            fontFamily: '"Manrope", sans-serif',
            fontSize: { xs: "12px", sm: "12px" },
            fontWeight: 800,
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(197, 59, 72, 0.3)",
            "&:hover": {
              backgroundColor: "#ad303c",
              boxShadow: "0 4px 12px rgba(197, 59, 72, 0.4)",
            },
          }}
        >
          End
        </Button>
      </Box>

      <Typography
        sx={{
          position: "absolute",
          right: "20px",
          display: {
            xs: "none",
            lg: "block",
          },
          fontSize: "10px",
          color: "#626a77",
          fontWeight: 600,
        }}
      >
        InterviewReady AI
      </Typography>
    </Box>
  );
};

