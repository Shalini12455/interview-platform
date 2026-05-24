import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  interviewService,
  Question,
  AnswerEvaluation,
} from "../../services/interviewService";

const InterviewSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { interview, jobRole } = location.state || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (!interview) {
      navigate("/interview/setup");
      return;
    }
    try {
      const parsed = JSON.parse(interview.questionsJson);
      setQuestions(parsed);
    } catch {
      toast.error("Failed to load questions");
      navigate("/interview/setup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview]);

  const currentQuestion = questions[currentIndex];

  const handleEvaluate = async () => {
    if (!answer.trim()) {
      toast.error("Please write your answer first");
      return;
    }
    setIsEvaluating(true);
    try {
      const result = await interviewService.evaluateAnswer(
        interview.id,
        currentQuestion.question,
        answer,
        jobRole,
      );
      console.log("Evaluation result:", result);
      if (result && result.score !== undefined) {
        setEvaluation(result);
        setShowEvaluation(true);
        setAllScores([...allScores, result.score]);
      } else {
        toast.error("Invalid evaluation response");
      }
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error("Failed to evaluate answer");
    } finally {
      setIsEvaluating(false);
    }
  };
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswer("");
      setEvaluation(null);
      setShowEvaluation(false);
      setShowHints(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const avgScore =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;
    try {
      await interviewService.completeInterview(
        interview.id,
        JSON.stringify(allScores),
        avgScore,
      );
      setIsComplete(true);
    } catch {
      toast.error("Failed to save interview results");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      Excellent: "bg-green-500/20 text-green-400 border-green-500",
      Good: "bg-blue-500/20 text-blue-400 border-blue-500",
      Average: "bg-yellow-500/20 text-yellow-400 border-yellow-500",
      Poor: "bg-red-500/20 text-red-400 border-red-500",
    };
    return colors[rating] || "bg-slate-500/20 text-slate-400 border-slate-500";
  };

  // Completion Screen
  if (isComplete) {
    const avgScore =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="text-6xl mb-6">
            {avgScore >= 80 ? "🏆" : avgScore >= 60 ? "👍" : "💪"}
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Interview Complete!
          </h2>
          <div className="bg-dark-800 rounded-2xl p-8 border border-slate-700 mb-6">
            <p className="text-slate-400 mb-2">Your Average Score</p>
            <p className={`text-6xl font-bold mb-4 ${getScoreColor(avgScore)}`}>
              {avgScore}
            </p>
            <p className="text-slate-300">
              {avgScore >= 80
                ? "Excellent performance! You are interview ready."
                : avgScore >= 60
                  ? "Good job! Keep practicing to improve."
                  : "Keep practicing! You will get better."}
            </p>

            {/* Question Scores */}
            <div className="mt-6 space-y-2">
              {allScores.map((score, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    Question {i + 1}
                  </span>
                  <span className={`font-semibold ${getScoreColor(score)}`}>
                    {score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/interview/setup")}
              className="flex-1 py-3 bg-primary-600 hover:bg-primary-700
                         rounded-lg font-semibold transition"
            >
              New Interview
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 bg-slate-700 hover:bg-slate-600
                         rounded-lg font-semibold transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <nav className="bg-dark-800 border-b border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-white">{interview?.title}</h1>
            <p className="text-slate-400 text-sm">{jobRole}</p>
          </div>
          {/* Progress */}
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <div className="w-32 h-2 bg-slate-700 rounded-full">
              <div
                className="h-2 bg-primary-500 rounded-full transition-all"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Question */}
          <div className="space-y-4">
            {/* Question Card */}
            <div className="bg-dark-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="px-2 py-1 bg-primary-500/20 text-primary-400
                                 rounded text-xs font-medium"
                >
                  {currentQuestion.category}
                </span>
                <span
                  className="px-2 py-1 bg-slate-700 text-slate-300
                                 rounded text-xs"
                >
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h3 className="text-lg font-medium text-white leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Hints */}
              <button
                onClick={() => setShowHints(!showHints)}
                className="mt-4 text-sm text-primary-400 hover:text-primary-300 transition"
              >
                {showHints ? "🙈 Hide Hints" : "💡 Show Hints"}
              </button>
              {showHints && (
                <ul className="mt-3 space-y-1">
                  {currentQuestion.hints?.map((hint, i) => (
                    <li key={i} className="text-slate-400 text-sm flex gap-2">
                      <span className="text-yellow-400">•</span>
                      {hint}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Answer Box */}
            <div className="bg-dark-800 rounded-xl p-6 border border-slate-700">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Your Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={showEvaluation}
                rows={8}
                placeholder="Type your answer here in detail..."
                className="w-full px-4 py-3 bg-dark-900 border border-slate-600
                           rounded-lg text-white placeholder-slate-500
                           focus:outline-none focus:border-primary-500 transition
                           resize-none disabled:opacity-60"
              />
              {!showEvaluation && (
                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !answer.trim()}
                  className="mt-4 w-full py-3 bg-primary-600 hover:bg-primary-700
                             text-white font-semibold rounded-lg transition
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEvaluating ? "🤖 Evaluating..." : "✅ Submit Answer"}
                </button>
              )}
            </div>
          </div>

          {/* Right — Evaluation */}
          <div>
            {showEvaluation && evaluation ? (
              <div className="bg-dark-800 rounded-xl p-6 border border-slate-700 space-y-4">
                <h3 className="font-semibold text-white text-lg">
                  AI Evaluation
                </h3>

                {/* Score */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-5xl font-bold ${getScoreColor(evaluation.score)}`}
                  >
                    {evaluation.score}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full border text-sm font-medium
                                   ${getRatingColor(evaluation.rating)}`}
                  >
                    {evaluation.rating}
                  </span>
                </div>

                {/* Feedback */}
                <div>
                  <p className="text-sm text-slate-400 mb-1">Feedback</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {evaluation.feedback}
                  </p>
                </div>

                {/* Strengths */}
                {evaluation.strengths?.length > 0 && (
                  <div>
                    <p className="text-sm text-green-400 font-medium mb-2">
                      ✅ Strengths
                    </p>
                    <ul className="space-y-1">
                      {evaluation.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-slate-300 text-sm flex gap-2"
                        >
                          <span className="text-green-400">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {evaluation.improvements?.length > 0 && (
                  <div>
                    <p className="text-sm text-yellow-400 font-medium mb-2">
                      🔧 Improvements
                    </p>
                    <ul className="space-y-1">
                      {evaluation.improvements.map((imp, i) => (
                        <li
                          key={i}
                          className="text-slate-300 text-sm flex gap-2"
                        >
                          <span className="text-yellow-400">•</span>
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample Answer */}
                {evaluation.sampleAnswer && (
                  <div className="bg-dark-900 rounded-lg p-4 border border-slate-600">
                    <p className="text-sm text-primary-400 font-medium mb-2">
                      💡 Ideal Answer
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {evaluation.sampleAnswer}
                    </p>
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="w-full py-3 bg-green-600 hover:bg-green-700
                             text-white font-semibold rounded-lg transition"
                >
                  {currentIndex < questions.length - 1
                    ? "→ Next Question"
                    : "🏁 Finish Interview"}
                </button>
              </div>
            ) : (
              <div
                className="bg-dark-800 rounded-xl p-6 border border-slate-700
                              flex flex-col items-center justify-center h-64"
              >
                <div className="text-4xl mb-4">🤖</div>
                <p className="text-slate-400 text-center">
                  Submit your answer and I will evaluate it instantly
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
