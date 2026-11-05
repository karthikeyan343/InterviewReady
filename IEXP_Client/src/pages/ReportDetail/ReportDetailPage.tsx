import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../../component/specifiedComponent/Dashboard/DashboardNavbar";
import { useInterviewReport, retryReportGeneration } from "../../services/apiQueries";
import type { InterviewReport } from "../../services/apiQueries";
import { ReportNotRequiredState } from "./components/ReportNotRequiredState";
import { ReportProcessingState } from "./components/ReportProcessingState";
import { ReportFailedState } from "./components/ReportFailedState";
import { ReportErrorState } from "./components/ReportErrorState";
import { ReportHeaderCard } from "./components/ReportHeaderCard";
import { ReportFeedbackCards } from "./components/ReportFeedbackCards";

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  const { data, isLoading: loading, error: queryError } = useInterviewReport(id);
  const report: InterviewReport | null = data?.report ?? null;
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to load report."
    : "";

  const handleRetry = async () => {
    if (!id || retrying) return;
    setRetrying(true);
    setRetryError(null);
    try {
      await retryReportGeneration(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to retry report generation.";
      setRetryError(msg);
    } finally {
      setRetrying(false);
    }
  };

  const backToReportsBtn = (
    <Button
      onClick={() => navigate("/reports")}
      startIcon={<ArrowBackIcon sx={{ fontSize: "18px" }} />}
      sx={{
        textTransform: "none",
        color: "#536887",
        fontFamily: '"Manrope", sans-serif',
        fontWeight: 700,
        fontSize: { xs: "13px", sm: "14px" },
        px: { xs: "12px", sm: "16px" },
        py: "6px",
        borderRadius: "10px",
        border: "1px solid #DCE6F6",
        backgroundColor: "#FFFFFF",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          backgroundColor: "#EEF5FF",
          borderColor: "rgba(20, 104, 242, 0.25)",
          color: "#1468F2",
        },
      }}
    >
      Back to Reports
    </Button>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
        }}
      >
        <DashboardNavbar hideNavLinks rightAction={backToReportsBtn} />
        <Box
          sx={{
            minHeight: "calc(100vh - 72px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  // Report Not Required State (< 50% questions answered)
  if (report && report.status === "NotRequired") {
    return <ReportNotRequiredState rightAction={backToReportsBtn} />;
  }

  // Report Preparing / Processing State
  if (report && (report.status === "preparing" || report.status === "Processing")) {
    return <ReportProcessingState rightAction={backToReportsBtn} />;
  }

  // Report Failed State
  if (report && (report.status === "failed" || report.status === "Failed")) {
    return (
      <ReportFailedState
        rightAction={backToReportsBtn}
        errorMessage={report.errorMessage || report.summary}
        retryError={retryError}
        retrying={retrying}
        onRetry={handleRetry}
      />
    );
  }

  if (error || !report) {
    return <ReportErrorState rightAction={backToReportsBtn} error={error} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
      }}
    >
      <DashboardNavbar hideNavLinks rightAction={backToReportsBtn} />

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        <ReportHeaderCard report={report} />
        <ReportFeedbackCards report={report} />
      </Box>
    </Box>
  );
};

export default ReportDetailPage;
