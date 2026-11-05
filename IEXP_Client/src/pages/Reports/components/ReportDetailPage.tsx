import React, { useMemo } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../../../component/specifiedComponent/Dashboard/DashboardNavbar";
import { useInterviewReport } from "../../../services/apiQueries";
import type { InterviewItem } from "../types";
import { DetailHeader } from "./DetailHeader";
import { ScoreOverviewCard } from "./ScoreOverviewCard";
import { FeedbackSections } from "./FeedbackSections";
import { SummaryCard } from "./SummaryCard";

interface ReportDetailPageProps {
  interviews: InterviewItem[];
  interviewsLoading: boolean;
  interviewsError: string;
}

export const ReportDetailPage: React.FC<ReportDetailPageProps> = ({
  interviews,
  interviewsLoading,
  interviewsError,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: reportResponse, isLoading: loading, error: queryError } = useInterviewReport(id);
  const report = reportResponse?.report ?? null;
  const error = queryError ? (queryError instanceof Error ? queryError.message : "Failed to fetch interview report.") : "";

  const interview = useMemo(
    () => interviews.find((item) => item.id === id) ?? null,
    [interviews, id]
  );

  if (loading || interviewsLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
        }}
      >
        <DashboardNavbar />
        <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error || interviewsError || !report || !interview) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
        }}
      >
        <DashboardNavbar />

        <Box sx={{ px: { xs: 2, md: 8 }, py: 7 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/reports")}
            sx={{
              textTransform: "none",
              color: "#536887",
            }}
          >
            Back to Reports
          </Button>

          <Box
            sx={{
              mt: 3,
              backgroundColor: "#fff",
              border: "1px solid #f0d2d2",
              borderRadius: 3,
              p: 4,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "20px", md: "22px" },
                fontWeight: 800,
                color: "#172b4d",
              }}
            >
              Unable to load report
            </Typography>

            <Typography sx={{ mt: 1, color: "#7185a3" }}>
              {error || interviewsError || "Report data is unavailable."}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
      }}
    >
      <DashboardNavbar />

      <Box sx={{ px: { xs: 2, md: 8 }, py: { xs: 3, md: 5 } }}>
        <DetailHeader />

        <ScoreOverviewCard report={report} interview={interview} />

        <FeedbackSections
          strengths={report.strengths}
          weaknesses={report.weaknesses}
          suggestions={report.suggestions}
        />

        <SummaryCard summary={report.summary} createdAt={report.createdAt} />
      </Box>
    </Box>
  );
};
