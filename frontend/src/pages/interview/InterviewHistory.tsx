import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { interviewService } from "../../services/interviewService";

const InterviewHistory: React.FC = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await interviewService.getMyInterviews();
        setInterviews(data);
      } catch {
        console.error("Failed to fetch interviews");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      COMPLETED: "bg-green-500/20 text-green-400",
      IN_PROGRESS: "bg-blue-500/20 text-blue-400",
      PENDING: "bg-yellow-500/20 text-yellow-400",
      CANCELLED: "bg-red-500/20 text-red-400",
    };
    return styles[status] || "bg-slate-500/20 text-slate-400";
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">My Interviews</h2>
          <button
            onClick={() => navigate("/interview/setup")}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700
                       rounded-lg text-sm font-medium transition"
          >
            + New Interview
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-400 py-12">
            Loading interviews...
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-slate-400 mb-4">
              No interviews yet. Start your first one!
            </p>
            <button
              onClick={() => navigate("/interview/setup")}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700
                         rounded-lg font-medium transition"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-dark-800 rounded-xl p-6 border border-slate-700
                           hover:border-slate-600 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {interview.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">
                        {interview.type}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-sm">
                        {interview.createdAt?.split("T")[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {interview.score !== null && (
                      <span
                        className={`text-2xl font-bold
                                       ${getScoreColor(interview.score)}`}
                      >
                        {interview.score}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                                     ${getStatusBadge(interview.status)}`}
                    >
                      {interview.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
