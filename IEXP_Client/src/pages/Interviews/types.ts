export interface NewInterviewData {
  role: string;
  interviewType:
    | "Technical"
    | "Resume-Based"
    | "Mixed"
    | "Behavioral";
  difficulty:
    | "Easy"
    | "Medium"
    | "Hard";
}

export type InterviewFilterType = "All" | "Completed" | "Left";
