import React from "react";
import { Box, Divider, LinearProgress, Typography } from "@mui/material";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import type { InterviewReport } from "../../../services/apiQueries";

interface ReportHeaderCardProps {
  report: InterviewReport;
}

export const ReportHeaderCard: React.FC<ReportHeaderCardProps> = ({ report }) => {
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
  );
};
