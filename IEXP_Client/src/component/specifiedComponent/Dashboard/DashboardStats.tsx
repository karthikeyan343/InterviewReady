import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface DashboardStatsData {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
}

interface DashboardResponse {
  stats: DashboardStatsData;
  resume: {
    uploaded: boolean;
  };
}

const DashboardStats: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();

        setData(result);
      } catch (error) {
        console.error("Dashboard data error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "repeat(4, 1fr)",
          },
          gap: "16px",
          mb: "20px",
        }}
      >
        {[1, 2, 3, 4].map((item) => (
          <Box
            key={item}
            sx={{
              backgroundColor: "#ffffff",
              border: "1px solid #e8ebf1",
              borderRadius: "14px",
              px: "18px",
              py: "18px",
              minHeight: "118px",
            }}
          />
        ))}
      </Box>
    );
  }

  const totalInterviews = data?.stats.totalInterviews ?? 0;
  const completedInterviews =
    data?.stats.completedInterviews ?? 0;
  const averageScore = data?.stats.averageScore ?? 0;
  const resumeUploaded = data?.resume.uploaded ?? false;

  const stats = [
    {
      label: "Total Interviews",
      value: totalInterviews.toString(),
      description: "Practice sessions",
      icon: <AssignmentOutlinedIcon />,
    },
    {
      label: "Completed",
      value: completedInterviews.toString(),
      description: "Interviews completed",
      icon: <CheckCircleOutlineOutlinedIcon />,
    },
    {
      label: "Average Score",
      value: `${averageScore}%`,
      description: "Across completed interviews",
      icon: <TrendingUpOutlinedIcon />,
    },
    {
      label: "Resume",
      value: resumeUploaded ? "Ready" : "Not Uploaded",
      description: resumeUploaded
        ? "Your resume is uploaded"
        : "Upload your resume to practice",
      icon: <DescriptionOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "repeat(4, 1fr)",
        },
        gap: "16px",
        mb: "20px",
      }}
    >
      {stats.map((stat) => (
        <Box
          key={stat.label}
          sx={{
            backgroundColor: "#ffffff",
            border: "1px solid #e8ebf1",
            borderRadius: "14px",
            px: "18px",
            py: "18px",
            minHeight: "118px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#7a8497",
                mb: "8px",
              }}
            >
              {stat.label}
            </Typography>

            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#172033",
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </Typography>

            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#929aaa",
                mt: "7px",
              }}
            >
              {stat.description}
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
              flexShrink: 0,
              "& svg": {
                fontSize: "20px",
              },
            }}
          >
            {stat.icon}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default DashboardStats;