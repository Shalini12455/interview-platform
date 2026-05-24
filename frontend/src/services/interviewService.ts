import api from "./authService";

export interface InterviewStartRequest {
  jobRole: string;
  difficulty: string;
  type: string;
  title?: string;
}

export interface Question {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  hints: string[];
}

export interface AnswerEvaluation {
  score: number;
  rating: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
  sampleAnswer: string;
}

export const interviewService = {
  startInterview: async (data: InterviewStartRequest) => {
    const response = await api.post("/interviews/start", data);
    return response.data;
  },

  evaluateAnswer: async (
    interviewId: number,
    question: string,
    answer: string,
    jobRole: string,
  ) => {
    const response = await api.post("/interviews/evaluate-answer", {
      interviewId,
      question,
      answer,
      jobRole,
    });
    try {
      if (typeof response.data === "string") {
        return JSON.parse(response.data);
      }
      return response.data;
    } catch (e) {
      return {
        score: 0,
        rating: "Poor",
        feedback: "Could not parse AI response",
        strengths: [],
        improvements: [],
        sampleAnswer: "",
      };
    }
  },

  completeInterview: async (id: number, answersJson: string, score: number) => {
    const response = await api.post(`/interviews/${id}/complete`, {
      answersJson,
      score,
    });
    return response.data;
  },

  getMyInterviews: async () => {
    const response = await api.get("/interviews/my-interviews");
    return response.data;
  },
};
