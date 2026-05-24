import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import {
  codingPracticeService,
  CodingProblem,
  CodeEvaluation,
} from "../../services/codingService";

const DSAPractice: React.FC = () => {
  const navigate = useNavigate();

  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("EASY");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [code, setCode] = useState("");
  const [evaluation, setEvaluation] = useState<CodeEvaluation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "result">("problem");

  const topics = [
    {
      name: "Arrays",
      icon: "📊",
      description: "Array manipulation & searching",
    },
    {
      name: "Strings",
      icon: "🔤",
      description: "String operations & patterns",
    },
    {
      name: "Linked List",
      icon: "🔗",
      description: "Node traversal & manipulation",
    },
    {
      name: "Stack & Queue",
      icon: "📚",
      description: "LIFO & FIFO operations",
    },
    { name: "Trees", icon: "🌳", description: "Binary trees & traversals" },
    { name: "Graphs", icon: "🕸️", description: "BFS, DFS & shortest paths" },
    {
      name: "Dynamic Programming",
      icon: "⚡",
      description: "Optimization problems",
    },
    { name: "Sorting", icon: "🔄", description: "Sorting algorithms" },
    {
      name: "Binary Search",
      icon: "🔍",
      description: "Divide & conquer search",
    },
    { name: "Recursion", icon: "🌀", description: "Recursive problem solving" },
    { name: "Hashing", icon: "🗂️", description: "Hash maps & sets" },
    { name: "Two Pointers", icon: "👆", description: "Pointer manipulation" },
  ];

  const difficulties = [
    {
      value: "EASY",
      label: "Easy",
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500",
    },
    {
      value: "MEDIUM",
      label: "Medium",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500",
    },
    {
      value: "HARD",
      label: "Hard",
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500",
    },
  ];

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "typescript", label: "TypeScript" },
    { value: "cpp", label: "C++" },
  ];

  const handleGenerateProblem = async () => {
    if (!selectedTopic) {
      toast.error("Please select a topic first");
      return;
    }
    setIsGenerating(true);
    setEvaluation(null);
    setActiveTab("problem");
    try {
      const result = await codingPracticeService.generateProblem(
        selectedTopic,
        selectedDifficulty,
      );
      setProblem(result);
      setCode(
        result.starterCode?.[
          selectedLanguage as keyof typeof result.starterCode
        ] || "// Write your solution here\n",
      );
      toast.success("Problem generated!");
    } catch (error) {
      toast.error("Failed to generate problem. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (problem?.starterCode) {
      setCode(
        problem.starterCode[lang as keyof typeof problem.starterCode] ||
          "// Write your solution here\n",
      );
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast.error("Please write your solution first");
      return;
    }
    if (!problem) {
      toast.error("No problem loaded");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await codingPracticeService.submitCode(
        code,
        selectedLanguage,
        problem.description,
        selectedTopic,
        selectedDifficulty,
      );
      setEvaluation(result);
      setActiveTab("result");
      if (result.isCorrect) {
        toast.success("✅ Solution Accepted!");
      } else {
        toast.error("❌ Wrong Answer - Check feedback");
      }
    } catch (error) {
      toast.error("Failed to evaluate code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Navbar */}
      <nav className="bg-dark-800 border-b border-slate-700 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-primary-500">
              Interview Platform
            </h1>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-medium">DSA Practice</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/coding/submissions")}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600
                         rounded-lg text-sm transition"
            >
              My Submissions
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-slate-400 hover:text-white transition text-sm"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </nav>

      {!problem ? (
        /* Topic Selection Screen */
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">💻</div>
            <h2 className="text-3xl font-bold text-white mb-3">DSA Practice</h2>
            <p className="text-slate-400">
              Select a topic and difficulty to get a LeetCode-style coding
              problem
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select Difficulty
            </h3>
            <div className="flex gap-4">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDifficulty(d.value)}
                  className={`flex-1 py-3 rounded-xl border-2 font-semibold
                              transition ${d.color}
                              ${
                                selectedDifficulty === d.value
                                  ? d.bg
                                  : "border-slate-700 bg-transparent"
                              }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Select Topic
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic.name}
                  onClick={() => setSelectedTopic(topic.name)}
                  className={`p-4 rounded-xl border-2 text-left
                              transition group
                              ${
                                selectedTopic === topic.name
                                  ? "border-primary-500 bg-primary-500/10"
                                  : "border-slate-700 bg-dark-800 hover:border-slate-500"
                              }`}
                >
                  <div className="text-2xl mb-2">{topic.icon}</div>
                  <p
                    className={`font-semibold text-sm
                                 ${
                                   selectedTopic === topic.name
                                     ? "text-primary-400"
                                     : "text-white"
                                 }`}
                  >
                    {topic.name}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {topic.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateProblem}
            disabled={!selectedTopic || isGenerating}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700
                       text-white font-bold rounded-xl transition
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-lg"
          >
            {isGenerating
              ? "🤖 Generating Problem..."
              : selectedTopic
                ? `🚀 Generate ${selectedDifficulty} ${selectedTopic} Problem`
                : "Select a topic to continue"}
          </button>
        </div>
      ) : (
        /* Problem + Editor Screen */
        <div className="flex h-[calc(100vh-57px)]">
          {/* Left Panel — Problem */}
          <div
            className="w-2/5 flex flex-col border-r border-slate-700
                          overflow-hidden"
          >
            {/* Problem Header */}
            <div className="p-4 border-b border-slate-700 bg-dark-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 bg-slate-700
                                   rounded text-xs text-slate-300"
                  >
                    {selectedTopic}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs
                                   font-medium
                    ${
                      selectedDifficulty === "EASY"
                        ? "bg-green-500/20 text-green-400"
                        : selectedDifficulty === "MEDIUM"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {selectedDifficulty}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setProblem(null);
                    setEvaluation(null);
                    setCode("");
                  }}
                  className="text-slate-400 hover:text-white
                             text-sm transition"
                >
                  ← New Problem
                </button>
              </div>
              <h2 className="text-lg font-bold text-white">{problem.title}</h2>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab("problem")}
                className={`px-4 py-2 text-sm font-medium transition
                           ${
                             activeTab === "problem"
                               ? "text-primary-400 border-b-2 border-primary-400"
                               : "text-slate-400 hover:text-white"
                           }`}
              >
                Problem
              </button>
              {evaluation && (
                <button
                  onClick={() => setActiveTab("result")}
                  className={`px-4 py-2 text-sm font-medium transition
                             ${
                               activeTab === "result"
                                 ? "text-primary-400 border-b-2 border-primary-400"
                                 : "text-slate-400 hover:text-white"
                             }`}
                >
                  Result
                  {evaluation.isCorrect ? " ✅" : " ❌"}
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "problem" ? (
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <p
                      className="text-slate-300 text-sm
                                  leading-relaxed whitespace-pre-wrap"
                    >
                      {problem.description}
                    </p>
                  </div>

                  {/* Examples */}
                  {problem.examples?.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-dark-900 rounded-lg p-4
                                 border border-slate-700"
                    >
                      <p
                        className="text-slate-400 text-xs
                                    font-medium mb-2"
                      >
                        Example {i + 1}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm font-mono">
                          <span className="text-slate-400">Input: </span>
                          <span className="text-green-400">{ex.input}</span>
                        </p>
                        <p className="text-sm font-mono">
                          <span className="text-slate-400">Output: </span>
                          <span className="text-blue-400">{ex.output}</span>
                        </p>
                        {ex.explanation && (
                          <p className="text-xs text-slate-500 mt-1">
                            {ex.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Constraints */}
                  {problem.constraints?.length > 0 && (
                    <div>
                      <p
                        className="text-slate-400 text-xs
                                    font-medium mb-2"
                      >
                        Constraints
                      </p>
                      <ul className="space-y-1">
                        {problem.constraints.map((c, i) => (
                          <li
                            key={i}
                            className="text-slate-300 text-sm
                                       flex gap-2"
                          >
                            <span className="text-slate-500">•</span>
                            <code className="font-mono text-xs">{c}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Hints */}
                  {problem.hints?.length > 0 && (
                    <div>
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="text-primary-400 text-sm
                                   hover:text-primary-300 transition"
                      >
                        {showHints ? "🙈 Hide Hints" : "💡 Show Hints"}
                      </button>
                      {showHints && (
                        <ul className="mt-2 space-y-1">
                          {problem.hints.map((h, i) => (
                            <li
                              key={i}
                              className="text-slate-300 text-sm
                                         flex gap-2"
                            >
                              <span className="text-yellow-400">{i + 1}.</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                evaluation && (
                  /* Result Tab */
                  <div className="space-y-4">
                    {/* Score */}
                    <div
                      className="text-center p-6 bg-dark-900
                                  rounded-xl border border-slate-700"
                    >
                      <div
                        className={`text-5xl font-bold mb-2
                                     ${getScoreColor(evaluation.score)}`}
                      >
                        {evaluation.score}
                      </div>
                      <p
                        className={`text-lg font-semibold
                                   ${
                                     evaluation.isCorrect
                                       ? "text-green-400"
                                       : "text-red-400"
                                   }`}
                      >
                        {evaluation.isCorrect
                          ? "✅ Accepted"
                          : "❌ Wrong Answer"}
                      </p>
                    </div>

                    {/* Complexity */}
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="bg-dark-900 rounded-lg p-3
                                    border border-slate-700 text-center"
                      >
                        <p className="text-slate-400 text-xs mb-1">
                          Time Complexity
                        </p>
                        <p className="text-white font-mono font-semibold">
                          {evaluation.timeComplexity}
                        </p>
                      </div>
                      <div
                        className="bg-dark-900 rounded-lg p-3
                                    border border-slate-700 text-center"
                      >
                        <p className="text-slate-400 text-xs mb-1">
                          Space Complexity
                        </p>
                        <p className="text-white font-mono font-semibold">
                          {evaluation.spaceComplexity}
                        </p>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <p
                        className="text-slate-400 text-xs
                                  font-medium mb-2"
                      >
                        Feedback
                      </p>
                      <p
                        className="text-slate-300 text-sm
                                  leading-relaxed"
                      >
                        {evaluation.feedback}
                      </p>
                    </div>

                    {/* Issues */}
                    {evaluation.issues?.length > 0 && (
                      <div>
                        <p
                          className="text-red-400 text-xs
                                    font-medium mb-2"
                        >
                          ❌ Issues
                        </p>
                        <ul className="space-y-1">
                          {evaluation.issues.map((issue, i) => (
                            <li
                              key={i}
                              className="text-slate-300 text-sm
                                       flex gap-2"
                            >
                              <span className="text-red-400">•</span>
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {evaluation.suggestions?.length > 0 && (
                      <div>
                        <p
                          className="text-yellow-400 text-xs
                                    font-medium mb-2"
                        >
                          💡 Suggestions
                        </p>
                        <ul className="space-y-1">
                          {evaluation.suggestions.map((s, i) => (
                            <li
                              key={i}
                              className="text-slate-300 text-sm
                                       flex gap-2"
                            >
                              <span className="text-yellow-400">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Optimized Approach */}
                    {evaluation.optimizedApproach && (
                      <div
                        className="bg-dark-900 rounded-lg p-4
                                    border border-primary-500/30"
                      >
                        <p
                          className="text-primary-400 text-xs
                                    font-medium mb-2"
                        >
                          🚀 Optimized Approach
                        </p>
                        <p className="text-slate-300 text-sm">
                          {evaluation.optimizedApproach}
                        </p>
                      </div>
                    )}

                    {/* Try Again */}
                    <button
                      onClick={handleGenerateProblem}
                      className="w-full py-3 bg-primary-600
                               hover:bg-primary-700 rounded-lg
                               font-semibold transition text-sm"
                    >
                      🔄 New Problem
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Panel — Code Editor */}
          <div className="flex-1 flex flex-col">
            {/* Editor Header */}
            <div
              className="flex items-center justify-between
                            px-4 py-2 bg-dark-800
                            border-b border-slate-700"
            >
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    className={`px-3 py-1 rounded text-xs
                                font-medium transition
                                ${
                                  selectedLanguage === lang.value
                                    ? "bg-primary-600 text-white"
                                    : "text-slate-400 hover:text-white"
                                }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 hover:bg-green-700
                           text-white font-semibold rounded-lg
                           text-sm transition
                           disabled:opacity-50
                           disabled:cursor-not-allowed"
              >
                {isSubmitting ? "⏳ Running..." : "▶ Run & Submit"}
              </button>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  tabSize: 2,
                  lineNumbers: "on",
                  folding: true,
                  bracketPairColorization: { enabled: true },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSAPractice;
