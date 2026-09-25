import React from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import { useDashboardData } from "../../../services/apiQueries";

const ReadinessCard: React.FC = () => {
  const { data, isLoading: loading } = useDashboardData();
  const readiness = data?.readiness ?? null;
  const overall = readiness?.overall ?? 0;
  const technical = readiness?.technical ?? 0;
  const communication = readiness?.communication ?? 0;
  const problemSolving = readiness?.problemSolving ?? 0;

  const hasScore = overall > 0;

  const getReadinessLabel = (score: number) => {
    if (score >= 80) {
      return "Excellent";
    }

    if (score >= 60) {
      return "Good";
    }

    if (score >= 40) {
      return "Needs Improvement";
    }

    return "Getting Started";
  };

  const progressItems = [
    {
      label: "Technical",
      value: technical,
    },
    {
      label: "Communication",
      value: communication,
    },
    {
      label: "Problem Solving",
      value: problemSolving,
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8ebf1",
          borderRadius: "14px",
          p: "24px",
          minHeight: "310px",
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
        p: {
          xs: "20px",
          md: "24px",
        },
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: "24px",
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
            Interview Readiness
          </Typography>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#7a8497",
              mt: "4px",
            }}
          >
            Your overall interview performance
          </Typography>
        </Box>

        <Box
          sx={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            backgroundColor: "#f1f5ff",
            color: "#356ae6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TrendingUpOutlinedIcon
            sx={{
              fontSize: "20px",
            }}
          />
        </Box>
      </Box>

      {/* Overall Score */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          mb: "28px",
        }}
      >
        <Box
          sx={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            backgroundColor: "#f1f5ff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "25px",
              fontWeight: 800,
              color: "#172033",
              lineHeight: 1,
            }}
          >
            {hasScore ? overall : "--"}
          </Typography>

          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 600,
              color: "#7a8497",
              mt: "5px",
            }}
          >
            / 100
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 800,
              color: "#172033",
            }}
          >
            {hasScore
              ? getReadinessLabel(overall)
              : "Not Available Yet"}
          </Typography>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#7a8497",
              mt: "5px",
              lineHeight: 1.6,
            }}
          >
            {hasScore
              ? "Keep practicing to improve your readiness."
              : "Complete an interview to see your readiness score."}
          </Typography>
        </Box>
      </Box>
      <Box>
        {progressItems.map((item) => (
          <Box
            key={item.label}
            sx={{
              mb:
                item.label === "Problem Solving"
                  ? 0
                  : "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "7px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#596579",
                }}
              >
                {item.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#172033",
                }}
              >
                {hasScore ? `${item.value}%` : "--"}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
                height: "7px",
                backgroundColor: "#edf0f5",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: hasScore
                    ? `${item.value}%`
                    : "0%",
                  height: "100%",
                  backgroundColor: "#356ae6",
                  borderRadius: "10px",
                  transition: "width 0.4s ease",
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ReadinessCard;