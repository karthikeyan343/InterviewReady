import React from "react";
import { Box, Typography } from "@mui/material";
import DashboardNavbar from "../../component/specifiedComponent/Dashboard/DashboardNavbar";
import { useResumeUpload } from "./hooks/useResumeUpload";
import ResumeHeader from "./components/ResumeHeader";
import ResumeAlerts from "./components/ResumeAlerts";
import ResumeCard from "./components/ResumeCard";
import ResumeEmptyState from "./components/ResumeEmptyState";

export const ResumePage: React.FC = () => {
  const {
    fileInputRef,
    resume,
    loading,
    uploading,
    viewing,
    error,
    message,
    refetch,
    handleUpload,
    handleViewResume,
    triggerFileInput,
  } = useResumeUpload();

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
        fontFamily: '"Manrope", sans-serif',
        overflowX: "clip",
        boxSizing: "border-box",
      }}
    >
      <DashboardNavbar />

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: "1250px",
          mx: "auto",
          px: {
            xs: "14px",
            sm: "20px",
            md: "40px",
            lg: "48px",
          },
          py: {
            xs: "24px",
            sm: "32px",
            md: "48px",
          },
          boxSizing: "border-box",
        }}
      >
        <ResumeHeader
          uploading={uploading}
          hasResume={Boolean(resume)}
          fileInputRef={fileInputRef}
          onTriggerUpload={triggerFileInput}
          onUpload={handleUpload}
        />

        <ResumeAlerts message={message} error={error} />

        {loading ? (
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
                xs: 3,
                sm: 5,
              },
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            <Typography
              sx={{
                color: "#7890ae",
                fontFamily: '"Manrope", sans-serif',
                fontSize: {
                  xs: "13px",
                  sm: "14px",
                },
              }}
            >
              Loading resume...
            </Typography>
          </Box>
        ) : resume ? (
          <ResumeCard
            resume={resume}
            viewing={viewing}
            loading={loading}
            onViewResume={handleViewResume}
            onRefresh={() => void refetch()}
          />
        ) : (
          <ResumeEmptyState
            uploading={uploading}
            onTriggerUpload={triggerFileInput}
          />
        )}
      </Box>
    </Box>
  );
};

export default ResumePage;
