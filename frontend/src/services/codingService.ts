import api from "./authService";

export interface CodingProblem {
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  constraints: string[];
  hints: string[];
  starterCode: {
    java: string;
    python: string;
    javascript: string;
  };
}

export interface CodeEvaluation {
  score: number;
  isCorrect: boolean;
  timeComplexity: string;
  spaceComplexity: string;
  feedback: string;
  issues: string[];
  suggestions: string[];
  optimizedApproach: string;
}

export const codingPracticeService = {
  generateProblem: async (
    topic: string,
    difficulty: string,
  ): Promise<CodingProblem> => {
    const response = await api.post("/coding/generate-problem", {
      topic,
      difficulty,
      language: "any",
    });
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
    return data;
  },

  submitCode: async (
    code: string,
    language: string,
    problem: string,
    topic: string,
    difficulty: string,
  ): Promise<CodeEvaluation> => {
    const response = await api.post("/coding/submit", {
      code,
      language,
      problem,
      topic,
      difficulty,
    });
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
    return data;
  },

  getMySubmissions: async () => {
    const response = await api.get("/coding/my-submissions");
    return response.data;
  },
};
