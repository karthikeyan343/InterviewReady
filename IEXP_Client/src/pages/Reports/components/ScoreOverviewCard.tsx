import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import type { InterviewItem } from "../types";
import { formatDateTime, getScoreLabel, getScoreMessage } from "../utils";
import { ScoreBar } from "./ScoreBar";

interface ScoreOverviewCardProps {
  report: {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
  };
  interview: InterviewItem;
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = ({
  report,
  interview,
}) => {
  const score = report.overallScore;

  const metadataItems = [
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
  ];

  return (
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
          {metadataItems.map((item) => (
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
  );
};
