export const formatDate = (value?: string | null): string => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export const formatDateTime = (value?: string | null): string => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

export const getScoreLabel = (score: number): string => {
  if (score >= 85) return "Excellent Performance";
  if (score >= 70) return "Good Performance";
  if (score >= 50) return "Needs Improvement";
  return "Keep Practicing";
};

export const getScoreMessage = (score: number): string => {
  if (score >= 85) {
    return "You demonstrated strong knowledge and communication throughout the interview.";
  }

  if (score >= 70) {
    return "You performed well overall. Keep practicing to improve consistency and answer depth.";
  }

  if (score >= 50) {
    return "You have a solid starting point. Focus on the weaker areas identified below.";
  }

  return "Use this report as a guide and keep practicing with focused preparation.";
};

export const getDifficultyStyle = (difficulty: string): { backgroundColor: string; color: string } => {
  if (difficulty === "Hard") {
    return {
      backgroundColor: "#fff0f0",
      color: "#c53b3b",
    };
  }

  if (difficulty === "Medium") {
    return {
      backgroundColor: "#fff7e6",
      color: "#b66b00",
    };
  }

  return {
    backgroundColor: "#edf7f0",
    color: "#2e7d4f",
  };
};
