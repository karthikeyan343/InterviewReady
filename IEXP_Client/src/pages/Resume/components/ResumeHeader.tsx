import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

interface ResumeHeaderProps {
  uploading: boolean;
  hasResume: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerUpload: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
  uploading,
  hasResume,
  fileInputRef,
  onTriggerUpload,
  onUpload,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: {
          xs: "stretch",
          sm: "center",
        },
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        gap: {
          xs: 2.5,
          sm: 2,
        },
        mb: {
          xs: 3,
          sm: 4,
        },
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          width: {
            xs: "100%",
            sm: "auto",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "26px",
              sm: "30px",
              md: "36px",
            },
            lineHeight: {
              xs: 1.2,
              sm: 1.2,
            },
            fontWeight: 800,
            letterSpacing: {
              xs: "-0.6px",
              md: "-1px",
            },
            color: "#172b4d",
            overflowWrap: "break-word",
          }}
        >
          My Resume
        </Typography>

        <Typography
          sx={{
            mt: {
              xs: 0.8,
              sm: 1,
            },
            color: "#7185a3",
            fontFamily: '"Manrope", sans-serif',
            fontSize: {
              xs: "13px",
              sm: "14px",
              md: "15px",
            },
            lineHeight: 1.55,
            maxWidth: {
              xs: "100%",
              sm: "520px",
            },
          }}
        >
          Upload your resume and keep it ready for your interviews.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<CloudUploadOutlinedIcon />}
        onClick={onTriggerUpload}
        disabled={uploading}
        fullWidth={false}
        sx={{
          width: {
            xs: "100%",
            sm: "auto",
          },
          minHeight: {
            xs: "46px",
            sm: "48px",
          },
          px: {
            xs: 2,
            sm: 2.5,
          },
          py: {
            xs: 1.15,
            sm: 1.4,
          },
          borderRadius: "10px",
          textTransform: "none",
          fontFamily: '"Manrope", sans-serif',
          fontSize: {
            xs: "13px",
            sm: "14px",
          },
          fontWeight: 700,
          backgroundColor: "#1677e8",
          boxShadow: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
          "&:hover": {
            backgroundColor: "#1269d2",
            boxShadow: "none",
          },
        }}
      >
        {uploading
          ? "Validating resume..."
          : hasResume
          ? "Replace Resume"
          : "Upload Resume"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        hidden
        onChange={onUpload}
      />
    </Box>
  );
};
export default ResumeHeader;
