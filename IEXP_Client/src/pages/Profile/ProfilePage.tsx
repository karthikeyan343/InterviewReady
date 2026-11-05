import React from "react";
import { Box, Typography } from "@mui/material";
import DashboardNavbar from "../../component/specifiedComponent/Dashboard/DashboardNavbar";
import { useProfile } from "./hooks/useProfile";
import ProfileBannerCard from "./components/ProfileBannerCard";
import AccountDetailsCard from "./components/AccountDetailsCard";
import ProfileProgressCard from "./components/ProfileProgressCard";

export const ProfilePage: React.FC = () => {
  const {
    displayName,
    email,
    initials,
    loading,
    totalInterviews,
    completedInterviews,
    averageScore,
    resumeUploaded,
    navigate,
  } = useProfile();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F6F8FC",
        color: "#172B4D",
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <DashboardNavbar />

      <Box
        sx={{
          width: "100%",
          maxWidth: "1180px",
          mx: "auto",
          px: {
            xs: "20px",
            sm: "30px",
            md: "0px",
          },
          py: {
            xs: "30px",
            md: "46px",
          },
        }}
      >
        <Box
          sx={{
            mb: "28px",
          }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.8px",
              color: "#8A9BB7",
              textTransform: "uppercase",
              mb: "6px",
            }}
          >
            ACCOUNT
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "28px",
                md: "34px",
              },
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "#101B46",
              lineHeight: 1.2,
            }}
          >
            Profile
          </Typography>

          <Typography
            sx={{
              mt: "7px",
              fontSize: "13px",
              color: "#7182A8",
            }}
          >
            Manage your account information and interview progress.
          </Typography>
        </Box>

        <ProfileBannerCard
          initials={initials}
          displayName={displayName}
          email={email}
        />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.35fr 0.65fr",
            },
            gap: "24px",
          }}
        >
          <AccountDetailsCard
            displayName={displayName}
            email={email}
            resumeUploaded={resumeUploaded}
            onNavigateResume={() => navigate("/resume")}
          />

          <ProfileProgressCard
            loading={loading}
            totalInterviews={totalInterviews}
            completedInterviews={completedInterviews}
            averageScore={averageScore}
            resumeUploaded={resumeUploaded}
            onNavigateReports={() => navigate("/reports")}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
