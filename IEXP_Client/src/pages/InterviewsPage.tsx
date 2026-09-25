import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../component/specifiedComponent/Dashboard/DashboardNavbar";
import NewInterviewModal from "../component/specifiedComponent/Dashboard/NewInterviewModal";
import {
  useInterviews,
  invalidateInterviews,
  invalidateDashboard,
  type InterviewItem,
} from "../services/apiQueries";

interface NewInterviewData {
  role: string;
  interviewType:
    | "Technical"
    | "Behavioral"
    | "Mixed";
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard";
}

const InterviewsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading: loading, error: queryError } = useInterviews();
  const interviews: InterviewItem[] = data?.interviews || [];
  const error = queryError ? (queryError instanceof Error ? queryError.message : "Failed to load interviews.") : "";
  const [openModal, setOpenModal] = useState(false);

  const handleCreateInterview = async (
    newInterviewData: NewInterviewData
  ) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/interviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newInterviewData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(
          "Create interview error:",
          result.message
        );
        return;
      }

      const interviewId = result.interview?.id;

      if (!interviewId) {
        console.error(
          "Interview ID not found:",
          result
        );
        return;
      }

      invalidateInterviews();
      invalidateDashboard();

      setOpenModal(false);

      navigate(`/interviews/${interviewId}`);
    } catch (createErr) {
      console.error(
        "Create interview error:",
        createErr
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
      }}
    >
   
     <DashboardNavbar/>
      <Box
        sx={{
          px: { xs: 2, md: 8 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 28, md: 36 },
                fontWeight: 800,
                letterSpacing: "-1px",
              }}
            >
              My Interviews
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#7185a3",
                fontSize: 15,
              }}
            >
              Review your practice sessions and continue unfinished interviews.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              py: 1.4,
              fontWeight: 700,
              backgroundColor: "#1677e8",
              boxShadow: "none",
            }}
          >
            New Interview
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          {[
            [String(interviews.length), "Total Interviews"],
            [
              String(
                interviews.filter(
                  (item) => item.status === "Completed"
                ).length
              ),
              "Completed",
            ],
            [
              interviews.filter((item) => item.score !== null).length > 0
                ? `${Math.round(
                    interviews
                      .filter(
                        (item): item is InterviewItem & { score: number } =>
                          item.score !== null
                      )
                      .reduce((sum, item) => sum + item.score, 0) /
                      interviews.filter((item) => item.score !== null).length
                  )}%`
                : "—",
              "Average Score",
            ],
          ].map(([value, label]) => (
            <Box
              key={label}
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e4e9f1",
                borderRadius: "14px",
                p: 2.5,
              }}
            >
              <Typography
                sx={{
                  color: "#7890ae",
                  fontSize: 13,
                }}
              >
                {label}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 27,
                  fontWeight: 800,
                }}
              >
                {value}
              </Typography>
            </Box>
            ))
          }
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {loading ? (
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e4e9f1",
                borderRadius: "14px",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "#7890ae" }}>
                Loading interviews...
              </Typography>
            </Box>
          ) : error ? (
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #f0d0d0",
                borderRadius: "14px",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "#c0392b" }}>
                {error}
              </Typography>
            </Box>
          ) : interviews.length === 0 ? (
            <Box
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e4e9f1",
                borderRadius: "14px",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>
                No interviews yet
              </Typography>
              <Typography sx={{ mt: 0.5, color: "#7890ae", fontSize: 14 }}>
                Start a new interview to see it here.
              </Typography>
            </Box>
          ) : (
            interviews.map((item) => (
            <Box
              key={item.id}
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e4e9f1",
                borderRadius: "14px",
                p: {
                  xs: 2,
                  md: 2.5,
                },
                display: "flex",
                alignItems: {
                  xs: "flex-start",
                  md: "center",
                },
                gap: 2,
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#edf4ff",
                  color: "#1677e8",
                }}
              >
                <AssessmentOutlinedIcon />
              </Avatar>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 750,
                  }}
                >
                  {item.role}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.8,
                    mt: 1,
                  }}
                >
                  <Chip
                    label={item.interviewType}
                    size="small"
                  />

                  <Chip
                    label={item.difficulty}
                    size="small"
                  />

                  <Chip
                    label={
                      item.report?.status === "preparing" ||
                      item.report?.status === "Processing" ||
                      item.reportStatus === "preparing" ||
                      item.reportStatus === "Processing"
                        ? "Report Preparing..."
                        : item.report?.status === "failed" ||
                          item.report?.status === "Failed" ||
                          item.reportStatus === "failed" ||
                          item.reportStatus === "Failed"
                          ? "Report Failed"
                          : item.reportStatus === "NotRequired"
                            ? "Below 50% Threshold"
                            : item.status
                    }
                    size="small"
                    icon={item.status !== "Completed" ? <PlayArrowIcon /> : undefined}
                    sx={{
                      backgroundColor:
                        item.report?.status === "preparing" ||
                        item.report?.status === "Processing" ||
                        item.reportStatus === "preparing" ||
                        item.reportStatus === "Processing"
                          ? "#f0f4ff"
                          : item.report?.status === "failed" ||
                            item.report?.status === "Failed" ||
                            item.reportStatus === "failed" ||
                            item.reportStatus === "Failed"
                            ? "#fff0f0"
                            : item.status === "Completed"
                              ? "#eaf8ef"
                              : "#fff5dc",
                      color:
                        item.report?.status === "preparing" ||
                        item.report?.status === "Processing" ||
                        item.reportStatus === "preparing" ||
                        item.reportStatus === "Processing"
                          ? "#2b66d9"
                          : item.report?.status === "failed" ||
                            item.report?.status === "Failed" ||
                            item.reportStatus === "failed" ||
                            item.reportStatus === "Failed"
                            ? "#c53b3b"
                            : item.status === "Completed"
                              ? "#26834a"
                              : "#a06a00",
                      fontWeight: 700,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 1.2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#7890ae",
                      fontSize: 12,
                    }}
                  >
                    {item.questionCount} questions
                  </Typography>

                  <Typography
                    sx={{
                      color: "#7890ae",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                    }}
                  >
                    <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />
                    {item.durationMinutes !== null ? `${item.durationMinutes} min` : "—"}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#7890ae",
                      fontSize: 12,
                    }}
                  >
                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {item.score !== null && (
                  <Box
                    sx={{
                      textAlign: "right",
                      mr: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#1677e8",
                      }}
                    >
                      {item.score}%
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#7890ae",
                      }}
                    >
                      Score
                    </Typography>
                  </Box>
                )}

                <Button
                  variant={
                    item.status === "Completed"
                      ? "outlined"
                      : "contained"
                  }
                  startIcon={
                    item.status === "Completed" ? (
                      <AssessmentOutlinedIcon />
                    ) : (
                      <PlayArrowIcon />
                    )
                  }
                  onClick={() =>
                    navigate(
                      item.status === "Completed"
                        ? `/reports/${item.id}`
                        : `/interviews/${item.id}`
                    )
                  }
                  sx={{
                    textTransform: "none",
                    borderRadius: "9px",
                    fontWeight: 700,
                    boxShadow: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.status === "Completed"
                    ? (item.report?.status === "preparing" || item.reportStatus === "preparing"
                        ? "View Progress"
                        : "View Report")
                    : "Continue"}
                </Button>

                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Box>
            </Box>
            ))
          )}
        </Box>
      </Box>

      <NewInterviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateInterview}
      />
    </Box>
  );
};

export default InterviewsPage;
