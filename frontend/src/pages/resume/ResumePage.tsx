import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { resumeService, ResumeAnalysis } from "../../services/resumeService";

const ResumePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const jobRoles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Product Manager",
  ];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await resumeService.getMyResumes();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch resume history");
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF files are supported");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    setFile(selectedFile);
    setAnalysis(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select a PDF file first");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await resumeService.analyzeResume(file, jobRole);
      setAnalysis(result);
      fetchHistory();
      toast.success("Resume analyzed successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to analyze resume");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseJsonArray = (jsonStr: string): string[] => {
    try {
      return JSON.parse(jsonStr) || [];
    } catch {
      return [];
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "🏆 Excellent";
    if (score >= 60) return "👍 Good";
    if (score >= 40) return "⚠️ Average";
    return "❌ Needs Work";
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            📄 Resume Analysis
          </h2>
          <p className="text-slate-400">
            Upload your resume and get instant ATS score, missing keywords, and
            improvement suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Upload Section */}
          <div className="space-y-6">
            {/* Job Role */}
            <div className="bg-dark-800 rounded-xl p-6 border border-slate-700">
              <label
                className="block text-sm font-medium
                               text-slate-300 mb-3"
              >
                Target Job Role
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-3 bg-dark-900 border
                           border-slate-600 rounded-lg text-white
                           focus:outline-none focus:border-primary-500
                           transition"
              >
                {jobRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div className="bg-dark-800 rounded-xl p-6 border border-slate-700">
              <label
                className="block text-sm font-medium
                               text-slate-300 mb-3"
              >
                Upload Resume (PDF only)
              </label>

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8
                            text-center cursor-pointer transition
                            ${
                              isDragging
                                ? "border-primary-500 bg-primary-500/10"
                                : file
                                  ? "border-green-500 bg-green-500/10"
                                  : "border-slate-600 hover:border-slate-500"
                            }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileSelect(f);
                  }}
                />

                {file ? (
                  <div>
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-green-400 font-medium">{file.name}</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-4xl mb-3">📁</div>
                    <p className="text-white font-medium mb-1">
                      Drop your resume here
                    </p>
                    <p className="text-slate-400 text-sm">
                      or click to browse files
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                      PDF files only, max 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                className="mt-4 w-full py-4 bg-primary-600
                           hover:bg-primary-700 text-white font-semibold
                           rounded-xl transition disabled:opacity-50
                           disabled:cursor-not-allowed text-lg"
              >
                {isAnalyzing ? "🤖 Analyzing Resume..." : "🚀 Analyze Resume"}
              </button>
            </div>

            {/* Past Analyses */}
            {history.length > 0 && (
              <div
                className="bg-dark-800 rounded-xl p-6
                              border border-slate-700"
              >
                <h3 className="font-semibold text-white mb-4">Past Analyses</h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setAnalysis(item)}
                      className="flex items-center justify-between
                                 p-3 bg-dark-900 rounded-lg cursor-pointer
                                 hover:bg-slate-800 transition"
                    >
                      <div>
                        <p className="text-white text-sm font-medium">
                          {item.fileName}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {item.analyzedAt?.split("T")[0]}
                        </p>
                      </div>
                      <span
                        className={`text-lg font-bold
                                       ${getScoreColor(item.atsScore)}`}
                      >
                        {item.atsScore}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Analysis Results */}
          <div>
            {analysis ? (
              <div className="space-y-6">
                {/* ATS Score Card */}
                <div
                  className="bg-dark-800 rounded-xl p-6
                                border border-slate-700 text-center"
                >
                  <p className="text-slate-400 mb-2">ATS Score</p>
                  <div
                    className={`text-7xl font-bold mb-2
                                   ${getScoreColor(analysis.atsScore)}`}
                  >
                    {analysis.atsScore}
                  </div>
                  <p className="text-lg font-medium text-white mb-4">
                    {getScoreLabel(analysis.atsScore)}
                  </p>

                  {/* Score Bar */}
                  <div className="w-full h-3 bg-slate-700 rounded-full">
                    <div
                      className={`h-3 rounded-full transition-all
                                  ${getScoreBg(analysis.atsScore)}`}
                      style={{ width: `${analysis.atsScore}%` }}
                    />
                  </div>
                </div>

                {/* Skills Found */}
                {parseJsonArray(analysis.skills).length > 0 && (
                  <div
                    className="bg-dark-800 rounded-xl p-6
                                  border border-slate-700"
                  >
                    <h3 className="font-semibold text-green-400 mb-3">
                      ✅ Skills Detected
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parseJsonArray(analysis.skills).map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-500/20
                                     text-green-400 rounded-full text-sm
                                     border border-green-500/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {parseJsonArray(analysis.missingKeywords).length > 0 && (
                  <div
                    className="bg-dark-800 rounded-xl p-6
                                  border border-slate-700"
                  >
                    <h3 className="font-semibold text-red-400 mb-3">
                      ❌ Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {parseJsonArray(analysis.missingKeywords).map(
                        (keyword, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-red-500/20
                                     text-red-400 rounded-full text-sm
                                     border border-red-500/30"
                          >
                            {keyword}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {parseJsonArray(analysis.suggestions).length > 0 && (
                  <div
                    className="bg-dark-800 rounded-xl p-6
                                  border border-slate-700"
                  >
                    <h3 className="font-semibold text-yellow-400 mb-3">
                      💡 Improvement Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {parseJsonArray(analysis.suggestions).map(
                        (suggestion, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-slate-300
                                               text-sm"
                          >
                            <span className="text-yellow-400 mt-0.5">
                              {i + 1}.
                            </span>
                            {suggestion}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="bg-dark-800 rounded-xl p-12
                              border border-slate-700 text-center
                              flex flex-col items-center justify-center
                              h-96"
              >
                <div className="text-6xl mb-4">📊</div>
                <p className="text-white font-medium mb-2">No Analysis Yet</p>
                <p className="text-slate-400 text-sm">
                  Upload your resume and click Analyze to see your ATS score and
                  feedback
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
