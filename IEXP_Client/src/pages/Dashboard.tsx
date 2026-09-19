import React from "react";
import { Box } from "@mui/material";

import DashboardNavbar from "../component/specifiedComponent/Dashboard/DashboardNavbar";
import DashboardWelcome from "../component/specifiedComponent/Dashboard/DashboardWelcome";
import DashboardStats from "../component/specifiedComponent/Dashboard/DashboardStats";
import ReadinessCard from "../component/specifiedComponent/Dashboard/ReadinessCard";
import RecentInterviews from "../component/specifiedComponent/Dashboard/RecentInterviews";
import PerformanceCard from "../component/specifiedComponent/Dashboard/PerformanceCard";
import ContinuePractice from "../component/specifiedComponent/Dashboard/ContinuePractice";
import ResumeStatusCard from "../component/specifiedComponent/Dashboard/ResumeStatusCard";

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        backgroundColor: "#f6f8fc",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <DashboardNavbar />

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: "1440px",
          mx: "auto",
          minWidth: 0,
          boxSizing: "border-box",
          px: {
            xs: "18px",
            sm: "26px",
            md: "40px",
            lg: "48px",
          },
          py: {
            xs: "24px",
            md: "32px",
          },
        }}
      >
        <DashboardWelcome />

        <DashboardStats />

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "minmax(0, 1.65fr) minmax(280px, 0.8fr)",
            },
            gap: "18px",
            mb: "20px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <ReadinessCard />
          </Box>

          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <PerformanceCard />
          </Box>
        </Box>

        <RecentInterviews />

        <Box
          sx={{
            width: "100%",
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 1fr) minmax(0, 1fr)",
            },
            gap: "18px",
            mt: "20px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <ContinuePractice />
          </Box>

          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <ResumeStatusCard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;