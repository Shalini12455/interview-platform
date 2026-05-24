import api from "./authService";

export interface ResumeAnalysis {
  id: number;
  fileName: string;
  atsScore: number;
  skills: string;
  missingKeywords: string;
  suggestions: string;
  analyzedAt: string;
}

export const resumeService = {
  analyzeResume: async (
    file: File,
    jobRole: string,
  ): Promise<ResumeAnalysis> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobRole", jobRole);
    const response = await api.post("/resume/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getMyResumes: async (): Promise<ResumeAnalysis[]> => {
    const response = await api.get("/resume/my-resumes");
    return response.data;
  },
};
