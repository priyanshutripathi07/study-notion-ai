import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTarget, FiPlus, FiCheckCircle, FiTrash2 } from "react-icons/fi";

function getUserId() {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.id || "anon";
  } catch {
    return "anon";
  }
}

const STORAGE_KEY = "studyTargets";

const TargetPanel = () => {
  const userId = getUserId();
  const [targets, setTargets] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        const mine = all[userId] || [];
        setTargets(mine);
      }
    } catch {
      // ignore
    }
  }, [userId]);

  const persist = (next) => {
    setTargets(next);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[userId] = next;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  };

  const handleAdd = (e) => {
    e?.preventDefault?.();
    const trimmed = title.trim();
    if (!trimmed) return;
    const newTarget = {
      id: Date.now().toString(),
      title: trimmed,
      subject: subject.trim(),
      done: false,
      createdAt: Date.now(),
    };
    persist([newTarget, ...targets]);
    setTitle("");
    setSubject("");
  };

  const toggleDone = (id) => {
    const updated = targets.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    persist(updated);
  };

  const clearCompleted = () => {
    const active = targets.filter((t) => !t.done);
    persist(active);
  };

  const completion =
    targets.length === 0
      ? 0
      : Math.round(
          (targets.filter((t) => t.done).length / targets.length) * 100
        );

  return (
    <motion.section
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 shadow-[0_0_40px_rgba(8,47,73,0.6)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300">
            <FiTarget />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-semibold text-slate-100">
              Today&apos;s Focus & Targets
            </h2>
            <p className="text-xs text-slate-400">
              Set 2–3 clear tasks you&apos;ll finish today.
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-[11px] text-slate-400">Completion</span>
          <span className="text-sm font-semibold text-emerald-300">
            {completion}% done
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300"
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="flex flex-col sm:flex-row gap-2 mb-3"
      >
        <input
          type="text"
          placeholder="What will you study? (e.g. Arrays in C++)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-lg bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
        />
        <input
          type="text"
          placeholder="Subject / Topic (optional)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="sm:w-40 rounded-lg bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-400 text-slate-900 text-xs md:text-sm font-semibold px-3 py-2 hover:bg-emerald-300 active:scale-95 transition"
        >
          <FiPlus />
          Add
        </button>
      </form>

      {/* List */}
      {targets.length === 0 ? (
        <p className="text-xs md:text-sm text-slate-400">
          No targets yet. Add 1–3 things you really want to complete today.
        </p>
      ) : (
        <div className="space-y-2">
          {targets.map((t) => (
            <div
              key={t.id}
              className="flex items-start justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => toggleDone(t.id)}
                className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs transition ${
                  t.done
                    ? "bg-emerald-400 border-emerald-400 text-slate-950"
                    : "border-slate-600 text-slate-400 hover:border-emerald-400 hover:text-emerald-300"
                }`}
                aria-label={t.done ? "Mark as not done" : "Mark as done"}
              >
                {t.done ? <FiCheckCircle /> : "✓"}
              </button>

              <div className="flex-1">
                <p
                  className={`text-xs md:text-sm ${
                    t.done
                      ? "text-slate-400 line-through"
                      : "text-slate-100 font-medium"
                  }`}
                >
                  {t.title}
                </p>
                {t.subject && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {t.subject}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const filtered = targets.filter((x) => x.id !== t.id);
                  persist(filtered);
                }}
                className="mt-0.5 p-1 rounded-full text-slate-500 hover:text-red-300 hover:bg-red-900/30 transition"
                aria-label="Delete target"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={clearCompleted}
              className="text-[11px] text-slate-400 hover:text-emerald-300 underline-offset-2 hover:underline"
            >
              Clear completed
            </button>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default TargetPanel;
