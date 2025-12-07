import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainRobo from "../assets/robotDash.png";
import {
  FiArrowRight,
  FiHelpCircle,
  FiBookOpen,
  FiTarget,
  FiClock,
  FiCopy,
  FiTrash2,
  FiStar,
} from "react-icons/fi";

import AiPanel from "../ComponentsOne/AiPanel";
import QuizPanel from "../ComponentsOne/QuizPanel";
import SummarizePanel from "../ComponentsOne/SummarizePanel";
import TargetPanel from "../ComponentsOne/TargetPanel";

import Robot1 from "../assets/robot1.png";
import Robot2 from "../assets/robot2.png";
import Robot3 from "../assets/robot3.png";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function getUserId() {
  const u = getUser();
  return u?.id || "anon";
}

/* --------- Top Smart Assistant card (robot #1) --------- */
function SmartAssistantCard() {
  const robots = [Robot1, Robot2, Robot3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % robots.length),
      3500
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-900 shadow-[0_0_40px_rgba(16,185,129,0.55)] flex items-center justify-between px-4 py-3 md:px-6 md:py-4 gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-18 md:w-22 md:h-20 rounded-2xl bg-transparent flex items-center justify-center overflow-hidden">
          <motion.img
            key={index}
            src={robots[index]}
            alt="AI helper"
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.35 }}
          />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] text-emerald-300/90 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Smart Study Assistant
          </p>
          <h3 className="text-sm md:text-base font-semibold text-slate-50">
            Ask doubts, auto-generate quizzes & keep your notes organised.
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

