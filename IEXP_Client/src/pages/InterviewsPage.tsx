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
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Completed" | "Left">("All");

  const totalInterviewsCount = interviews.length;
  const completedInterviewsCount = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const validReportInterviews = interviews.filter(
    (item): item is InterviewItem & { score: number } =>
      item.status === "Completed" &&
      typeof item.score === "number" &&
      (item.reportStatus === "Completed" ||
        item.report?.status === "ready" ||
        item.report?.status === "Completed")
  );

  const averageScoreDisplay =
    validReportInterviews.length > 0
      ? `${Math.round(
          validReportInterviews.reduce((sum, item) => sum + item.score, 0) /
            validReportInterviews.length
        )}%`
      : "—";

  const filteredInterviews = interviews
    .filter((item) => {
      if (selectedFilter === "All") {
        return item.status === "Completed" || item.status === "Left";
      }
      if (selectedFilter === "Completed") {
        return item.status === "Completed";
      }
      if (selectedFilter === "Left") {
        return item.status === "Left";
      }
      return false;
    })
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });

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
            [String(totalInterviewsCount), "Total Interviews"],
            [String(completedInterviewsCount), "Completed"],
            [averageScoreDisplay, "Average Score"],
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

        {/* Filter Controls: [ All ] [ Completed ] [ Left ] */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2.5,
          }}
        >
          {(["All", "Completed", "Left"] as const).map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <Button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 2.2,
                  py: 0.7,
                  fontSize: 13,
                  fontWeight: isSelected ? 700 : 600,
                  backgroundColor: isSelected ? "#1677e8" : "#ffffff",
                  color: isSelected ? "#ffffff" : "#52627f",
                  border: isSelected ? "1px solid #1677e8" : "1px solid #e4e9f1",
                  boxShadow: isSelected ? "0 2px 6px rgba(22, 119, 232, 0.2)" : "none",
                  "&:hover": {
                    backgroundColor: isSelected ? "#1264c7" : "#f4f7fc",
                    borderColor: isSelected ? "#1264c7" : "#d0d7e2",
                  },
                }}
              >
                {filter}
              </Button>
            );
          })}
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
          ) : filteredInterviews.length === 0 ? (
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
                {selectedFilter === "Left"
                  ? "No left interviews"
                  : selectedFilter === "Completed"
                    ? "No completed interviews"
                    : "No interviews yet"}
              </Typography>
              <Typography sx={{ mt: 0.5, color: "#7890ae", fontSize: 14 }}>
                {selectedFilter === "Left"
                  ? "Interviews you leave temporarily will appear here so you can continue them."
                  : selectedFilter === "Completed"
                    ? "Completed interviews with their reports will appear here."
                    : "Start a new interview to see it here."}
              </Typography>
            </Box>
          ) : (
            filteredInterviews.map((item) => {
              const hasValidReport =
                item.status === "Completed" &&
                (item.reportStatus === "Completed" ||
                  item.report?.status === "ready" ||
                  item.report?.status === "Completed");

              const isReportProcessing =
                item.status === "Completed" &&
                (item.reportStatus === "Processing" ||
                  item.report?.status === "preparing" ||
                  item.reportStatus === "preparing");

              const isReportFailed =
                item.status === "Completed" &&
                (item.reportStatus === "Failed" ||
                  item.report?.status === "failed");

              return (
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
                          item.status === "Left"
                            ? "Left"
                            : isReportProcessing
                              ? "Report Preparing..."
                              : isReportFailed
                                ? "Report Failed"
                                : item.reportStatus === "NotRequired"
                                  ? "Below 50% Threshold"
                                  : item.status
                        }
                        size="small"
                        icon={item.status !== "Completed" ? <PlayArrowIcon /> : undefined}
                        sx={{
                          backgroundColor:
                            item.status === "Left"
                              ? "#fff5dc"
                              : isReportProcessing
                                ? "#f0f4ff"
                                : isReportFailed
                                  ? "#fff0f0"
                                  : item.reportStatus === "NotRequired"
                                    ? "#f5f6f8"
                                    : item.status === "Completed"
                                      ? "#eaf8ef"
                                      : "#fff5dc",
                          color:
                            item.status === "Left"
                              ? "#a06a00"
                              : isReportProcessing
                                ? "#2b66d9"
                                : isReportFailed
                                  ? "#c53b3b"
                                  : item.reportStatus === "NotRequired"
                                    ? "#6b7280"
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
                        {new Date(item.updatedAt || item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
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
                    {hasValidReport && item.score !== null && (
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

                    {item.status === "Left" ? (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => navigate(`/interviews/${item.id}`)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "9px",
                          fontWeight: 700,
                          boxShadow: "none",
                          whiteSpace: "nowrap",
                          backgroundColor: "#1677e8",
                        }}
                      >
                        Continue
                      </Button>
                    ) : item.status === "Completed" ? (
                      hasValidReport ? (
                        <Button
                          variant="outlined"
                          startIcon={<AssessmentOutlinedIcon />}
                          onClick={() => navigate(`/reports/${item.id}`)}
                          sx={{
                            textTransform: "none",
                            borderRadius: "9px",
                            fontWeight: 700,
                            boxShadow: "none",
                            whiteSpace: "nowrap",
                            borderColor: "#1677e8",
                            color: "#1677e8",
                            "&:hover": {
                              borderColor: "#1264c7",
                              backgroundColor: "#f4f8fe",
                            },
                          }}
                        >
                          View Report
                        </Button>
                      ) : isReportProcessing ? (
                        <Button
                          variant="outlined"
                          disabled
                          startIcon={<AssessmentOutlinedIcon />}
                          sx={{
                            textTransform: "none",
                            borderRadius: "9px",
                            fontWeight: 700,
                            boxShadow: "none",
                            whiteSpace: "nowrap",
                            borderColor: "#d0d7e2",
                            color: "#64748b !important",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          Report Processing
                        </Button>
                      ) : isReportFailed ? (
                        <Button
                          variant="outlined"
                          startIcon={<AssessmentOutlinedIcon />}
                          onClick={() => navigate(`/reports/${item.id}`)}
                          sx={{
                            textTransform: "none",
                            borderRadius: "9px",
                            fontWeight: 700,
                            boxShadow: "none",
                            whiteSpace: "nowrap",
                            borderColor: "#ef4444",
                            color: "#ef4444",
                            "&:hover": {
                              borderColor: "#dc2626",
                              backgroundColor: "#fef2f2",
                            },
                          }}
                        >
                          Report Failed
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          disabled
                          sx={{
                            textTransform: "none",
                            borderRadius: "9px",
                            fontWeight: 700,
                            boxShadow: "none",
                            whiteSpace: "nowrap",
                            borderColor: "#e4e9f1",
                            color: "#94a3b8 !important",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          Report Not Required
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => navigate(`/interviews/${item.id}`)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "9px",
                          fontWeight: 700,
                          boxShadow: "none",
                          whiteSpace: "nowrap",
                          backgroundColor: "#1677e8",
                        }}
                      >
                        Continue
                      </Button>
                    )}

                    <IconButton>
                      <MoreHorizIcon />
                    </IconButton>
                  </Box>
                </Box>
              );
            })
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
