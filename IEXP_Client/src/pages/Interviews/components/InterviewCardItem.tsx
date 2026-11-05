import React from "react";
import { Avatar, Box, Button, Chip, IconButton, Typography } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import type { InterviewItem } from "../../../services/apiQueries";

interface InterviewCardItemProps {
  item: InterviewItem;
  onContinue: (id: string) => void;
  onViewReport: (id: string) => void;
}

export const InterviewCardItem: React.FC<InterviewCardItemProps> = ({
  item,
  onContinue,
  onViewReport,
}) => {
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
    (item.reportStatus === "Failed" || item.report?.status === "failed");

  return (
    <Box
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
          <Chip label={item.interviewType} size="small" />

          <Chip label={item.difficulty} size="small" />

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
            {new Date(item.updatedAt || item.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }
            )}
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
            onClick={() => onContinue(item.id)}
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
              onClick={() => onViewReport(item.id)}
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
              onClick={() => onViewReport(item.id)}
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
            onClick={() => onContinue(item.id)}
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
};

export default InterviewCardItem;
