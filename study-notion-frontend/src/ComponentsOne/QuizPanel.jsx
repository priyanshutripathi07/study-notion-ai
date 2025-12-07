import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiZap,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiRotateCcw,
} from "react-icons/fi";
import { aiQuiz } from "../utils/api";
import { toast } from "react-toastify";

function getUserId() {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.id || "anon";
  } catch {
    return "anon";
  }
}

export default function QuizPanel() {
  const userId = getUserId();
  const [topic, setTopic] = useState("");
  const [num, setNum] = useState(4);
  const [quiz, setQuiz] = useState([]); // [{q, options, answer}]
  const [selected, setSelected] = useState({}); // {index: optionIndex}
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);

  const handleGenerate = async (e) => {
    e?.preventDefault?.();
    const t = topic.trim();
    if (!t) {
      toast.error("Enter a topic first");
      return;
    }
    setLoading(true);
    setQuiz([]);
    setSelected({});
    setShowResult(false);
    setScore(null);

    try {
      const res = await aiQuiz({ topic: t, num, userId });
      if (res?.quiz && Array.isArray(res.quiz)) {
        setQuiz(res.quiz);
        toast.success("Quiz generated");
      } else if (Array.isArray(res)) {
        setQuiz(res);
        toast.success("Quiz generated");
      } else {
        toast.error("Quiz format invalid — check backend");
      }
    } catch (err) {
      console.error("Quiz error", err);
      toast.error("Server / AI error while creating quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIdx, optIdx) => {
    if (showResult) return;
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = () => {
    if (!quiz.length) return;
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selected[idx] === q.answer) correct++;
    });
    setScore(correct);
    setShowResult(true);
  };

  const handleRetry = () => {
    setSelected({});
    setShowResult(false);
    setScore(null);
  };

  return (
    <motion.section
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 shadow-[0_0_36px_rgba(30,64,175,0.45)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.03 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300">
            <FiBookOpen />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-semibold text-slate-100">
              Quiz Generator
            </h2>
            <p className="text-[11px] text-slate-400">
              Get multiple-choice questions for quick revision.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleGenerate}
        className="flex flex-col sm:flex-row gap-2 mb-3"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic (e.g. Array basics in C++)"
          className="flex-1 rounded-xl bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
        />
        <select
          value={num}
          onChange={(e) => setNum(Number(e.target.value))}
          className="rounded-xl bg-slate-950/80 border border-slate-700 px-2 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
        >
          <option value={3}>3 Qs</option>
          <option value={4}>4 Qs</option>
          <option value={5}>5 Qs</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-violet-400 to-indigo-400 text-slate-900 text-xs md:text-sm font-semibold px-3 py-2 hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FiZap />
              Generate quiz
            </>
          )}
        </button>
      </form>

      {/* Score banner */}
      {showResult && score !== null && quiz.length > 0 && (
        <motion.div
          className="mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 px-3 py-2 text-xs md:text-sm text-emerald-200 flex items-center justify-between gap-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="flex items-center gap-2">
            {score === quiz.length ? (
              <FiCheckCircle className="text-emerald-300" />
            ) : (
              <FiAlertCircle className="text-amber-300" />
            )}
            <span>
              You scored{" "}
              <span className="font-semibold">
                {score}/{quiz.length}
              </span>
              .{" "}
              {score === quiz.length ? "Perfect! 🔥" : "Revise and try again."}
            </span>
          </span>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1 text-[11px] text-slate-200 hover:text-emerald-300"
          >
            <FiRotateCcw />
            Retry
          </button>
        </motion.div>
      )}

      {/* Quiz list */}
      {!loading && quiz.length === 0 && (
        <p className="text-[11px] text-slate-500">
          Enter a topic and click <b>Generate quiz</b> to start practising.
        </p>
      )}

      <div className="space-y-3 mt-1">
        {quiz.map((q, qIdx) => (
          <motion.div
            key={qIdx}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-xs md:text-sm text-slate-100 font-medium">
                Q{qIdx + 1}. {q.q || q.question}
              </p>
            </div>

            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options?.map((opt, optIdx) => {
                const correctIdx = q.answer;
                const isSelected = selected[qIdx] === optIdx;
                let classes =
                  "w-full text-left text-[11px] md:text-xs px-3 py-2 rounded-xl border transition-all ";

                if (!showResult) {
                  // before checking result
                  classes += isSelected
                    ? "border-violet-400 bg-violet-500/10 text-violet-100"
                    : "border-slate-700 bg-slate-900/60 text-slate-200 hover:border-violet-400 hover:bg-slate-800/70";
                } else {
                  // after result
                  if (optIdx === correctIdx) {
                    classes +=
                      "border-emerald-400 bg-emerald-500/15 text-emerald-100";
                  } else if (isSelected && optIdx !== correctIdx) {
                    classes +=
                      "border-red-400 bg-red-500/15 text-red-100 line-through";
                  } else {
                    classes +=
                      "border-slate-800 bg-slate-900/70 text-slate-300 opacity-80";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelect(qIdx, optIdx)}
                    className={classes}
                  >
                    {String.fromCharCode(65 + optIdx)}. {opt}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Check answers button */}
      {quiz.length > 0 && !loading && !showResult && (
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={handleCheck}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-emerald-400 text-slate-900 text-xs md:text-sm font-semibold hover:bg-emerald-300 active:scale-95 transition"
          >
            <FiCheckCircle />
            Check answers
          </button>
        </div>
      )}
    </motion.section>
  );
}