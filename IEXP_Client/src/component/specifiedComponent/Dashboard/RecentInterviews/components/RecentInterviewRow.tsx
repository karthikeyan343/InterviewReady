import React from "react";
import { Box, Typography } from "@mui/material";
import type { RecentInterview } from "../../../../../services/apiQueries";
import { formatDate, getStatusStyle } from "../utils";

interface RecentInterviewRowProps {
  interview: RecentInterview;
  isLast: boolean;
  onNavigate: (id: string) => void;
}

export const RecentInterviewRow: React.FC<RecentInterviewRowProps> = ({
  interview,
  isLast,
  onNavigate,
}) => {
  const statusStyle = getStatusStyle(interview.status);
  const isPreparing =
    interview.reportStatus === "preparing" ||
    interview.reportStatus === "Processing";
  const isFailed =
    interview.reportStatus === "failed" ||
    interview.reportStatus === "Failed";

  return (
    <Box
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
        borderBottom: !isLast ? "1px solid #edf0f4" : "none",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "#fafbfc",
        },
      }}
      onClick={() => onNavigate(interview.id)}
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
            {formatDate(interview.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: "9px",
          py: "5px",
          borderRadius: "7px",
          backgroundColor: isPreparing
            ? "#f0f4ff"
            : isFailed
            ? "#fff0f0"
            : statusStyle.backgroundColor,
          color: isPreparing
            ? "#2b66d9"
            : isFailed
            ? "#c53b3b"
            : statusStyle.color,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {isPreparing && (
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#356ae6",
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.4 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.4 },
              },
            }}
          />
        )}
        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          {isPreparing
            ? "Report Preparing..."
            : isFailed
            ? "Report Failed"
            : interview.status}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "58px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 800,
            color: interview.score !== null ? "#172033" : "#a0a7b3",
          }}
        >
          {interview.score !== null
            ? `${interview.score}%`
            : isPreparing
            ? "..."
            : "--"}
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentInterviewRow;
