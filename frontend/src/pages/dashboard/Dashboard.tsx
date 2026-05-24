import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = React.useState({
    interviewsCompleted: 0,
    averageScore: 0,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl =
          process.env.REACT_APP_API_URL || "http://localhost:8080/api";
        const response = await fetch(`${apiUrl}/interviews/my-interviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const interviews = await response.json();
        const completed = interviews.filter(
          (i: any) => i.status === "COMPLETED",
        );
        const avgScore =
          completed.length > 0
            ? Math.round(
                completed.reduce(
                  (sum: number, i: any) => sum + (i.score || 0),
                  0,
                ) / completed.length,
              )
            : 0;
        setStats({
          interviewsCompleted: completed.length,
          averageScore: avgScore,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);
  const handleLogout = () => {
    logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="bg-dark-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-500">
            Interview Platform
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600
                         rounded-lg text-sm transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Welcome back, {user?.firstName}! 👋
          </h2>
          <p className="text-slate-400 mt-2">
            Ready to practice your interview skills today?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Interviews Completed</p>
            <p className="text-3xl font-bold text-primary-500 mt-2">
              {stats.interviewsCompleted}
            </p>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Problems Solved</p>
            <p className="text-3xl font-bold text-green-500 mt-2">0</p>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-slate-700">
            <p className="text-slate-400 text-sm">Average Score</p>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {stats.averageScore > 0 ? stats.averageScore : "-"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Mock Interview */}
          <div
            onClick={() => navigate("/interview/setup")}
            className="bg-dark-800 rounded-xl p-6 border border-slate-700
                        hover:border-primary-500 transition cursor-pointer
                        group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">🤖</div>
              <div>
                <h3
                  className="text-lg font-semibold text-white mb-2
                               group-hover:text-primary-400 transition"
                >
                  AI Mock Interview
                </h3>
                <p className="text-slate-400 text-sm">
                  Practice with AI-generated interview questions tailored to
                  your job role and difficulty level
                </p>
                <span
                  className="inline-block mt-3 text-primary-500
                                 text-sm font-medium"
                >
                  Start Practice →
                </span>
              </div>
            </div>
          </div>

          {/* Interview History */}
          <div
            onClick={() => navigate("/interview/history")}
            className="bg-dark-800 rounded-xl p-6 border border-slate-700
                        hover:border-green-500 transition cursor-pointer
                        group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📋</div>
              <div>
                <h3
                  className="text-lg font-semibold text-white mb-2
                               group-hover:text-green-400 transition"
                >
                  Interview History
                </h3>
                <p className="text-slate-400 text-sm">
                  Review all your past interview sessions, scores, and AI
                  feedback
                </p>
                <span
                  className="inline-block mt-3 text-green-500
                                 text-sm font-medium"
                >
                  View History →
                </span>
              </div>
            </div>
          </div>

          {/* Resume Analysis */}
          <div
            onClick={() => navigate("/resume")}
            className="bg-dark-800 rounded-xl p-6 border border-slate-700
                        hover:border-yellow-500 transition cursor-pointer
                        group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📄</div>
              <div>
                <h3
                  className="text-lg font-semibold text-white mb-2
                               group-hover:text-yellow-400 transition"
                >
                  Resume Analysis
                </h3>
                <p className="text-slate-400 text-sm">
                  Upload your resume and get ATS score, missing keywords, and
                  improvement suggestions
                </p>
                <span
                  className="inline-block mt-3 text-yellow-500
                                 text-sm font-medium"
                >
                  Analyze Resume →
                </span>
              </div>
            </div>
          </div>

          {/* My Progress */}
          <div
            onClick={() => navigate("/analytics")}
            className="bg-dark-800 rounded-xl p-6 border border-slate-700
                        hover:border-purple-500 transition cursor-pointer
                        group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <h3
                  className="text-lg font-semibold text-white mb-2
                               group-hover:text-purple-400 transition"
                >
                  My Progress
                </h3>
                <p className="text-slate-400 text-sm">
                  View your performance analytics, score trends, and coding
                  streaks over time
                </p>
                <span
                  className="inline-block mt-3 text-purple-500
                                 text-sm font-medium"
                >
                  View Analytics →
                </span>
              </div>
            </div>
          </div>

          {/* Coding Practice */}
          <div
            onClick={() => navigate("/coding")}
            className="bg-dark-800 rounded-xl p-6 border border-slate-700
                        hover:border-orange-500 transition cursor-pointer
                        group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">💻</div>
              <div>
                <h3
                  className="text-lg font-semibold text-white mb-2
                               group-hover:text-orange-400 transition"
                >
                  Coding Practice
                </h3>
                <p className="text-slate-400 text-sm">
                  Solve coding problems with our online editor supporting
                  multiple languages
                </p>
                <span
                  className="inline-block mt-3 text-orange-500
                                 text-sm font-medium"
                >
                  Start Coding →
                </span>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div
            className="bg-dark-800 rounded-xl p-6 border border-slate-700
                        hover:border-slate-500 transition cursor-pointer
                        group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">👤</div>
              <div>
                <h3
                  className="text-lg font-semibold text-white mb-2
                               group-hover:text-slate-300 transition"
                >
                  My Profile
                </h3>
                <p className="text-slate-400 text-sm">
                  Update your profile, bio, and account settings
                </p>
                <div className="mt-3 space-y-1">
                  <p className="text-slate-300 text-sm">{user?.email}</p>
                  <span
                    className="inline-block px-2 py-0.5 bg-primary-500/20
                                   text-primary-400 rounded text-xs font-medium"
                  >
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
