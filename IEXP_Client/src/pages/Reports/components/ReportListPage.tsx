import React, { useMemo } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../../../component/specifiedComponent/Dashboard/DashboardNavbar";
import type { InterviewItem } from "../types";
import { ReportSummaryCards } from "./ReportSummaryCards";
import { ReportCard } from "./ReportCard";

interface ReportListPageProps {
  interviews: InterviewItem[];
  loading: boolean;
  error: string;
}

export const ReportListPage: React.FC<ReportListPageProps> = ({
  interviews,
  loading,
  error,
}) => {
  const navigate = useNavigate();

  const completed = useMemo(
    () => interviews.filter((item) => item.status === "Completed" && item.report),
    [interviews]
  );

  const averageScore = useMemo(() => {
    if (!completed.length) return null;

    return Math.round(
      completed.reduce((total, item) => total + (item.score ?? 0), 0) / completed.length
    );
  }, [completed]);

  const bestScore = useMemo(() => {
    if (!completed.length) return null;

    return Math.max(...completed.map((item) => item.score ?? 0));
  }, [completed]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
      }}
    >
      <DashboardNavbar />

      <Box sx={{ px: { xs: 2, md: 8 }, py: { xs: 4, md: 6 } }}>
        <Typography
          sx={{
            fontSize: { xs: "24px", sm: "30px", md: "38px" },
            lineHeight: 1.2,
            fontWeight: 800,
            letterSpacing: { xs: "-0.5px", md: "-1px" },
          }}
        >
          Interview Reports
        </Typography>

        <Typography
          sx={{
            mt: 0.8,
            color: "#7185a3",
            fontSize: { xs: "12px", sm: "14px", md: "15px" },
          }}
        >
          Review your AI-generated performance reports and track your growth.
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && error && (
          <Box
            sx={{
              mt: 3,
              backgroundColor: "#fff",
              border: "1px solid #f0d2d2",
              borderRadius: 3,
              p: 3,
            }}
          >
            <Typography sx={{ color: "#c53b3b", fontWeight: 700 }}>
              {error}
            </Typography>
          </Box>
        )}

        {!loading && !error && (
          <>
            <ReportSummaryCards
              completedCount={completed.length}
              averageScore={averageScore}
              bestScore={bestScore}
            />

            <Box sx={{ mt: 4 }}>
              {completed.length === 0 ? (
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e4e9f1",
                    borderRadius: 3,
                    p: { xs: 4, md: 7 },
                    textAlign: "center",
                  }}
                >
                  <AssessmentOutlinedIcon
                    sx={{ fontSize: { xs: 42, sm: 48, md: 52 }, color: "#9bb1cd" }}
                  />
                  <Typography
                    sx={{
                      mt: 1.5,
                      fontSize: { xs: "18px", sm: "20px", md: "22px" },
                      fontWeight: 800,
                    }}
                  >
                    No reports yet
                  </Typography>
                  <Typography sx={{ mt: 0.8, color: "#790ae" }}>
                    Complete an interview to generate your first AI performance report.
                  </Typography>

                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/interviews")}
                    sx={{
                      mt: 3,
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    Go to Interviews
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {completed.map((item) => (
                    <ReportCard key={item.id} item={item} />
                  ))}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
