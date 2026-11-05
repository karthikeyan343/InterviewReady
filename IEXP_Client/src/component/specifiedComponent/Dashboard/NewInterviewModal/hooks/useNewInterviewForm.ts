import { useState } from "react";
import { useResume } from "../../../../../services/apiQueries";
import type { DifficultyLevel, InterviewType, NewInterviewModalProps } from "../types";

export const useNewInterviewForm = ({
  onClose,
  onCreate,
}: Pick<NewInterviewModalProps, "onClose" | "onCreate">) => {
  const { data: resumeData, isLoading: resumeLoading } = useResume();
  const [role, setRole] = useState("");
  const [interviewType, setInterviewType] = useState<InterviewType>("Mixed");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("Easy");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!resumeLoading && !resumeData?.resume) {
      setError(
        "Please upload your resume first, then you can continue the interview process."
      );
      return;
    }

    const cleanedRole = role.trim();

    if (!cleanedRole) {
      setError("Please enter a job role.");
      return;
    }

    setError("");

    try {
      await onCreate?.({
        role: cleanedRole,
        interviewType,
        difficulty,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create interview. Please try again."
      );
    }
  };

  const handleClose = () => {
    setError("");
    setRole("");
    setInterviewType("Mixed");
    setDifficulty("Easy");
    onClose();
  };

  return {
    role,
    setRole,
    interviewType,
    setInterviewType,
    difficulty,
    setDifficulty,
    error,
    setError,
    handleCreate,
    handleClose,
  };
};
