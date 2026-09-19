import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { useNavigate } from "react-router-dom";

interface RecentInterview {
  id: string;
  role: string;
  interviewType: "Technical" | "Behavioral" | "Mixed";
  difficulty: "Easy" | "Medium" | "Hard";
  status:
    | "Not Started"
    | "In Progress"
    | "Completed"
    | "Abandoned";
  createdAt: string;
  score: number | null;
}

interface DashboardResponse {
  recentInterviews: RecentInterview[];
}

const RecentInterviews: React.FC = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState<
    RecentInterview[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentInterviews = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/interviews/dashboard`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch recent interviews"
          );
        }

        const result: DashboardResponse =
          await response.json();

        setInterviews(result.recentInterviews ?? []);
      } catch (error) {
        console.error(
          "Recent interviews error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentInterviews();
  }, []);

  const getStatusStyle = (
    status: RecentInterview["status"]
  ) => {
    switch (status) {
      case "Completed":
        return {
          backgroundColor: "#edf8f1",
          color: "#21874b",
        };

      case "In Progress":
        return {
          backgroundColor: "#fff5e8",
          color: "#b86b00",
        };

      case "Not Started":
        return {
          backgroundColor: "#f1f5ff",
          color: "#356ae6",
        };

      case "Abandoned":
        return {
          backgroundColor: "#fff0f0",
          color: "#c54444",
        };

      default:
        return {
          backgroundColor: "#f1f3f6",
          color: "#687386",
        };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8ebf1",
          borderRadius: "14px",
          p: "24px",
          minHeight: "250px",
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
        overflow: "hidden",
      }}
    >

      <Box
        sx={{
          px: {
            xs: "18px",
            md: "24px",
          },
          py: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #edf0f4",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 800,
              color: "#172033",
            }}
          >
            Recent Interviews
          </Typography>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#7a8497",
              mt: "4px",
            }}
          >
            Your latest practice sessions
          </Typography>
        </Box>

        {interviews.length > 0 && (
          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/interviews")}
            sx={{
              textTransform: "none",
              fontFamily: '"Manrope", sans-serif',
              fontSize: "12px",
              fontWeight: 700,
              color: "#356ae6",
              minWidth: "auto",
              px: "8px",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            View All
          </Button>
        )}
      </Box>
      {interviews.length === 0 ? (
        <Box
          sx={{
            minHeight: "230px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: "20px",
          }}
        >
          <Box>
            <Box
              sx={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#f1f5ff",
                color: "#356ae6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: "14px",
              }}
            >
              <HistoryOutlinedIcon
                sx={{
                  fontSize: "24px",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              No interviews yet
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#7a8497",
                mt: "6px",
                mb: "16px",
              }}
            >
              Start your first interview practice
              session.
            </Typography>

            <Button
              variant="contained"
              onClick={() => navigate("/interviews")}
              sx={{
                height: "38px",
                px: "16px",
                borderRadius: "9px",
                textTransform: "none",
                fontFamily: '"Manrope", sans-serif',
                fontSize: "12px",
                fontWeight: 700,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              Start Interview
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {interviews.map((interview, index) => {
            const statusStyle = getStatusStyle(
              interview.status
            );

            return (
              <Box
                key={interview.id}
                sx={{
                  px: {
                    xs: "18px",
                    md: "24px",
                  },
                  py: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  borderBottom:
                    index !== interviews.length - 1
                      ? "1px solid #edf0f4"
                      : "none",
                  cursor: "pointer",
                  transition:
                    "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#fafbfc",
                  },
                }}
                onClick={() =>
                  navigate(
                    `/interviews/${interview.id}`
                  )
                }
              >
                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#172033",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {interview.role}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "6px",
                      mt: "5px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#7a8497",
                      }}
                    >
                      {interview.interviewType}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#c1c6cf",
                      }}
                    >
                      •
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#7a8497",
                      }}
                    >
                      {interview.difficulty}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "11px",
                        color: "#c1c6cf",
                      }}
                    >
                      •
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#929aaa",
                      }}
                    >
                      {formatDate(
                        interview.createdAt
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    px: "9px",
                    py: "5px",
                    borderRadius: "7px",
                    backgroundColor:
                      statusStyle.backgroundColor,
                    color: statusStyle.color,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 700,
                    }}
                  >
                    {interview.status}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "52px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color:
                        interview.score !== null
                          ? "#172033"
                          : "#a0a7b3",
                    }}
                  >
                    {interview.score !== null
                      ? `${interview.score}%`
                      : "--"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default RecentInterviews;