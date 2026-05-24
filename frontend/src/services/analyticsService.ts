import api from "./authService";

export interface AnalyticsData {
  totalInterviews: number;
  completedInterviews: number;
  totalSubmissions: number;
  acceptedSubmissions: number;
  averageScore: number;
  highestScore: number;
  scoreHistory: Array<{
    date: string;
    score: number;
    title: string;
  }>;
  interviewsByType: Array<{
    type: string;
    count: number;
  }>;
  weeklyActivity: Array<{
    day: string;
    interviews: number;
  }>;
  currentStreak: number;
  resumeCount: number;
  averageAtsScore: number;
}

export const analyticsService = {
  getMyStats: async (): Promise<AnalyticsData> => {
    const response = await api.get("/analytics/my-stats");
    return response.data;
  },
};
