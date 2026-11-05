import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import logo from "../../../../../../assets/LogoIR.png";

interface DrawerHeaderProps {
  onClose: () => void;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ onClose }) => {
  return (
    <>
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2.5, sm: 3 },
          pt: { xs: 2.5, sm: 3 },
          pb: 2,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="InterviewReady"
          sx={{
            height: { xs: "50px", sm: "54px" },
            width: "auto",
            display: "block",
          }}
        />

        <IconButton
          onClick={onClose}
          aria-label="Close navigation menu"
          sx={{
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            backgroundColor: "#EFF4FC",
            border: "1px solid rgba(215, 226, 245, 0.7)",
            color: "#2C3E5A",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:hover": {
              backgroundColor: "#E2EBF9",
              transform: "scale(1.04)",
            },
            "&:active": {
              transform: "scale(0.96)",
            },
            "&:focus-visible": {
              outline: "2px solid #1468F2",
              outlineOffset: "2px",
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: "21px" }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          height: "1px",
          backgroundColor: "#EEF2F8",
          mx: { xs: 2.5, sm: 3 },
          mb: 2,
          flexShrink: 0,
        }}
      />
    </>
  );
};

export default DrawerHeader;
