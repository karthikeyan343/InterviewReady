import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

interface ResumeEmptyStateProps {
  uploading: boolean;
  onTriggerUpload: () => void;
}

export const ResumeEmptyState: React.FC<ResumeEmptyStateProps> = ({
  uploading,
  onTriggerUpload,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#fff",
        border: "1px solid #e4e9f1",
        borderRadius: {
          xs: "14px",
          sm: "16px",
        },
        p: {
          xs: "28px 18px",
          sm: 4,
          md: 6,
        },
        textAlign: "center",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Avatar
        sx={{
          width: {
            xs: 62,
            sm: 72,
          },
          height: {
            xs: 62,
            sm: 72,
          },
          mx: "auto",
          mb: 2,
          backgroundColor: "#edf4ff",
          color: "#1677e8",
        }}
      >
        <CloudUploadOutlinedIcon
          sx={{
            fontSize: {
              xs: 29,
              sm: 34,
            },
          }}
        />
      </Avatar>

      <Typography
        sx={{
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "18px",
            sm: "20px",
          },
          lineHeight: 1.3,
          fontWeight: 800,
          color: "#172b4d",
        }}
      >
        No resume uploaded
      </Typography>

      <Typography
        sx={{
          mt: 1,
          color: "#7890ae",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "12px",
            sm: "14px",
          },
          lineHeight: 1.6,
          maxWidth: "520px",
          mx: "auto",
        }}
      >
        Upload your latest resume in PDF or DOCX format. Your resume
        will be processed and stored securely for use during your
        interview preparation.
      </Typography>

      <Button
        variant="contained"
        startIcon={<CloudUploadOutlinedIcon />}
        onClick={onTriggerUpload}
        disabled={uploading}
        sx={{
          width: {
            xs: "100%",
            sm: "auto",
          },
          mt: 3,
          minHeight: "44px",
          textTransform: "none",
          borderRadius: "10px",
          px: 2.5,
          py: 1.3,
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "13px",
            sm: "14px",
          },
          fontWeight: 700,
          backgroundColor: "#1677e8",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "#1269d2",
            boxShadow: "none",
          },
        }}
      >
        {uploading ? "Validating resume..." : "Upload Resume"}
      </Button>

      <Typography
        sx={{
          mt: 1.5,
          color: "#9aabc0",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "11px",
            sm: "12px",
          },
        }}
      >
        Supported formats: PDF, DOCX
      </Typography>
    </Box>
  );
};
export default ResumeEmptyState;
