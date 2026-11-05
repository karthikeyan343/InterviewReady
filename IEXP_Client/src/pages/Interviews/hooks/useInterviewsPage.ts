import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useInterviews,
  invalidateInterviews,
  invalidateDashboard,
  type InterviewItem,
} from "../../../services/apiQueries";
import type { InterviewFilterType, NewInterviewData } from "../types";

export const useInterviewsPage = () => {
  const navigate = useNavigate();

  const { data, isLoading: loading, error: queryError } = useInterviews();
  const interviews: InterviewItem[] = data?.interviews || [];
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to load interviews."
    : "";

  const [openModal, setOpenModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<InterviewFilterType>("All");

  const totalInterviewsCount = interviews.length;
  const completedInterviewsCount = interviews.filter(
    (item) => item.status === "Completed"
  ).length;

  const validReportInterviews = interviews.filter(
    (item): item is InterviewItem & { score: number } =>
      item.status === "Completed" &&
      typeof item.score === "number" &&
      (item.reportStatus === "Completed" ||
        item.report?.status === "ready" ||
        item.report?.status === "Completed")
  );

  const averageScoreDisplay =
    validReportInterviews.length > 0
      ? `${Math.round(
          validReportInterviews.reduce((sum, item) => sum + item.score, 0) /
            validReportInterviews.length
        )}%`
      : "—";

  const filteredInterviews = interviews
    .filter((item) => {
      if (selectedFilter === "All") {
        return item.status === "Completed" || item.status === "Left";
      }
      if (selectedFilter === "Completed") {
        return item.status === "Completed";
      }
      if (selectedFilter === "Left") {
        return item.status === "Left";
      }
      return false;
    })
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });

  const handleCreateInterview = async (newInterviewData: NewInterviewData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/interviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newInterviewData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Create interview error:", result.message);
        throw new Error(
          result.message || "Failed to create interview. Please try again."
        );
      }

      const interviewId = result.interview?.id;

      if (!interviewId) {
        console.error("Interview ID not found:", result);
        throw new Error("Interview ID not returned by server.");
      }

      invalidateInterviews();
      invalidateDashboard();

      setOpenModal(false);
      navigate(`/interviews/${interviewId}`);
    } catch (createErr) {
      console.error("Create interview error:", createErr);
      throw createErr;
    }
  };

  return {
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
  };
};
