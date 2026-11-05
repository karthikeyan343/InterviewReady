import React from "react";
import { useParams } from "react-router-dom";
import { useInterviews } from "../../services/apiQueries";
import type { InterviewItem } from "./types";
import { ReportListPage } from "./components/ReportListPage";
import { ReportDetailPage } from "./components/ReportDetailPage";

export const ReportsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: interviewsData, isLoading: loading, error: queryError } = useInterviews();
  const interviews = (interviewsData?.interviews ?? []) as unknown as InterviewItem[];
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to fetch interview reports."
    : "";

  if (id) {
    return (
      <ReportDetailPage
        interviews={interviews}
        interviewsLoading={loading}
        interviewsError={error}
      />
    );
  }

  return (
    <ReportListPage
      interviews={interviews}
      loading={loading}
      error={error}
    />
  );
};

export default ReportsPage;
