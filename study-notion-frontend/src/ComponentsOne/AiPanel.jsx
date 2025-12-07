// src/ComponentsOne/AiPanel.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiHelpCircle,
  FiSend,
  FiTrash2,
  FiCopy,
  FiAlertCircle,
} from "react-icons/fi";
import { aiChat } from "../utils/api";
import { toast } from "react-toastify";

function getUserId() {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.id || "anon";
  } catch {
    return "anon";
  }
}

export default function AiPanel() {
  const userId = getUserId();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e?.preventDefault?.();
    const q = question.trim();
    if (!q) {
      toast.error("Please type your doubt first");
      return;
    }

    setLoading(true);
    setAnswer("");
    try {
      const res = await aiChat({ userId, question: q });
      if (res?.answer) {
        setAnswer(res.answer);
      } else if (res?.error) {
        toast.error(res.error || "Server / AI error");
      } else {
        toast.error("No answer received");
      }
    } catch (err) {
      console.error("AI error", err);
      toast.error("Server / AI error — check backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
  };

  const handleCopy = async () => {
    if (!answer) {
      toast.error("Nothing to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(answer);
      toast.success("Answer copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <motion.section
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 shadow-[0_0_36px_rgba(8,47,73,0.6)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300">
            <FiHelpCircle />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-semibold text-slate-100">
              AI Doubt Solver
            </h2>
            <p className="text-[11px] text-slate-400">
              Ask anything from DSA, Web Dev, or your college subjects.
            </p>
          </div>
        </div>
      </div>

      {/* Input area */}
     <form onSubmit={handleAsk} className="space-y-3">

  <textarea
    rows={5}   // height increased
    value={question}
    onChange={(e) => setQuestion(e.target.value)}
    placeholder="Example: Explain binary search in simple language with C++ example..."
    className="w-full rounded-2xl bg-slate-950/80 border border-slate-700 px-3 py-3 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
  />

  <div className="flex items-center justify-end gap-2">
    
    {question.trim() && (
      <button
        type="button"
        onClick={handleClear}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition"
      >
        <FiTrash2 size={12} /> Clear
      </button>
    )}

    <button
      type="submit"
      disabled={loading}
      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-[11px] md:text-xs font-semibold bg-gradient-to-r from-indigo-400 to-cyan-400 text-slate-900 hover:brightness-110 active:scale-95 disabled:opacity-60 transition"
    >
      {loading ? (
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          Thinking...
        </span>
      ) : (
        <>
          <FiSend size={13} /> Ask doubt
        </>
      )}
    </button>

  </div>

</form>


      {/* Answer area */}
      <div className="mt-4">
        {!answer && !loading && (
          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-950/70 border border-dashed border-slate-700 rounded-xl px-3 py-2">
            <FiAlertCircle />
            Ask a question above, answer will appear here.
          </div>
        )}

        {loading && (
          <div className="mt-2 space-y-2">
            <div className="animate-pulse h-3 bg-slate-800 rounded w-5/6" />
            <div className="animate-pulse h-3 bg-slate-800 rounded w-4/6" />
            <div className="animate-pulse h-3 bg-slate-800 rounded w-3/5" />
          </div>
        )}

        {answer && !loading && (
          <motion.div
            className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3 text-xs md:text-sm text-slate-100 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Answer generated by AI
              </p>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-emerald-300"
              >
                <FiCopy size={11} />
                Copy
              </button>
            </div>
            {answer}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
