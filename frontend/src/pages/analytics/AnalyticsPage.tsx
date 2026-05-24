import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  analyticsService,
  AnalyticsData,
} from "../../services/analyticsService";

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await analyticsService.getMyStats();
        setData(stats);
      } catch (error) {
        console.error("Failed to fetch analytics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-dark-900 flex items-center
                      justify-center text-white"
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-slate-400">Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="min-h-screen bg-dark-900 flex items-center
                      justify-center text-white"
      >
        <p className="text-slate-400">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="bg-dark-800 border-b border-slate-700 px-6 py-4">
        <div
          className="max-w-7xl mx-auto flex items-center
                        justify-between"
        >
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            📊 My Analytics
          </h2>
          <p className="text-slate-400">
            Track your interview performance and progress over time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className="bg-dark-800 rounded-xl p-5
                          border border-slate-700"
          >
            <p className="text-slate-400 text-sm mb-1">Total Interviews</p>
            <p className="text-3xl font-bold text-primary-400">
              {data.totalInterviews}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {data.completedInterviews} completed
            </p>
          </div>

          <div
            className="bg-dark-800 rounded-xl p-5
                          border border-slate-700"
          >
            <p className="text-slate-400 text-sm mb-1">Average Score</p>
            <p
              className={`text-3xl font-bold
                          ${getScoreColor(data.averageScore)}`}
            >
              {data.averageScore || "-"}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Best: {data.highestScore || "-"}
            </p>
          </div>

          <div
            className="bg-dark-800 rounded-xl p-5
                          border border-slate-700"
          >
            <p className="text-slate-400 text-sm mb-1">Resume Analyses</p>
            <p className="text-3xl font-bold text-yellow-400">
              {data.resumeCount}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Avg ATS: {data.averageAtsScore}
            </p>
          </div>

          <div
            className="bg-dark-800 rounded-xl p-5
                          border border-slate-700"
          >
            <p className="text-slate-400 text-sm mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-orange-400">
              {data.currentStreak} 🔥
            </p>
            <p className="text-slate-500 text-xs mt-1">Keep it up!</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score History Line Chart */}
          <div
            className="bg-dark-800 rounded-xl p-6
                          border border-slate-700"
          >
            <h3 className="font-semibold text-white mb-4">📈 Score History</h3>
            {data.scoreHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.scoreHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="h-64 flex items-center
                              justify-center"
              >
                <div className="text-center">
                  <p className="text-4xl mb-2">🎯</p>
                  <p className="text-slate-400 text-sm">
                    Complete interviews to see score history
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interviews by Type Pie Chart */}
          <div
            className="bg-dark-800 rounded-xl p-6
                          border border-slate-700"
          >
            <h3 className="font-semibold text-white mb-4">
              🍩 Interviews by Type
            </h3>
            {data.interviewsByType.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.interviewsByType.map((item) => ({
                      name: item.type,
                      value: item.count,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {data.interviewsByType.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="h-64 flex items-center
                              justify-center"
              >
                <div className="text-center">
                  <p className="text-4xl mb-2">🎯</p>
                  <p className="text-slate-400 text-sm">
                    Start interviews to see type breakdown
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Weekly Activity Bar Chart */}
          <div
            className="bg-dark-800 rounded-xl p-6
                          border border-slate-700"
          >
            <h3 className="font-semibold text-white mb-4">
              📅 Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Bar
                  dataKey="interviews"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Summary */}
          <div
            className="bg-dark-800 rounded-xl p-6
                          border border-slate-700"
          >
            <h3 className="font-semibold text-white mb-4">
              🏆 Performance Summary
            </h3>
            <div className="space-y-4">
              {/* Interview Completion Rate */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 text-sm">
                    Interview Completion Rate
                  </span>
                  <span className="text-white text-sm font-medium">
                    {data.totalInterviews > 0
                      ? Math.round(
                          (data.completedInterviews / data.totalInterviews) *
                            100,
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-primary-500 rounded-full"
                    style={{
                      width: `${
                        data.totalInterviews > 0
                          ? (data.completedInterviews / data.totalInterviews) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Average Score Bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 text-sm">Average Score</span>
                  <span className="text-white text-sm font-medium">
                    {data.averageScore}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${data.averageScore}%` }}
                  />
                </div>
              </div>

              {/* ATS Score Bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 text-sm">
                    Average ATS Score
                  </span>
                  <span className="text-white text-sm font-medium">
                    {data.averageAtsScore}/100
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-yellow-500 rounded-full"
                    style={{ width: `${data.averageAtsScore}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div
                className="grid grid-cols-2 gap-4 mt-4 pt-4
                              border-t border-slate-700"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-400">
                    {data.totalInterviews}
                  </p>
                  <p className="text-slate-400 text-xs">Total Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {data.highestScore || "-"}
                  </p>
                  <p className="text-slate-400 text-xs">Best Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Score History Table */}
        {data.scoreHistory.length > 0 && (
          <div
            className="bg-dark-800 rounded-xl p-6
                          border border-slate-700"
          >
            <h3 className="font-semibold text-white mb-4">
              📋 Recent Interview Results
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-slate-700">
                    <th
                      className="pb-3 text-slate-400
                                   text-sm font-medium"
                    >
                      Interview
                    </th>
                    <th
                      className="pb-3 text-slate-400
                                   text-sm font-medium"
                    >
                      Date
                    </th>
                    <th
                      className="pb-3 text-slate-400
                                   text-sm font-medium text-right"
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {data.scoreHistory.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-800/50
                                           transition"
                    >
                      <td className="py-3 text-white text-sm">{item.title}</td>
                      <td className="py-3 text-slate-400 text-sm">
                        {item.date}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`font-bold
                          ${getScoreColor(item.score)}`}
                        >
                          {item.score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA if no data */}
        {data.totalInterviews === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-3">No data yet!</h3>
            <p className="text-slate-400 mb-6">
              Complete some interviews to see your analytics here
            </p>
            <button
              onClick={() => navigate("/interview/setup")}
              className="px-6 py-3 bg-primary-600
                         hover:bg-primary-700 rounded-xl
                         font-semibold transition"
            >
              Start Your First Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
