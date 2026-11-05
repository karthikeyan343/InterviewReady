import React from "react";
import { Box, Typography } from "@mui/material";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

interface FeedbackSectionsProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const FeedbackSections: React.FC<FeedbackSectionsProps> = ({
  strengths,
  weaknesses,
  suggestions,
}) => {
  return (
    <>
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
              <CodeOutlinedIcon />
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
            {strengths.length ? (
              strengths.map((strength, index) => (
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
            {weaknesses.length ? (
              weaknesses.map((weakness, index) => (
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

      {/* Suggestions for Improvement */}
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
          {suggestions.length ? (
            suggestions.map((suggestion, index) => (
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
    </>
  );
};
