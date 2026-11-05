import React from "react";
import { Box, Button, Typography } from "@mui/material";

interface ResumeEmptyViewProps {
  uploading: boolean;
  onUploadClick: () => void;
}

export const ResumeEmptyView: React.FC<ResumeEmptyViewProps> = ({
  uploading,
  onUploadClick,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        gap: "16px",
        flex: 1,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            color: "#172033",
          }}
        >
          No resume uploaded
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 500,
            color: "#7a8497",
            mt: "5px",
          }}
        >
          Upload your resume to start AI-powered interviews.
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onUploadClick}
        disabled={uploading}
        sx={{
          flexShrink: 0,
          height: "38px",
          px: "14px",
          borderRadius: "9px",
          textTransform: "none",
          fontFamily: '"Manrope", sans-serif',
          fontSize: "11px",
          fontWeight: 700,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        }}
      >
        {uploading ? "Validating resume..." : "Upload Resume"}
      </Button>
    </Box>
  );
};

export default ResumeEmptyView;
