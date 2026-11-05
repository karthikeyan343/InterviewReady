import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDashboardData, type RecentInterview } from "../../../../services/apiQueries";
import RecentInterviewsHeader from "./components/RecentInterviewsHeader";
import RecentInterviewsEmptyState from "./components/RecentInterviewsEmptyState";
import RecentInterviewRow from "./components/RecentInterviewRow";

export const RecentInterviews: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading: loading } = useDashboardData();
  const interviews: RecentInterview[] = data?.recentInterviews ?? [];

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          border: "1px solid #e8ebf1",
          borderRadius: "14px",
          p: "24px",
          minHeight: "250px",
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
        overflow: "hidden",
      }}
    >
      <RecentInterviewsHeader
        hasInterviews={interviews.length > 0}
        onViewAll={() => navigate("/interviews")}
      />

      {interviews.length === 0 ? (
        <RecentInterviewsEmptyState
          onStartInterview={() => navigate("/interviews")}
        />
      ) : (
        <Box>
          {interviews.map((interview, index) => (
            <RecentInterviewRow
              key={interview.id}
              interview={interview}
              isLast={index === interviews.length - 1}
              onNavigate={(id) => navigate(`/interviews/${id}`)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentInterviews;
