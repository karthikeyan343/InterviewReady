import React from "react";
import { Box } from "@mui/material";
import DashboardNavbar from "../../component/specifiedComponent/Dashboard/DashboardNavbar";
import NewInterviewModal from "../../component/specifiedComponent/Dashboard/NewInterviewModal";
import { useInterviewsPage } from "./hooks/useInterviewsPage";
import InterviewsHeader from "./components/InterviewsHeader";
import InterviewsStatCards from "./components/InterviewsStatCards";
import InterviewsFilterButtons from "./components/InterviewsFilterButtons";
import InterviewCardItem from "./components/InterviewCardItem";
import InterviewsEmptyState from "./components/InterviewsEmptyState";

export const InterviewsPage: React.FC = () => {
  const {
    navigate,
    loading,
    error,
    openModal,
    setOpenModal,
    selectedFilter,
    setSelectedFilter,
    totalInterviewsCount,
    completedInterviewsCount,
    averageScoreDisplay,
    filteredInterviews,
    handleCreateInterview,
  } = useInterviewsPage();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f6f8fc",
        color: "#172b4d",
      }}
    >
      <DashboardNavbar />

      <Box
        sx={{
          px: { xs: 2, md: 8 },
          py: { xs: 4, md: 6 },
        }}
      >
        <InterviewsHeader onOpenNewInterview={() => setOpenModal(true)} />

        <InterviewsStatCards
          totalInterviewsCount={totalInterviewsCount}
          completedInterviewsCount={completedInterviewsCount}
          averageScoreDisplay={averageScoreDisplay}
        />

        <InterviewsFilterButtons
          selectedFilter={selectedFilter}
          onSelectFilter={setSelectedFilter}
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {loading || error || filteredInterviews.length === 0 ? (
            <InterviewsEmptyState
              loading={loading}
              error={error}
              selectedFilter={selectedFilter}
            />
          ) : (
            filteredInterviews.map((item) => (
              <InterviewCardItem
                key={item.id}
                item={item}
                onContinue={(id) => navigate(`/interviews/${id}`)}
                onViewReport={(id) => navigate(`/reports/${id}`)}
              />
            ))
          )}
        </Box>
      </Box>

      <NewInterviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreate={handleCreateInterview}
      />
    </Box>
  );
};

export default InterviewsPage;
