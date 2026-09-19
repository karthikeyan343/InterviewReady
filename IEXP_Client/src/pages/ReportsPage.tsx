import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";

import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/Schedule";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "../component/specifiedComponent/Dashboard/DashboardNavbar";

interface InterviewItem {
  id: string;
  role: string;
  interviewType: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
  createdAt: string;
  startedAt?: string | null;
  endedAt?: string | null;
  questionCount: number;
  durationMinutes: number | null;
  score: number | null;
  report: {
    id: string;
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
  } | null;
}

interface InterviewReport {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (value?: string | null) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const getScoreLabel = (score: number) => {
  if (score >= 85) return "Excellent Performance";
  if (score >= 70) return "Good Performance";
  if (score >= 50) return "Needs Improvement";
  return "Keep Practicing";
};

const getScoreMessage = (score: number) => {
  if (score >= 85) {
    return "You demonstrated strong knowledge and communication throughout the interview.";
  }

  if (score >= 70) {
    return "You performed well overall. Keep practicing to improve consistency and answer depth.";
  }

  if (score >= 50) {
    return "You have a solid starting point. Focus on the weaker areas identified below.";
  }

  return "Use this report as a guide and keep practicing with focused preparation.";
};

const getDifficultyStyle = (difficulty: string) => {
  if (difficulty === "Hard") {
    return {
      backgroundColor: "#fff0f0",
      color: "#c53b3b",
    };
  }

  if (difficulty === "Medium") {
    return {
      backgroundColor: "#fff7e6",
      color: "#b66b00",
    };
  }

  return {
    backgroundColor: "#edf7f0",
    color: "#2e7d4f",
  };
};


const ScoreBar: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#f7f9fc",
        border: "1px solid #edf0f5",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ color: "#1677e8", display: "flex" }}>{icon}</Box>
          <Typography
            sx={{
              fontSize: { xs: "11px", sm: "12px", md: "13px" },
              color: "#5f7392",
              lineHeight: 1.4,
            }}
          >
            {label}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "13px", md: "14px" },
            fontWeight: 800,
            color: "#172b4d",
            whiteSpace: "nowrap",
          }}
        >
          {value}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 7,
          borderRadius: 10,
          backgroundColor: "#e5ebf3",
          "& .MuiLinearProgress-bar": {
            borderRadius: 10,
            backgroundColor: "#1677e8",
          },
        }}
      />
    </Box>
  );
};

