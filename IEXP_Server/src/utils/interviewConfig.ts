export type InterviewDifficulty =
  "Easy" | "Medium" | "Hard";

export const getInterviewQuestionLimit = (
  difficulty: InterviewDifficulty
): number => {
  switch (difficulty) {
    case "Easy":
      return 20;

    case "Medium":
      return 30;

    case "Hard":
      return 40;

    default:
      return 10;
  }
};
