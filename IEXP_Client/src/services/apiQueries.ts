import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ----------------------------------------------------
// Types
// ----------------------------------------------------

export interface RecentInterview {
  id: string;
  role: string;
  interviewType: "Technical" | "Behavioral" | "Mixed";
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Not Started" | "In Progress" | "Completed" | "Abandoned" | "Left";
  createdAt: string;
  updatedAt?: string;
  startedAt?: string;
  endedAt?: string;
  reportStatus?: "none" | "preparing" | "ready" | "failed" | "NotRequired" | "Processing" | "Completed" | "Failed";
  score: number | null;
}

export interface DashboardStatsData {
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
}

export interface ReadinessData {
  overall: number;
  technical: number;
  communication: number;
  problemSolvingScore?: number;
  problemSolving?: number;
}

export interface ContinuePracticeData {
  id: string;
  role: string;
  interviewType: "Technical" | "Behavioral" | "Mixed";
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Not Started" | "In Progress" | "Left";
  createdAt: string;
  updatedAt?: string;
}

export interface DashboardResponse {
  stats: DashboardStatsData;
  readiness: ReadinessData;
  recentInterviews: RecentInterview[];
  continuePractice: ContinuePracticeData | null;
  resume: {
    uploaded: boolean;
    id?: string;
    originalFileName?: string;
    fileType?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface InterviewItem {
  id: string;
  role: string;
  interviewType: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Not Started" | "In Progress" | "Completed" | "Abandoned" | "Left";
  createdAt: string;
  updatedAt?: string;
  startedAt?: string;
  endedAt?: string;
  questionCount: number;
  durationMinutes: number | null;
  reportStatus?: "none" | "preparing" | "ready" | "failed" | "NotRequired" | "Processing" | "Completed" | "Failed";
  score: number | null;
  report: {
    id: string;
    status?: "preparing" | "ready" | "failed" | "NotRequired" | "Processing" | "Completed" | "Failed";
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
  } | null;
}

export interface ResumeData {
  id: string;
  originalFileName: string;
  fileType: string;
  uploadedAt: string;
  updatedAt?: string;
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
  status: "preparing" | "ready" | "failed" | "NotRequired" | "Processing" | "Completed" | "Failed";
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportStatusResponse {
  status: "NotRequired" | "Processing" | "Completed" | "Failed";
  reportId?: string;
  overallScore?: number;
  error?: string;
  errorMessage?: string;
}

// ----------------------------------------------------
// Query Hooks
// ----------------------------------------------------

export const useDashboardData = () => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}/interviews/dashboard`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
    // If any recent interview has report in "preparing" or "Processing" state, poll dashboard every 3.5s
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasProcessing = data?.recentInterviews?.some(
        (i) => i.reportStatus === "preparing" || i.reportStatus === "Processing"
      );
      return hasProcessing ? 3500 : false;
    },
  });
};

export const useInterviews = () => {
  return useQuery<{ interviews: InterviewItem[] }>({
    queryKey: ["interviews"],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}/interviews`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to load interviews.");
      }
      return response.json();
    },
    // Poll interviews only if an interview has a report in "preparing" or "Processing" state
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasProcessing = data?.interviews?.some(
        (i) =>
          i.report?.status === "preparing" ||
          i.report?.status === "Processing" ||
          i.reportStatus === "preparing" ||
          i.reportStatus === "Processing"
      );
      return hasProcessing ? 3500 : false;
    },
  });
};

export const useResume = () => {
  return useQuery<{ resume: ResumeData | null }>({
    queryKey: ["resume"],
    queryFn: async () => {
      const response = await fetch(`${getApiBaseUrl()}/resume/me`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (response.status === 404) {
        return { resume: null };
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load resume.");
      }
      const data = await response.json();
      return { resume: data.resume ?? null };
    },
  });
};

export const useInterviewReport = (interviewId?: string) => {
  return useQuery<{ report: InterviewReport }>({
    queryKey: ["report", interviewId],
    queryFn: async () => {
      if (!interviewId) throw new Error("Interview ID is required");
      const response = await fetch(
        `${getApiBaseUrl()}/interviews/${interviewId}/report`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch interview report.");
      }
      return response.json();
    },
    enabled: !!interviewId,
    // Poll report only while status is "preparing" or "Processing", stop when "ready", "Completed", or "Failed"
    refetchInterval: (query) => {
      const status = query.state.data?.report?.status;
      return status === "preparing" || status === "Processing" ? 3500 : false;
    },
  });
};

export const useInterviewReportStatus = (interviewId?: string) => {
  return useQuery<ReportStatusResponse>({
    queryKey: ["reportStatus", interviewId],
    queryFn: async () => {
      if (!interviewId) throw new Error("Interview ID is required");
      const response = await fetch(
        `${getApiBaseUrl()}/interviews/${interviewId}/report-status`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch report status.");
      }
      return response.json();
    },
    enabled: !!interviewId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "Processing" ? 3500 : false;
    },
  });
};

export const retryReportGeneration = async (interviewId: string): Promise<void> => {
  const response = await fetch(
    `${getApiBaseUrl()}/interviews/${interviewId}/report/retry`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Failed to retry report generation.");
  }

  // Invalidate relevant queries so UI transitions immediately to Processing state
  invalidateReports(interviewId);
};

// ----------------------------------------------------
// Mutation / Cache Invalidation Utilities
// ----------------------------------------------------

export const invalidateDashboard = () => {
  void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
};

export const invalidateInterviews = () => {
  void queryClient.invalidateQueries({ queryKey: ["interviews"] });
};

export const invalidateResume = () => {
  void queryClient.invalidateQueries({ queryKey: ["resume"] });
  void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
};

export const invalidateReports = (interviewId?: string) => {
  if (interviewId) {
    void queryClient.invalidateQueries({ queryKey: ["report", interviewId] });
    void queryClient.invalidateQueries({ queryKey: ["reportStatus", interviewId] });
  } else {
    void queryClient.invalidateQueries({ queryKey: ["report"] });
    void queryClient.invalidateQueries({ queryKey: ["reportStatus"] });
  }
  void queryClient.invalidateQueries({ queryKey: ["interviews"] });
  void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
};

export const clearAllUserCache = () => {
  queryClient.clear();
};