const ReportListPage: React.FC<{
  interviews: InterviewItem[];
  loading: boolean;
  error: string;
}> = ({ interviews, loading, error }) => {
  const navigate = useNavigate();

  const completed = useMemo(
    () =>
      interviews.filter(
        (item) => item.status === "Completed" && item.report
      ),
    [interviews]
  );

  const averageScore = useMemo(() => {
    if (!completed.length) return null;

    return Math.round(
      completed.reduce(
        (total, item) => total + (item.score ?? 0),
        0
      ) / completed.length
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
      <DashboardNavbar/>

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
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
              border: "1px solid #f0d2d2",
              color: "#b23b3b",
            }}
          >
            <Typography sx={{ fontWeight: 700 }}>{error}</Typography>
          </Box>
        )}

        {!loading && !error && (
          <>
            <Box
              sx={{
                mt: 4,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                },
                gap: 2,
              }}
            >
              {[
                {
                  label: "Reports Generated",
                  value: completed.length,
                  icon: <AssessmentOutlinedIcon />,
                },
                {
                  label: "Average Score",
                  value: averageScore !== null ? `${averageScore}%` : "—",
                  icon: <TrendingUpIcon />,
                },
                {
                  label: "Best Score",
                  value: bestScore !== null ? `${bestScore}%` : "—",
                  icon: <AssessmentOutlinedIcon />,
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    backgroundColor: "#fff",
                    border: "1px solid #e4e9f1",
                    borderRadius: "14px",
                    p: 2.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      backgroundColor: "#edf4ff",
                      color: "#1677e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Box>
                    <Typography sx={{ color: "#7890ae", fontSize: { xs: "11px", sm: "12px", md: "13px" } }}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.3,
                        fontSize: { xs: "20px", sm: "23px", md: "27px" },
                        fontWeight: 800,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

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
                  <Typography sx={{ mt: 0.8, color: "#7890ae" }}>
                    Complete an interview to generate your first AI performance
                    report.
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
                  {completed.map((item) => {
                    const difficultyStyle = getDifficultyStyle(
                      item.difficulty
                    );

                    return (
                      <Box
                        key={item.id}
                        sx={{
                          backgroundColor: "#fff",
                          border: "1px solid #e4e9f1",
                          borderRadius: 3,
                          p: { xs: 2, md: 3 },
                          transition: "0.2s ease",
                          "&:hover": {
                            borderColor: "#cbdcf5",
                            boxShadow: "0 8px 28px rgba(34, 74, 130, 0.07)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: { xs: "flex-start", md: "center" },
                            gap: 2,
                            flexDirection: { xs: "column", md: "row" },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 50,
                                height: 50,
                                backgroundColor: "#edf4ff",
                                color: "#1677e8",
                              }}
                            >
                              <AssessmentOutlinedIcon />
                            </Avatar>

                            <Box>
                              <Typography
                                sx={{
                                  fontSize: { xs: "14px", sm: "15px", md: "17px" },
                                  fontWeight: 800,
                                }}
                              >
                                {item.role}
                              </Typography>

                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                  gap: 1,
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#7890ae",
                                    fontSize: { xs: "10px", sm: "11px", md: "12px" },
                                  }}
                                >
                                  {item.interviewType}
                                </Typography>

                                <Box
                                  sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: "50%",
                                    backgroundColor: "#aab8c9",
                                  }}
                                />

                                <Box
                                  sx={{
                                    px: 1,
                                    py: 0.35,
                                    borderRadius: 5,
                                    fontSize: { xs: "10px", sm: "11px" },
                                    fontWeight: 700,
                                    ...difficultyStyle,
                                  }}
                                >
                                  {item.difficulty}
                                </Box>

                                <Typography
                                  sx={{
                                    color: "#7890ae",
                                    fontSize: { xs: "10px", sm: "11px", md: "12px" },
                                  }}
                                >
                                  {formatDate(item.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              width: { xs: "100%", md: "auto" },
                              justifyContent: {
                                xs: "space-between",
                                md: "flex-end",
                              },
                            }}
                          >
                            <Box sx={{ textAlign: "right" }}>
                              <Typography
                                sx={{
                                  fontSize: { xs: "20px", sm: "23px", md: "27px" },
                                  fontWeight: 800,
                                  color: "#1677e8",
                                  lineHeight: 1,
                                }}
                              >
                                {item.score ?? 0}%
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#7890ae",
                                  fontSize: { xs: "10px", sm: "11px" },
                                  mt: 0.4,
                                }}
                              >
                                Overall score
                              </Typography>
                            </Box>

                            <Button
                              variant="outlined"
                              endIcon={<ArrowForwardIcon />}
                              onClick={() =>
                                navigate(`/reports/${item.id}`)
                              }
                              sx={{
                                textTransform: "none",
                                borderRadius: 1.5,
                                fontWeight: 700,
                              }}
                            >
                              View Report
                            </Button>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            mt: 3,
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              sm: "repeat(3, 1fr)",
                            },
                            gap: 1.5,
                          }}
                        >
                          <ScoreBar
                            label="Technical"
                            value={item.report?.technicalScore ?? 0}
                            icon={<CodeOutlinedIcon fontSize="small" />}
                          />
                          <ScoreBar
                            label="Communication"
                            value={item.report?.communicationScore ?? 0}
                            icon={
                              <RecordVoiceOverOutlinedIcon fontSize="small" />
                            }
                          />
                          <ScoreBar
                            label="Problem Solving"
                            value={item.report?.problemSolvingScore ?? 0}
                            icon={
                              <PsychologyOutlinedIcon fontSize="small" />
                            }
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