// --------- Right big robot card (center robot) ---------
function RobotBuddyCard() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-[0_0_40px_rgba(8,47,73,0.7)] overflow-hidden">
      <div className="relative flex flex-col items-center text-center px-6 pt-6 pb-5">
        {/* soft glow background */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.18),transparent_55%)]" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <motion.img
            src={MainRobo}
            alt="AI robot"
            className="w-40 md:w-60 h-auto object-contain drop-shadow-[0_0_28px_rgba(34,211,238,0.75)]"
            animate={{
              y: [3, -7, 7, -3, 7],
              x: [3, 7, 3, -3, 3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          />

          <div className="space-y-1 mt-1">
            <h2 className="text-base md:text-lg font-semibold text-slate-50">
              Your AI Study Buddy
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-xs">
              I can help you understand DSA, Web Dev, college subjects and more.
              Just type your doubt and I&apos;ll break it down simply.
            </p>

            <p className="text-[11px] md:text-xs mt-2 font-semibold bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              Powered by Priyanshu.AI
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------- Quick Notes (home-style: topic + note) --------- */
const NOTES_KEY = "dashboardQuickNotes_v2";

function QuickNotesPanel() {
  const userId = getUserId();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        const mine = all[userId] || [];
        setNotes(mine);
      }
    } catch {
      // ignore
    }
  }, [userId]);

  const persist = (next) => {
    setNotes(next);
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      const all = raw ? JSON.parse(raw) : {};
      all[userId] = next;
      localStorage.setItem(NOTES_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }
  };

  const handleSave = () => {
    const t = title.trim();
    const b = body.trim();
    if (!t && !b) return;
    const note = {
      id: Date.now().toString(),
      title: t || "Untitled",
      body: b,
      pinned: false,
      createdAt: Date.now(),
    };
    const next = [note, ...notes];
    persist(next);
    setTitle("");
    setBody("");
  };

  const handleDelete = (id) => {
    const next = notes.filter((n) => n.id !== id);
    persist(next);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const togglePin = (id) => {
    const next = notes
      .map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
      .sort((a, b) =>
        b.pinned === a.pinned ? b.createdAt - a.createdAt : b.pinned ? 1 : -1
      );
    persist(next);
  };

  const ordered = [...notes].sort((a, b) => {
    if (a.pinned === b.pinned) return b.createdAt - a.createdAt;
    return a.pinned ? -1 : 1;
  });

  return (
    <motion.section
      className="rounded-2xl border border-slate-800 bg-slate-900/85 p-4 md:p-5 shadow-[0_0_36px_rgba(8,47,73,0.55)] flex flex-col gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300">
            <FiBookOpen />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-semibold text-slate-100">
              Quick notes
            </h2>
            <p className="text-[11px] text-slate-400">
              Save short topic-wise notes while practising.
            </p>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Topic (e.g. Binary tree basics)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400"
        />
        <div className="relative">
          <textarea
            rows={3}
            placeholder="Write your quick explanation, formula or trick here…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
          />
          <button
            type="button"
            onClick={handleSave}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-lg bg-indigo-400 text-slate-900 text-[11px] md:text-xs font-semibold px-3 py-1.5 hover:bg-indigo-300 active:scale-95 transition"
          >
            Save
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div className="mt-1 max-h-40 overflow-y-auto space-y-2 pr-1 custom-scroll">
        {ordered.length === 0 ? (
          <p className="text-[11px] md:text-xs text-slate-500">
            No notes yet. Add short points when AI explains something important.
          </p>
        ) : (
          ordered.map((n) => (
            <div
              key={n.id}
              className="group rounded-xl border border-slate-800 bg-slate-950/85 px-3 py-2 text-xs text-slate-100 flex flex-col gap-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-slate-50 text-[12px]">
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="mt-0.5 text-[11px] text-slate-300 line-clamp-2">
                      {n.body}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => togglePin(n.id)}
                  className={
                    "p-1 rounded-full transition " +
                    (n.pinned
                      ? "text-yellow-300"
                      : "text-slate-500 group-hover:text-slate-300")
                  }
                  title={n.pinned ? "Unpin note" : "Pin note"}
                >
                  <FiStar size={13} />
                </button>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <FiClock size={10} />
                  {new Date(n.createdAt).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleCopy(`${n.title}\n${n.body}`.trim())}
                    className="p-1 rounded-full hover:bg-slate-800 text-slate-300"
                    title="Copy"
                  >
                    <FiCopy size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(n.id)}
                    className="p-1 rounded-full hover:bg-red-900/35 text-red-300"
                    title="Delete"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.section>
  );
}

/* ------------------ MAIN DASHBOARD ------------------ */

export default function Dashboard() {
  const user = getUser();
  const firstName = user?.firstname || "Student";

  // 🔹 yahan refs bana rahe hain (component ke andar)
  const aiRef = useRef(null);
  const quizRef = useRef(null);
  const summaryRef = useRef(null);
  const targetRef = useRef(null);

  const scrollTo = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="max-w-[1160px] mx-auto px-4 pb-10 pt-4 space-y-6">
      {/* Top heading */}
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
          Dashboard
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 flex items-center gap-2">
          Welcome back,
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            {firstName}
          </span>
          <span className="text-xl">👋</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
          Use AI to clear your doubts, generate quizzes, summarize notes, and
          track your daily study targets — all in one place.
        </p>
      </header>

      {/* Top row: quick actions + smart assistant */}
      <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.3fr)] gap-4 md:gap-6">
        {/* Quick action cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Recent Activity - history page */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 flex flex-col justify-between">
            <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <FiClock className="text-cyan-300" /> Recent Activity
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              View all AI chats & notes.
            </p>
            <a
              href="/history"
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:underline"
            >
              View history <FiArrowRight size={12} />
            </a>
          </div>

          {/* Ask a Doubt -> scroll AI panel */}
          <div
            className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 flex flex-col justify-between cursor-pointer"
            onClick={() => scrollTo(aiRef)}
          >
            <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <FiHelpCircle className="text-indigo-300" /> Ask a Doubt
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Explain any concept in simple language.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Scroll to <span className="text-indigo-300">AI Doubt Solver</span>
            </p>
          </div>

          {/* Practice Quiz -> scroll Quiz panel */}
          <div
            className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 flex flex-col justify-between cursor-pointer"
            onClick={() => scrollTo(quizRef)}
          >
            <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <FiBookOpen className="text-violet-300" /> Practice Quiz
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              MCQs for quick revision.
            </p>
            <p className="mt-2 text-[11px] text-slate-500">
              Scroll to <span className="text-violet-300">Quiz Generator</span>
            </p>
          </div>

          {/* Today's Targets -> scroll Targets panel */}
          <div
            className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 flex flex-col justify-between cursor-pointer"
            onClick={() => scrollTo(targetRef)}
          >
            <p className="text-xs font-semibold text-slate-100 flex items-center gap-2">
              <FiTarget className="text-emerald-300" /> Today&apos;s Targets
            </p>
            <p className="text-[11px] text-slate-200 mt-1">
              Stay on track with 2–3 focused tasks.
            </p>
            <p className="mt-2 text-[11px] text-emerald-300">
              Scroll to <span className="font-semibold">Focus & Targets</span>
            </p>
          </div>
        </div>

        {/* Smart assistant card with rotating robot */}
        <SmartAssistantCard />
      </div>

      {/* Main grid: left tools, right robot + targets + quick notes */}
      <div className="grid lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)] gap-6 md:gap-7 mt-4">
        {/* Left column */}
        <div className="space-y-5">
          <section ref={aiRef}>
            <AiPanel />
          </section>
          <section ref={quizRef}>
            <QuizPanel />
          </section>
          <section ref={summaryRef}>
            <SummarizePanel />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5 lg:border-l lg:border-slate-800/70 lg:pl-6">
          <RobotBuddyCard />
          <section ref={targetRef}>
            <TargetPanel />
          </section>
          <QuickNotesPanel />
        </div>
      </div>
    </div>
  );
}
