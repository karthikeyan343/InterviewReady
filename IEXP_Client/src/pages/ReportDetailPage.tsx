import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate, useParams } from "react-router-dom";
import { useInterviewReport, retryReportGeneration, type InterviewReport } from "../services/apiQueries";

const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  const { data, isLoading: loading, error: queryError } = useInterviewReport(id);
  const report: InterviewReport | null = data?.report ?? null;
  const error = queryError ? (queryError instanceof Error ? queryError.message : "Failed to load report.") : "";

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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
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
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
          px: { xs: 2, md: 8 },
          py: 5,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{
            textTransform: "none",
            color: "#536887",
            mb: 2,
          }}
        >
          Back to Dashboard
        </Button>

        <Box
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            border: "1px solid #e2e8f4",
            borderRadius: 3,
            p: 4,
            maxWidth: "600px",
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 800,
              color: "#172b4d",
            }}
          >
            Report Not Generated
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#7185a3",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            This interview was completed before answering at least 50% of the questions. A performance report was not generated.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{
              mt: 3,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  // Report Preparing / Processing State
  if (report && (report.status === "preparing" || report.status === "Processing")) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
          px: { xs: 2, md: 8 },
          py: 5,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{
            textTransform: "none",
            color: "#536887",
            mb: 2,
          }}
        >
          Back to Dashboard
        </Button>

        <Box
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            border: "1px solid #e2e8f4",
            borderRadius: 3,
            p: { xs: 3, md: 6 },
            textAlign: "center",
            maxWidth: "680px",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#edf4ff",
              color: "#1677e8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <HourglassEmptyIcon sx={{ fontSize: 28 }} />
          </Box>

          <Typography
            sx={{
              fontSize: { xs: 20, md: 24 },
              fontWeight: 800,
              color: "#172b4d",
              mb: 1,
            }}
          >
            Your performance report is being prepared
          </Typography>

          <Typography
            sx={{
              color: "#7185a3",
              fontSize: 14,
              lineHeight: 1.6,
              maxWidth: 480,
              mx: "auto",
              mb: 3,
            }}
          >
            Gemini is analyzing your responses and generating detailed feedback. This typically takes 10–20 seconds.
          </Typography>

          <LinearProgress
            sx={{
              height: 6,
              borderRadius: 4,
              maxWidth: 320,
              mx: "auto",
              mb: 3,
            }}
          />

          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard")}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              color: "#1677e8",
            }}
          >
            Return to Dashboard
          </Button>
        </Box>
      </Box>
    );
  }

  // Report Failed State
  if (report && (report.status === "failed" || report.status === "Failed")) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
          px: { xs: 2, md: 8 },
          py: 5,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          sx={{
            textTransform: "none",
            color: "#536887",
            mb: 2,
          }}
        >
          Back to Dashboard
        </Button>

        <Box
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            border: "1px solid #f0d2d2",
            borderRadius: 3,
            p: 4,
            maxWidth: "600px",
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 800,
              color: "#c53b3b",
            }}
          >
            Your performance report could not be generated
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#7185a3",
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            {report.errorMessage || report.summary || "Gemini experienced an issue while analyzing the interview session. You can retry report generation without losing your interview."}
          </Typography>

          {retryError && (
            <Typography
              sx={{
                mt: 1.5,
                color: "#c53b3b",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {retryError}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              onClick={handleRetry}
              disabled={retrying}
              startIcon={retrying ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
                fontWeight: 700,
                backgroundColor: "#1677e8",
              }}
            >
              {retrying ? "Retrying..." : "Retry Report Generation"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/dashboard")}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#536887",
                borderColor: "#d0d7e2",
              }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f8fc",
          px: { xs: 2, md: 8 },
          py: 5,
        }}
      >
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
              fontSize: 22,
              fontWeight: 800,
              color: "#172b4d",
            }}
          >
            Unable to load report
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#7185a3",
            }}
          >
            {error || "Report data is unavailable."}
          </Typography>
        </Box>
      </Box>
    );
  }

  const scoreItems = [
    {
      label: "Technical",
      score: report.technicalScore,
      icon: <CodeOutlinedIcon />,
    },
    {
      label: "Communication",
      score: report.communicationScore,
      icon: <RecordVoiceOverOutlinedIcon />,
    },
    {
      label: "Problem Solving",
      score: report.problemSolvingScore,
      icon: <PsychologyOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
      }}
    >
      
      <Box
        component="header"
        sx={{
          height: 76,
          px: { xs: 2, md: 8 },
          backgroundColor: "#fff",
          borderBottom: "1px solid #e5e9f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          onClick={() => navigate("/dashboard")}
          sx={{
            fontSize: { xs: 21, md: 27 },
            fontWeight: 800,
            letterSpacing: "-1px",
            color: "#172b4d",
            cursor: "pointer",
          }}
        >
          Interview
          <span style={{ color: "#1677e8" }}>Ready</span>
        </Typography>

        <Button
          onClick={() => navigate("/reports")}
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            color: "#536887",
          }}
        >
          Back to Reports
        </Button>
      </Box>

      
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
        }}
      >
        
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e3e9f2",
            borderRadius: 3,
            p: { xs: 2.5, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 24, md: 30 },
                  fontWeight: 800,
                  color: "#172b4d",
                }}
              >
                Interview Performance Report
              </Typography>

              <Typography
                sx={{
                  mt: 0.8,
                  color: "#7185a3",
                  fontSize: 14,
                }}
              >
                AI-generated analysis of your interview performance
              </Typography>
            </Box>

            <Box
              sx={{
                textAlign: "center",
                minWidth: 130,
              }}
            >
              <Typography
                sx={{
                  fontSize: 46,
                  lineHeight: 1,
                  fontWeight: 800,
                  color: "#1677e8",
                }}
              >
                {report.overallScore}%
              </Typography>

              <Typography
                sx={{
                  mt: 0.7,
                  color: "#7185a3",
                  fontSize: 13,
                }}
              >
                Overall Score
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {scoreItems.map((item) => (
              <Box
                key={item.label}
                sx={{
                  backgroundColor: "#f7f9fc",
                  border: "1px solid #e4eaf2",
                  borderRadius: 2.5,
                  p: 2.2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      color: "#1677e8",
                    }}
                  >
                    {item.icon}

                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "#536887",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: "#172b4d",
                    }}
                  >
                    {item.score}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={item.score}
                  sx={{
                    mt: 2,
                    height: 7,
                    borderRadius: 5,
                    backgroundColor: "#e3eaf3",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      backgroundColor: "#1677e8",
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        
        <Box
          sx={{
            mt: 2.5,
            backgroundColor: "#fff",
            border: "1px solid #e3e9f2",
            borderRadius: 3,
            p: { xs: 2.5, md: 3 },
          }}
        >
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            AI Summary
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#5f7392",
              lineHeight: 1.8,
              fontSize: 14,
            }}
          >
            {report.summary || "No summary was provided."}
          </Typography>
        </Box>

        
        <Box
          sx={{
            mt: 2.5,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 2.5,
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
                gap: 1,
              }}
            >
              <CheckCircleOutlineIcon
                sx={{
                  color: "#1677e8",
                }}
              />

              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 800,
                }}
              >
                Strengths
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              {report.strengths?.length > 0 ? (
                report.strengths.map((strength, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1.2,
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#1677e8",
                        fontWeight: 800,
                      }}
                    >
                      •
                    </Typography>

                    <Typography
                      sx={{
                        color: "#5f7392",
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      {strength}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    color: "#7185a3",
                    fontSize: 14,
                  }}
                >
                  No strengths were provided.
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
                gap: 1,
              }}
            >
              <WarningAmberOutlinedIcon
                sx={{
                  color: "#d58b00",
                }}
              />

              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 800,
                }}
              >
                Areas to Improve
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              {report.weaknesses?.length > 0 ? (
                report.weaknesses.map((weakness, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1.2,
                      mb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#d58b00",
                        fontWeight: 800,
                      }}
                    >
                      •
                    </Typography>

                    <Typography
                      sx={{
                        color: "#5f7392",
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      {weakness}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    color: "#7185a3",
                    fontSize: 14,
                  }}
                >
                  No weaknesses were provided.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        
        <Box
          sx={{
            mt: 2.5,
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
              gap: 1,
            }}
          >
            <LightbulbOutlinedIcon
              sx={{
                color: "#1677e8",
              }}
            />

            <Typography
              sx={{
                fontSize: 19,
                fontWeight: 800,
              }}
            >
              Suggestions for Improvement
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {report.suggestions?.length > 0 ? (
              report.suggestions.map((suggestion, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 1.2,
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#1677e8",
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}.
                  </Typography>

                  <Typography
                    sx={{
                      color: "#5f7392",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    {suggestion}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  color: "#7185a3",
                  fontSize: 14,
                }}
              >
                No suggestions were provided.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportDetailPage;