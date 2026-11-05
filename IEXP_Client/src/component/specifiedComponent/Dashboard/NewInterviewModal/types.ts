export type InterviewType = "Technical" | "Resume-Based" | "Mixed";

export type DifficultyLevel = "Easy" | "Medium" | "Hard";

export interface NewInterviewModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: {
    role: string;
    interviewType: InterviewType;
    difficulty: DifficultyLevel;
  }) => void | Promise<void>;
}
