import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTarget,
  FiZap,
  FiBookOpen,
  FiEdit3,
  FiCalendar,
  FiArrowRight,
  FiClipboard,
  FiCopy,
  FiStar,
  FiTrash2,
} from "react-icons/fi";

import RobotHome from "../assets/robot-home.png";
// small animation presets
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.4, ease: "easeOut" },
  }),
};

const Home = () => {
  const navigate = useNavigate();

  // ---- login / user info ----
  const [userId, setUserId] = useState(null);
  const isLoggedIn = useMemo(() => !!localStorage.getItem("token"), []);

  // ---- state: quick focus ----
  const [focusText, setFocusText] = useState("");
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [savedFocus, setSavedFocus] = useState(null);

  // ---- state: quick notes (multiple) ----
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [notes, setNotes] = useState([]); // array of {id,title,body,createdAt,createdAtMs,pinned}

  // ---- state: local streak ----
  const [streak, setStreak] = useState(1);

  // 1) streak ko load karo (global, user se independent)
  useEffect(() => {
    try {
      const streakData = localStorage.getItem("sn_streak_info");
      const today = new Date().toDateString();

      if (streakData) {
        const parsed = JSON.parse(streakData);
        if (parsed.lastDay === today) {
          setStreak(parsed.streak || 1);
        } else {
          const next = (parsed.streak || 1) + 1;
          setStreak(next);
          localStorage.setItem(
            "sn_streak_info",
            JSON.stringify({ lastDay: today, streak: next })
          );
        }
      } else {
        setStreak(1);
        localStorage.setItem(
          "sn_streak_info",
          JSON.stringify({ lastDay: today, streak: 1 })
        );
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // 2) userId + user-specific focus/notes load karo
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      if (storedUser?.id) {
        setUserId(storedUser.id);

        const focusKey = `sn_focus_${storedUser.id}`;
        const focusMinutesKey = `sn_focus_minutes_${storedUser.id}`;
        const notesKey = `sn_notes_${storedUser.id}`;

        const savedFocusText = localStorage.getItem(focusKey);
        const savedFocusMinutes = localStorage.getItem(focusMinutesKey);
        const savedNotes = localStorage.getItem(notesKey);

        if (savedFocusText) {
          setFocusText(savedFocusText);
          setSavedFocus({
            text: savedFocusText,
            minutes: Number(savedFocusMinutes) || 25,
          });
        }

        if (savedNotes) {
          try {
            const parsed = JSON.parse(savedNotes);
            if (Array.isArray(parsed)) setNotes(parsed);
          } catch {
            // ignore parse error
          }
        }

        if (savedFocusMinutes) {
          setFocusMinutes(Number(savedFocusMinutes) || 25);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // sorted notes (pinned first)
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (b.createdAtMs || 0) - (a.createdAtMs || 0);
    });
  }, [notes]);

  // ------------- handlers -------------

  const requireLogin = () => {
    if (!isLoggedIn || !userId) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleSaveFocus = () => {
    if (!requireLogin()) return;
    const trimmed = focusText.trim();
    if (!trimmed) return;

    const focusKey = `sn_focus_${userId}`;
    const focusMinutesKey = `sn_focus_minutes_${userId}`;

    localStorage.setItem(focusKey, trimmed);
    localStorage.setItem(focusMinutesKey, String(focusMinutes));

    setSavedFocus({
      text: trimmed,
      minutes: focusMinutes,
      savedAt: new Date().toLocaleTimeString(),
    });
  };

  const handleQuickAsk = () => {
    navigate("/dashboard");
  };

  const handleSaveNote = () => {
    if (!requireLogin()) return;
    if (!noteTitle.trim() && !noteBody.trim()) return;

    const now = new Date();
    const note = {
      id: Date.now(),
      title: noteTitle.trim() || "Untitled note",
      body: noteBody.trim(),
      createdAt: now.toLocaleString(),
      createdAtMs: now.getTime(),
      pinned: false,
    };

    const nextNotes = [note, ...notes];
    setNotes(nextNotes);
    const notesKey = `sn_notes_${userId}`;
    localStorage.setItem(notesKey, JSON.stringify(nextNotes));

    setNoteTitle("");
    setNoteBody("");
  };

  const handleCopyNote = async (note) => {
    if (!note) return;
    try {
      await navigator.clipboard.writeText(
        `${note.title}\n\n${note.body || ""}`
      );
      // toast import nahi kiya, isliye yaha sirf console
      console.log("Note copied to clipboard");
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleDeleteNote = (id) => {
    if (!requireLogin()) return;
    const nextNotes = notes.filter((n) => n.id !== id);
    setNotes(nextNotes);
    const notesKey = `sn_notes_${userId}`;
    localStorage.setItem(notesKey, JSON.stringify(nextNotes));
  };

  const togglePinNote = (id) => {
    if (!requireLogin()) return;
    const nextNotes = notes.map((n) =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    );
    setNotes(nextNotes);
    const notesKey = `sn_notes_${userId}`;
    localStorage.setItem(notesKey, JSON.stringify(nextNotes));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      {/* ------------- HERO TOP SECTION ------------- */}
      <section className="max-w-[1160px] mx-auto px-4 pt-10 pb-8">
        <div className="grid md:grid-cols-[1.7fr,1.3fr] gap-10 items-center">
          {/* LEFT TEXT + QUICK ASK */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="space-y-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/60 px-3 py-1 text-[11px] uppercase tracking-wide text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.45)]">
              <FiZap size={14} /> Smart Study Dashboard
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-slate-50">
              Turn your{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                doubts, notes & goals
              </span>{" "}
              into a daily study system.
            </h1>

            <p className="text-sm sm:text-base text-slate-300/95 max-w-xl">
              Ask AI in simple language, generate quizzes, summarize long notes,
              and track your focus — all in one place, designed for students
              like you.
            </p>

            {/* Quick actions */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-sm font-semibold px-4 py-2 shadow-[0_12px_32px_rgba(16,185,129,0.45)] transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Open AI Dashboard <FiArrowRight size={16} />
              </button>
              <Link
                to="/history"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-100 text-sm px-4 py-2 border border-slate-700/80 transition transform hover:-translate-y-0.5"
              >
                View recent activity
              </Link>
            </div>

            {/* quick “start typing” area */}
            <div className="mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-3 shadow-[0_18px_40px_rgba(15,23,42,0.9)]">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <FiBookOpen size={14} className="text-emerald-300" />
                <span>Quick doubt</span>
                <span className="text-slate-500 hidden sm:inline">
                  (you&apos;ll continue on the AI dashboard)
                </span>
              </div>
              <textarea
                rows={2}
                className="bg-slate-950/90 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 resize-none"
                placeholder="Ask something like: Explain binary search in very easy language..."
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleQuickAsk}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500/95 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-semibold px-3 py-1.5 transition transform hover:-translate-y-0.5"
                >
                  Open in AI tools
                  <FiArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT ROBOT + STREAK CARD */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative w-[360px] sm:w-[360px] md:w-[400px]">
              <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.25),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.25),transparent_60%)] blur-2xl opacity-90" />
              <motion.img
                src={RobotHome}
                alt="Study assistant robot"
                className="relative w-full h-auto drop-shadow-[0_0_30px_rgba(34,197,235,0.6)]"
                animate={{
                  y: [0, -8, 0],
                  rotate: [-1.5, 1.5, -1.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[190px] rounded-xl bg-slate-950/95 border border-emerald-500/50 px-3 py-2 text-xs shadow-xl shadow-emerald-500/30 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <FiCalendar size={13} /> Study Streak
                  </span>
                  <span className="text-[11px] text-slate-400">Local</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-50">
                    {streak}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    day{streak > 1 ? "s" : ""} active
                  </span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-300"
                    style={{
                      width: `${Math.min(streak * 12, 100)}%`,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------- MIDDLE: KEY TOOLS GRID ------------- */}
      <section className="max-w-[1160px] mx-auto px-4 pb-10">
        <motion.h2
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 text-slate-50"
        >
          <FiClipboard className="text-emerald-400" />
          Your study hub
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {/* AI Doubt Solver */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 border border-slate-800/90 p-4 flex flex-col gap-2 shadow-[0_12px_32px_rgba(15,23,42,0.9)] transition transform hover:-translate-y-1 hover:border-emerald-400/60"
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-500/15 text-emerald-300">
                <FiZap size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  AI Doubt Solver
                </h3>
                <p className="text-xs text-slate-400">
                  Get step-by-step explanations in simple English.
                </p>
              </div>
            </div>
            <ul className="text-[11px] text-slate-400 mt-1 list-disc list-inside space-y-0.5">
              <li>Ask concepts from any subject</li>
              <li>Explain code, DSA, maths, science</li>
              <li>Use on Dashboard for full power</li>
            </ul>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-emerald-300 hover:text-emerald-200"
            >
              Open in Dashboard <FiArrowRight size={13} />
            </button>
          </motion.div>

          {/* Quiz Generator */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="rounded-2xl bg-slate-900/95 border border-slate-800 p-4 flex flex-col gap-2 shadow-[0_10px_28px_rgba(15,23,42,0.85)] transition transform hover:-translate-y-1 hover:border-sky-400/60"
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-500/15 text-sky-300">
                <FiTarget size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Quiz Generator
                </h3>
                <p className="text-xs text-slate-400">
                  Create MCQs from topics to test yourself.
                </p>
              </div>
            </div>
            <ul className="text-[11px] text-slate-400 mt-1 list-disc list-inside space-y-0.5">
              <li>Type &quot;Array in C++&quot; or &quot;Heat chapter&quot;</li>
              <li>Perfect for revision nights</li>
              <li>Use answer feedback instantly</li>
            </ul>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-sky-300 hover:text-sky-200"
            >
              Generate quiz now <FiArrowRight size={13} />
            </button>
          </motion.div>

          {/* Smart Notes */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="rounded-2xl bg-slate-900/95 border border-slate-800 p-4 flex flex-col gap-2 shadow-[0_10px_28px_rgba(15,23,42,0.85)] transition transform hover:-translate-y-1 hover:border-fuchsia-400/60"
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-fuchsia-500/15 text-fuchsia-300">
                <FiEdit3 size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Smart Summaries
                </h3>
                <p className="text-xs text-slate-400">
                  Paste long notes and get a short, revision-friendly version.
                </p>
              </div>
            </div>
            <ul className="text-[11px] text-slate-400 mt-1 list-disc list-inside space-y-0.5">
              <li>Perfect for long PDFs / theory</li>
              <li>Helps you revise last night</li>
              <li>Check full summary in Dashboard</li>
            </ul>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-fuchsia-300 hover:text-fuchsia-200"
            >
              Summarize my notes <FiArrowRight size={13} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ------------- BOTTOM: FOCUS (SMALL) + NOTES (BIGGER) ------------- */}
      <section className="max-w-[1160px] mx-auto px-4 pb-12 grid md:grid-cols-[1.1fr,1.9fr] gap-5 md:gap-6">
        {/* Focus Planner - smaller card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="rounded-2xl bg-slate-900/95 border border-slate-800 p-4 sm:p-5 flex flex-col gap-3 shadow-[0_10px_28px_rgba(15,23,42,0.85)]"
        >
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/15 text-emerald-300">
              <FiTarget size={18} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Today&apos;s focus
              </h3>
              <p className="text-[11px] text-slate-400">
                One clear goal for today. Saved per account.
              </p>
            </div>
          </div>

          <input
            type="text"
            value={focusText}
            onChange={(e) => setFocusText(e.target.value)}
            placeholder="Example: Finish arrays revision + 10 questions"
            className="mt-2 bg-slate-950/85 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50"
          />

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-400">Focus session:</span>
            <input
              type="number"
              min={10}
              max={180}
              value={focusMinutes}
              onChange={(e) =>
                setFocusMinutes(
                  Math.max(10, Math.min(180, Number(e.target.value) || 25))
                )
              }
              className="w-16 bg-slate-950/85 border border-slate-800 rounded-md text-xs text-slate-100 px-2 py-1 focus:outline-none focus:border-emerald-400/80"
            />
            <span className="text-[11px] text-slate-400">minutes</span>
          </div>

          <div className="flex justify-between items-center mt-3">
            <button
              type="button"
              onClick={handleSaveFocus}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/95 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-semibold px-3 py-1.5 transition transform hover:-translate-y-0.5"
            >
              Save focus
            </button>
            <span className="text-[11px] text-slate-500">
              {isLoggedIn ? "Linked to your account" : "Login required to save"}
            </span>
          </div>

          {savedFocus && (
            <div className="mt-3 rounded-lg bg-slate-950/95 border border-slate-800 p-3">
              <p className="text-[11px] text-slate-400 mb-1">Saved focus:</p>
              <p className="text-xs text-slate-100">{savedFocus.text}</p>
              {savedFocus.minutes && (
                <p className="mt-1 text-[10px] text-slate-500">
                  Session: {savedFocus.minutes} minutes
                  {savedFocus.savedAt ? ` • Saved at ${savedFocus.savedAt}` : ""}
                </p>
              )}
            </div>
          )}
        </motion.div>

        {/* Quick Notes - bigger card with list */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={5}
          className="rounded-2xl bg-slate-900/95 border border-slate-800 p-4 sm:p-5 flex flex-col gap-3 shadow-[0_10px_28px_rgba(15,23,42,0.85)]"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-sky-500/15 text-sky-300">
                <FiClipboard size={18} />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Quick notes
                </h3>
                <p className="text-[11px] text-slate-400">
                  Small things you don&apos;t want to forget. Per account &
                  device.
                </p>
              </div>
            </div>
          </div>

          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title (e.g. Binary search edge cases)"
            className="bg-slate-950/85 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:border-sky-400/80 focus:ring-1 focus:ring-sky-400/50"
          />

          <textarea
            rows={3}
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Write your note here..."
            className="bg-slate-950/85 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:border-sky-400/80 focus:ring-1 focus:ring-sky-400/50 resize-none"
          />

          <div className="flex justify-between items-center mt-2">
            <button
              type="button"
              onClick={handleSaveNote}
              className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/95 hover:bg-sky-400 text-slate-950 text-xs sm:text-sm font-semibold px-3 py-1.5 transition transform hover:-translate-y-0.5"
            >
              Save note
            </button>
            <span className="text-[11px] text-slate-500">
              {isLoggedIn ? "Saved to your account" : "Login to save notes"}
            </span>
          </div>

          {/* Notes list */}
          {sortedNotes.length > 0 && (
            <div className="mt-3 max-h-52 overflow-y-auto space-y-2 pr-1">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg bg-slate-950/95 border border-slate-800 p-3 text-xs text-slate-100 transition hover:border-sky-400/40"
                >
                  <div className="flex justify-between gap-2 items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs text-slate-50">
                          {note.title}
                        </h4>
                        {note.pinned && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/40">
                            pinned
                          </span>
                        )}
                      </div>
                      {note.body && (
                        <p className="mt-0.5 text-[11px] text-slate-300 whitespace-pre-line line-clamp-3">
                          {note.body}
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-slate-500">
                        {note.createdAt}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={() => togglePinNote(note.id)}
                        className="text-amber-300 hover:text-amber-200"
                        title={note.pinned ? "Unpin note" : "Pin note"}
                      >
                        <FiStar
                          size={14}
                          className={note.pinned ? "" : "opacity-60"}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyNote(note)}
                        className="text-sky-300 hover:text-sky-200"
                        title="Copy note"
                      >
                        <FiCopy size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete note"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {sortedNotes.length === 0 && (
            <p className="mt-2 text-[11px] text-slate-500">
              No saved notes yet. Write something and hit &quot;Save note&quot;.
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