const ReportDetailPage: React.FC<{
  interviews: InterviewItem[];
  interviewsLoading: boolean;
  interviewsError: string;
}> = ({ interviews, interviewsLoading, interviewsError }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const interview = useMemo(
    () => interviews.find((item) => item.id === id) ?? null,
    [interviews, id]
  );

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) {
        setError("Interview ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(`/api/interviews/${id}/report`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch interview report.");
        }

        setReport(data.report);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch interview report."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading || interviewsLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
        }}
      >
        <DashboardNavbar/>
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
        <DashboardNavbar/>

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

  const score = report.overallScore;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
      }}
    >
       <DashboardNavbar/>

      <Box sx={{ px: { xs: 2, md: 8 }, py: { xs: 3, md: 5 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/reports")}
          sx={{
            textTransform: "none",
            color: "#536887",
            px: 0,
          }}
        >
          Back to Reports
        </Button>

        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: "24px", sm: "30px", md: "38px" },
                lineHeight: 1.2,
                fontWeight: 800,
                letterSpacing: { xs: "-0.5px", md: "-1px" },
              }}
            >
              Interview Report
            </Typography>

            <Typography
              sx={{
                mt: 0.7,
                color: "#7185a3",
                fontSize: { xs: "12px", sm: "14px", md: "15px" },
              }}
            >
              Here&apos;s your performance summary. Keep practicing to improve.
            </Typography>
          </Box>

          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/interviews")}
            sx={{
              textTransform: "none",
              borderRadius: 1.7,
              px: 2.5,
              py: 1.2,
              fontWeight: 700,
            }}
          >
            Try Another Interview
          </Button>
        </Box>

        <Box
          sx={{
            mt: 4,
            backgroundColor: "#fff",
            border: "1px solid #e3e9f2",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: { xs: 2.5, md: 4 },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1.35fr 1fr",
              },
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, md: 3 },
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: `conic-gradient(#1677e8 ${score * 3.6}deg, #e8eef6 0deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 122,
                    height: 122,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "28px", sm: "31px", md: "34px" },
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    {score}%
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.7,
                      color: "#7890ae",
                      fontSize: { xs: "10px", sm: "11px", md: "12px" },
                    }}
                  >
                    Overall Score
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "18px", sm: "21px", md: "24px" },
                    fontWeight: 800,
                  }}
                >
                  {getScoreLabel(score)}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "#7185a3",
                    lineHeight: { xs: 1.55, sm: 1.65, md: 1.7 },
                    fontSize: { xs: "12px", sm: "13px", md: "14px" },
                    maxWidth: 560,
                  }}
                >
                  {getScoreMessage(score)}
                </Typography>

                <Box
                  sx={{
                    mt: 2.5,
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(2, 1fr)",
                      sm: "repeat(3, 1fr)",
                    },
                    gap: 1,
                  }}
                >
                  {[
                    ["Questions", interview.questionCount],
                    ["Duration", interview.durationMinutes ? `${interview.durationMinutes} min` : "—"],
                    ["Difficulty", interview.difficulty],
                  ].map(([label, value]) => (
                    <Box
                      key={label}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        backgroundColor: "#f7f9fc",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: "15px", sm: "17px", md: "18px" },
                          fontWeight: 800,
                        }}
                      >
                        {value}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.3,
                          fontSize: { xs: "10px", sm: "11px" },
                          color: "#7890ae",
                        }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                borderLeft: { lg: "1px solid #e6ebf2" },
                pl: { lg: 4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {[
                {
                  label: "Role",
                  value: interview.role,
                  icon: <AssessmentOutlinedIcon />,
                },
                {
                  label: "Interview Type",
                  value: interview.interviewType,
                  icon: <RecordVoiceOverOutlinedIcon />,
                },
                {
                  label: "Difficulty Level",
                  value: interview.difficulty,
                  icon: <TrendingUpIcon />,
                },
                {
                  label: "Date",
                  value: formatDateTime(interview.createdAt),
                  icon: <CalendarMonthOutlinedIcon />,
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      backgroundColor: "#edf4ff",
                      color: "#1677e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "10px", sm: "11px" },
                        color: "#7890ae",
                      }}
                    >
                      {item.label}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,
                        fontSize: { xs: "12px", sm: "13px", md: "14px" },
                        fontWeight: 700,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Divider />

          <Box
            sx={{
              p: { xs: 2.5, md: 4 },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <ScoreBar
              label="Technical"
              value={report.technicalScore}
              icon={<CodeOutlinedIcon />}
            />
            <ScoreBar
              label="Communication"
              value={report.communicationScore}
              icon={<RecordVoiceOverOutlinedIcon />}
            />
            <ScoreBar
              label="Problem Solving"
              value={report.problemSolvingScore}
              icon={<PsychologyOutlinedIcon />}
            />
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e3e9f2",
              borderRadius: 3,
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: "#edf8f1",
                  color: "#2e8b57",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
               <CodeOutlinedIcon/>   
              </Box>

              <Box>
                <Typography sx={{ fontSize: { xs: "16px", sm: "18px", md: "19px" }, fontWeight: 800 }}>
                  Strengths
                </Typography>
                <Typography sx={{ fontSize: { xs: "10px", sm: "11px", md: "12px" }, color: "#7890ae" }}>
                  What you did well
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 1.2 }}>
              {report.strengths.length ? (
                report.strengths.map((strength, index) => (
                  <Box
                    key={`${strength}-${index}`}
                    sx={{
                      p: 1.7,
                      borderRadius: 1.8,
                      backgroundColor: "#f6fbf8",
                      border: "1px solid #e3f1e8",
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: "12px", sm: "13px", md: "14px" }, lineHeight: 1.55 }}>
                      {strength}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "#7890ae", fontSize: { xs: "12px", sm: "13px", md: "14px" } }}>
                  No strengths were provided in this report.
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e3e9f2",
              borderRadius: 3,
              p: { xs: 2.5, md: 3 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  backgroundColor: "#fff5e8",
                  color: "#c27619",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WarningAmberOutlinedIcon />
              </Box>

              <Box>
                <Typography sx={{ fontSize: { xs: "16px", sm: "18px", md: "19px" }, fontWeight: 800 }}>
                  Areas to Improve
                </Typography>
                <Typography sx={{ fontSize: { xs: "10px", sm: "11px", md: "12px" }, color: "#7890ae" }}>
                  Focus areas from your interview
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2.5, display: "flex", flexDirection: "column", gap: 1.2 }}>
              {report.weaknesses.length ? (
                report.weaknesses.map((weakness, index) => (
                  <Box
                    key={`${weakness}-${index}`}
                    sx={{
                      p: 1.7,
                      borderRadius: 1.8,
                      backgroundColor: "#fffaf3",
                      border: "1px solid #f3e5d1",
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: "12px", sm: "13px", md: "14px" }, lineHeight: 1.55 }}>
                      {weakness}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "#7890ae", fontSize: { xs: "12px", sm: "13px", md: "14px" } }}>
                  No improvement areas were provided in this report.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            border: "1px solid #e3e9f2",
            borderRadius: 3,
            p: { xs: 2.5, md: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                backgroundColor: "#f1edff",
                color: "#6651c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LightbulbOutlinedIcon />
            </Box>

            <Box>
              <Typography sx={{ fontSize: { xs: "16px", sm: "18px", md: "19px" }, fontWeight: 800 }}>
                Suggestions for Improvement
              </Typography>
              <Typography sx={{ fontSize: { xs: "10px", sm: "11px", md: "12px" }, color: "#7890ae" }}>
                Actionable guidance from your AI interviewer
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2.5,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 1.5,
            }}
          >
            {report.suggestions.length ? (
              report.suggestions.map((suggestion, index) => (
                <Box
                  key={`${suggestion}-${index}`}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f8f7fd",
                    border: "1px solid #ece9f8",
                    display: "flex",
                    gap: 1.3,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#6651c7",
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: { xs: "12px", sm: "13px", md: "14px" },
                      lineHeight: 1.6,
                    }}
                  >
                    {suggestion}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "#7890ae", fontSize: { xs: "12px", sm: "13px", md: "14px" } }}>
                No suggestions were provided in this report.
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            border: "1px solid #e3e9f2",
            borderRadius: 3,
            p: { xs: 2.5, md: 3 },
          }}
        >
          <Typography sx={{ fontSize: { xs: "16px", sm: "18px", md: "19px" }, fontWeight: 800 }}>
            AI Summary
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#5f7392",
              lineHeight: { xs: 1.65, sm: 1.75, md: 1.8 },
              fontSize: { xs: "12px", sm: "13px", md: "14px" },
            }}
          >
            {report.summary || "No summary was provided in this report."}
          </Typography>

          <Divider sx={{ my: 2.5 }} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#7890ae",
            }}
          >
            <ScheduleOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: { xs: "10px", sm: "11px", md: "12px" } }}>
              Report generated {formatDateTime(report.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const ReportsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interviews, setInterviews] = useState<InterviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

const response = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/interviews`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch interview reports."
          );
        }

        setInterviews(data.interviews ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch interview reports."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (id) {
    return (
      <ReportDetailPage
        interviews={interviews}
        interviewsLoading={loading}
        interviewsError={error}
      />
    );
  }

  return (
    <ReportListPage
      interviews={interviews}
      loading={loading}
      error={error}
    />
  );
};

export default ReportsPage;
