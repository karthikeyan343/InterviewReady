import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";

interface ReadinessData {
  overall: number;
  technical: number;
  communication: number;
  problemSolving: number;
}

interface DashboardResponse {
  readiness: ReadinessData;
}

const PerformanceCard: React.FC = () => {
  const [readiness, setReadiness] =
    useState<ReadinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
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
          throw new Error("Failed to fetch performance data");
        }

        const result: DashboardResponse =
          await response.json();

        setReadiness(result.readiness);
      } catch (error) {
        console.error(
          "Performance data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

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

  const overall = readiness?.overall ?? 0;
  const technical = readiness?.technical ?? 0;
  const communication = readiness?.communication ?? 0;
  const problemSolving = readiness?.problemSolving ?? 0;

  const hasScore = overall > 0;

  const areas = [
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

  const strongestArea = hasScore
    ? areas.reduce((best, current) =>
        current.value > best.value ? current : best
      )
    : null;

  const weakestArea = hasScore
    ? areas.reduce((weakest, current) =>
        current.value < weakest.value
          ? current
          : weakest
      )
    : null;

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
        minHeight: "310px",
      }}
    >
      {/* Header */}
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
            Performance
          </Typography>

          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#7a8497",
              mt: "4px",
            }}
          >
            Track your interview strengths
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

      {!hasScore ? (
        <Box
          sx={{
            minHeight: "210px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: "20px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#172033",
              }}
            >
              No performance data yet
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: "#7a8497",
                mt: "7px",
                lineHeight: 1.6,
              }}
            >
              Complete an interview to see your
              performance insights.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              border: "1px solid #e8ebf1",
              borderRadius: "12px",
              p: "16px",
              mb: "12px",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#7a8497",
                mb: "6px",
              }}
            >
              Strongest Area
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#172033",
                }}
              >
                {strongestArea?.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#356ae6",
                }}
              >
                {strongestArea?.value}%
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              border: "1px solid #e8ebf1",
              borderRadius: "12px",
              p: "16px",
              mb: "12px",
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#7a8497",
                mb: "6px",
              }}
            >
              Needs Improvement
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#172033",
                }}
              >
                {weakestArea?.label}
              </Typography>

              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "#172033",
                }}
              >
                {weakestArea?.value}%
              </Typography>
            </Box>
          </Box>

          {/* Overall */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: "4px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#596579",
              }}
            >
              Overall Performance
            </Typography>

            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 800,
                color: "#172033",
              }}
            >
              {overall}%
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PerformanceCard;