import React from "react";
import { Box, Button } from "@mui/material";

interface ModalFooterProps {
  onCancel: () => void;
  onCreate: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ onCancel, onCreate }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "row",
          sm: "row",
        },
        justifyContent: "flex-end",
        gap: {
          xs: "8px",
          sm: "9px",
        },
        pt: {
          xs: "2px",
          sm: "4px",
        },
        width: "100%",
      }}
    >
      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{
          height: {
            xs: "40px",
            sm: "40px",
          },
          minHeight: {
            xs: "40px",
            sm: "40px",
          },
          px: {
            xs: "14px",
            sm: "17px",
          },
          borderRadius: {
            xs: "8px",
            sm: "9px",
          },
          textTransform: "none",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "10.5px",
            sm: "11px",
          },
          fontWeight: 700,
          borderColor: "#dce2ec",
          color: "#697386",
          whiteSpace: "nowrap",
          "&:hover": {
            borderColor: "#c5ccd8",
            backgroundColor: "#f7f9fc",
          },
        }}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={onCreate}
        sx={{
          height: {
            xs: "40px",
            sm: "40px",
          },
          minHeight: {
            xs: "40px",
            sm: "40px",
          },
          px: {
            xs: "15px",
            sm: "18px",
          },
          borderRadius: {
            xs: "8px",
            sm: "9px",
          },
          textTransform: "none",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "10.5px",
            sm: "11px",
          },
          fontWeight: 700,
          boxShadow: "none",
          whiteSpace: "nowrap",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        Create Interview
      </Button>
    </Box>
  );
};

export default ModalFooter;
