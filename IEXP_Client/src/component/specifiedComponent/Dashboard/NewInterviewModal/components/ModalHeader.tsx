import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ModalHeaderProps {
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: {
          xs: "18px",
          sm: "24px",
        },
        gap: "12px",
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          id="new-interview-modal-title"
          sx={{
            fontSize: {
              xs: "18px",
              sm: "20px",
            },
            lineHeight: {
              xs: 1.25,
              sm: 1.3,
            },
            fontWeight: 800,
            color: "#172033",
            wordBreak: "break-word",
          }}
        >
          Create New Interview
        </Typography>

        <Typography
          sx={{
            fontSize: {
              xs: "11px",
              sm: "12px",
            },
            lineHeight: 1.5,
            fontWeight: 500,
            color: "#7a8497",
            mt: {
              xs: "4px",
              sm: "5px",
            },
          }}
        >
          Set up your interview preferences
        </Typography>
      </Box>

      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{
          width: {
            xs: "32px",
            sm: "34px",
          },
          height: {
            xs: "32px",
            sm: "34px",
          },
          minWidth: {
            xs: "32px",
            sm: "34px",
          },
          minHeight: {
            xs: "32px",
            sm: "34px",
          },
          flexShrink: 0,
          color: "#7a8497",
          borderRadius: "9px",
          "&:hover": {
            backgroundColor: "#f5f7fb",
          },
          "&:active": {
            backgroundColor: "#eef2f8",
          },
        }}
      >
        <CloseIcon
          sx={{
            fontSize: {
              xs: "18px",
              sm: "19px",
            },
          }}
        />
      </IconButton>
    </Box>
  );
};

export default ModalHeader;
