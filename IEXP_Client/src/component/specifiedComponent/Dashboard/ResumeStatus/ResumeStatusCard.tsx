import React from "react";
import { Box, Typography } from "@mui/material";
import { useResumeStatus } from "./hooks/useResumeStatus";
import ResumeStatusHeader from "./components/ResumeStatusHeader";
import ResumeActiveView from "./components/ResumeActiveView";
import ResumeEmptyView from "./components/ResumeEmptyView";

export const ResumeStatusCard: React.FC = () => {
  const {
    fileInputRef,
    resume,
    loading,
    uploading,
    error,
    formatDate,
    handleUploadClick,
    handleViewResume,
    handleFileChange,
  } = useResumeStatus();

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8ebf1",
          borderRadius: "14px",
          p: "24px",
          minHeight: "190px",
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        border: "1px solid #e8ebf1",
        borderRadius: "14px",
        p: {
          xs: "20px",
          md: "24px",
        },
        minHeight: "190px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleFileChange}
        style={{
          display: "none",
        }}
      />

      <ResumeStatusHeader hasResume={Boolean(resume)} />

      {error && (
        <Box
          sx={{
            backgroundColor: "#fff1f1",
            border: "1px solid #ffd6d6",
            borderRadius: "8px",
            px: "10px",
            py: "8px",
            mb: "14px",
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#c54444",
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      {resume ? (
        <ResumeActiveView
          originalFileName={resume.originalFileName}
          uploadedAt={resume.uploadedAt}
          uploading={uploading}
          formatDate={formatDate}
          onViewResume={handleViewResume}
          onUploadClick={handleUploadClick}
        />
      ) : (
        <ResumeEmptyView
          uploading={uploading}
          onUploadClick={handleUploadClick}
        />
      )}
    </Box>
  );
};

export default ResumeStatusCard;
