export interface User {
  _id?: string;
  name?: string;
  email?: string;
}

export interface DashboardData {
  stats?: {
    totalInterviews?: number;
    completedInterviews?: number;
    averageScore?: number;
  };

  resume?: {
    uploaded?: boolean;
  };
}
