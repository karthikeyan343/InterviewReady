export interface InterviewItem {
  id: string;
  role: string;
  interviewType: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
  createdAt: string;
  startedAt?: string | null;
  endedAt?: string | null;
  questionCount: number;
  durationMinutes: number | null;
  score: number | null;
  report: {
    id: string;
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
  } | null;
}

export interface ScoreBarProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}
