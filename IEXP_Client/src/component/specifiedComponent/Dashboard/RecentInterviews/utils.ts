import type { RecentInterview } from "../../../../services/apiQueries";

export const getStatusStyle = (status: RecentInterview["status"]) => {
  switch (status) {
    case "Completed":
      return {
        backgroundColor: "#edf8f1",
        color: "#21874b",
      };

    case "In Progress":
    case "Left":
      return {
        backgroundColor: "#fff5e8",
        color: "#b86b00",
      };

    case "Not Started":
      return {
        backgroundColor: "#f1f5ff",
        color: "#356ae6",
      };

    case "Abandoned":
      return {
        backgroundColor: "#fff0f0",
        color: "#c54444",
      };

    default:
      return {
        backgroundColor: "#f1f3f6",
        color: "#687386",
      };
  }
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
