import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { interviewService } from "../../services/interviewService";

const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobRole: "",
    difficulty: "MEDIUM",
    type: "TECHNICAL",
    title: "",
  });

  const jobRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobRole) {
      toast.error("Please select a job role");
      return;
    }
    setIsLoading(true);
    try {
      const interview = await interviewService.startInterview(formData);
      toast.success("Interview started!");
      navigate("/interview/session", {
        state: { interview, jobRole: formData.jobRole },
      });
    } catch (error) {
      toast.error("Failed to start interview. Check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="bg-dark-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-500">
            Interview Platform
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            AI Mock Interview
          </h2>
          <p className="text-slate-400">
            Configure your interview session and practice with AI
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-dark-800 rounded-2xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Role */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Role
              </label>
              <select
                value={formData.jobRole}
                onChange={(e) =>
                  setFormData({ ...formData, jobRole: e.target.value })
                }
                className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                           rounded-lg text-white focus:outline-none
                           focus:border-primary-500 transition"
              >
                <option value="">Select a job role</option>
                {jobRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Interview Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["TECHNICAL", "HR", "BEHAVIORAL", "CODING"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition
                      ${
                        formData.type === type
                          ? "border-primary-500 bg-primary-500/10 text-primary-400"
                          : "border-slate-600 text-slate-400 hover:border-slate-500"
                      }`}
                  >
                    {type === "TECHNICAL" && "💻 "}
                    {type === "HR" && "👥 "}
                    {type === "BEHAVIORAL" && "🧠 "}
                    {type === "CODING" && "⚡ "}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "EASY", color: "green", label: "🟢 Easy" },
                  { value: "MEDIUM", color: "yellow", label: "🟡 Medium" },
                  { value: "HARD", color: "red", label: "🔴 Hard" },
                ].map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, difficulty: level.value })
                    }
                    className={`py-3 px-4 rounded-lg border text-sm font-medium transition
                      ${
                        formData.difficulty === level.value
                          ? `border-${level.color}-500 bg-${level.color}-500/10 text-${level.color}-400`
                          : "border-slate-600 text-slate-400 hover:border-slate-500"
                      }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Title */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Session Title (Optional)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Google Interview Practice"
                className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                           rounded-lg text-white placeholder-slate-500
                           focus:outline-none focus:border-primary-500 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700
                         text-white font-semibold rounded-lg transition
                         disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? "🤖 Generating Questions..." : "🚀 Start Interview"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
