import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import RecordVoiceOverOutlinedIcon from "@mui/icons-material/RecordVoiceOverOutlined";
import { useNavigate } from "react-router-dom";
import type { InterviewItem } from "../types";
import { formatDate, getDifficultyStyle } from "../utils";
import { ScoreBar } from "./ScoreBar";

interface ReportCardProps {
  item: InterviewItem;
}

export const ReportCard: React.FC<ReportCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const difficultyStyle = getDifficultyStyle(item.difficulty);

  return (
    <Box
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
            onClick={() => navigate(`/reports/${item.id}`)}
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
          icon={<RecordVoiceOverOutlinedIcon fontSize="small" />}
        />
        <ScoreBar
          label="Problem Solving"
          value={item.report?.problemSolvingScore ?? 0}
          icon={<PsychologyOutlinedIcon fontSize="small" />}
        />
      </Box>
    </Box>
  );
};
