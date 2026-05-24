import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { codingPracticeService } from "../../services/codingService";

const SubmissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await codingPracticeService.getMySubmissions();
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <nav className="bg-dark-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-500">
            Interview Platform
          </h1>
          <button
            onClick={() => navigate("/coding/practice")}
            className="text-slate-400 hover:text-white transition"
          >
            ← Back to Practice
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">My Submissions</h2>

        {isLoading ? (
          <p className="text-slate-400">Loading...</p>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">💻</div>
            <p className="text-slate-400 mb-4">No submissions yet</p>
            <button
              onClick={() => navigate("/coding/practice")}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700
                         rounded-lg font-medium transition"
            >
              Start Practicing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub: any) => (
              <div
                key={sub.id}
                className="bg-dark-800 rounded-xl p-6
                           border border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {sub.problemTitle}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-400">{sub.language}</span>
                      <span className="text-slate-600">•</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs
                        ${
                          sub.difficulty === "EASY"
                            ? "bg-green-500/20 text-green-400"
                            : sub.difficulty === "MEDIUM"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {sub.difficulty}
                      </span>
                      <span className="text-slate-400">
                        {sub.submittedAt?.split("T")[0]}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full
                                   text-sm font-medium
                    ${
                      sub.status === "ACCEPTED"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {sub.status === "ACCEPTED"
                      ? "✅ Accepted"
                      : "❌ Wrong Answer"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsPage;
