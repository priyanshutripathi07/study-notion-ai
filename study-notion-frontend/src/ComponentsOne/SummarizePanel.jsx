// src/ComponentsOne/SummarizePanel.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiScissors,
  FiCopy,
  FiTrash2,
  FiSave,
} from "react-icons/fi";
import { aiSummarize } from "../utils/api";
import { toast } from "react-toastify";

function getUserId() {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.id || "anon";
  } catch {
    return "anon";
  }
}

export default function SummarizePanel() {
  const userId = getUserId();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async (e) => {
    e?.preventDefault?.();
    const t = text.trim();
    if (!t) {
      toast.error("Paste some text to summarize");
      return;
    }
    setLoading(true);
    setSummary("");
    try {
      const res = await aiSummarize({ userId, text: t });
      if (res?.summary || res?.answer) {
        setSummary(res.summary || res.answer);
        toast.success("Summary generated");
      } else if (res?.error) {
        toast.error(res.error || "AI summary error");
      } else {
        toast.error("No summary received");
      }
    } catch (err) {
      console.error("Summarize error", err);
      toast.error("Server / AI error while summarizing");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
  };

  const handleCopy = async () => {
    if (!summary) {
      toast.error("Nothing to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Summary copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  // optional: save summary as a note in studyNotes_v2 (same as Home)
  const handleSaveAsNote = () => {
    if (!summary.trim()) {
      toast.error("No summary to save");
      return;
    }
    try {
      const RAW_KEY = "studyNotes_v2";
      const userIdLocal = userId || "anon";
      let stored = null;
      try {
        stored = JSON.parse(localStorage.getItem(RAW_KEY));
      } catch {
        stored = null;
      }

      let all = stored && typeof stored === "object" ? stored : {};
      const mine = Array.isArray(all[userIdLocal]) ? all[userIdLocal] : [];

      const note = {
        id: Date.now().toString(),
        title: "Summary",
        content: summary.trim(),
        pinned: false,
        createdAt: Date.now(),
      };

      all[userIdLocal] = [note, ...mine];
      localStorage.setItem(RAW_KEY, JSON.stringify(all));
      toast.success("Summary saved in My Notes");
    } catch (e) {
      console.error("Save note error:", e);
      toast.error("Failed to save summary");
    }
  };

  return (
    <motion.section
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 shadow-[0_0_32px_rgba(8,47,73,0.6)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.06 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <FiFileText />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-semibold text-slate-100">
              Summarize Notes
            </h2>
            <p className="text-[11px] text-slate-400">
              Paste long text and get a clean, shorter summary.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
     <form onSubmit={handleSummarize} className="space-y-3">

  <textarea
    rows={6} // increased height
    value={text}
    onChange={(e) => setText(e.target.value)}
    placeholder="Paste long notes here… AI will shorten it smartly."
    className="w-full rounded-2xl bg-slate-950/80 border border-slate-700 px-3 py-3 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 resize-none"
  />

  <div className="flex items-center justify-end gap-2">

    {text.trim() && (
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
      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-[11px] md:text-xs font-semibold bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-900 hover:brightness-110 active:scale-95 disabled:opacity-60 transition"
    >
      {loading ? (
        <>
          <span className="w-3 h-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          Summarizing…
        </>
      ) : (
        <>
          <FiScissors size={12} /> Summarize
        </>
      )}
    </button>

  </div>

</form>


      {/* Summary output */}
      {loading && (
        <div className="mt-3 space-y-2">
          <div className="animate-pulse h-3 bg-slate-800 rounded w-5/6" />
          <div className="animate-pulse h-3 bg-slate-800 rounded w-4/6" />
          <div className="animate-pulse h-3 bg-slate-800 rounded w-3/5" />
        </div>
      )}

      {!loading && !summary && (
        <p className="mt-3 text-[11px] text-slate-500">
          After summarizing, your AI summary will appear here. You can copy or
          save it to notes.
        </p>
      )}

      {summary && !loading && (
        <motion.div
          className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/85 px-3 py-3 text-xs md:text-sm text-slate-100 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-[11px] text-cyan-300">
              AI summary (keep this for revision)
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-cyan-300"
              >
                <FiCopy size={11} />
                Copy
              </button>
              <button
                type="button"
                onClick={handleSaveAsNote}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-emerald-200"
              >
                  <FiSave size={11} />
                  Save as note
              </button>
            </div>
          </div>
          {summary}
        </motion.div>
      )}
    </motion.section>
  );
}
