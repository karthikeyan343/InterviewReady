import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import type { InterviewReport } from "../../../services/apiQueries";

interface ReportFeedbackCardsProps {
  report: InterviewReport;
}

export const ReportFeedbackCards: React.FC<ReportFeedbackCardsProps> = ({ report }) => {
  return (
    <>
      {/* AI Summary */}
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

      {/* Strengths & Weaknesses Grid */}
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
        {/* Strengths */}
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
            <CheckCircleOutlineIcon sx={{ color: "#1677e8" }} />
            <Typography sx={{ fontSize: 19, fontWeight: 800 }}>
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
                  <Typography sx={{ color: "#1677e8", fontWeight: 800 }}>
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
              <Typography sx={{ color: "#7185a3", fontSize: 14 }}>
                No strengths were provided.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Areas to Improve */}
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
            <WarningAmberOutlinedIcon sx={{ color: "#d58b00" }} />
            <Typography sx={{ fontSize: 19, fontWeight: 800 }}>
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
                  <Typography sx={{ color: "#d58b00", fontWeight: 800 }}>
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
              <Typography sx={{ color: "#7185a3", fontSize: 14 }}>
                No weaknesses were provided.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Suggestions for Improvement */}
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
          <LightbulbOutlinedIcon sx={{ color: "#1677e8" }} />
          <Typography sx={{ fontSize: 19, fontWeight: 800 }}>
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
                <Typography sx={{ color: "#1677e8", fontWeight: 800 }}>
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
            <Typography sx={{ color: "#7185a3", fontSize: 14 }}>
              No suggestions were provided.
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};
