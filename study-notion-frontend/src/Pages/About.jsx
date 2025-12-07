import React from "react";
import { motion } from "framer-motion";
import {
  FiInfo,
  FiTarget,
  FiZap,
  FiBookOpen,
  FiClock,
  FiCheckCircle,
  FiSmile,
  FiShield,
  FiChevronRight,
  FiHelpCircle,
} from "react-icons/fi";

const container = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const child = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const About = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-50 px-4">
      <motion.div
        className="max-w-[1160px] mx-auto py-10 space-y-10"
        initial="hidden"
        animate="show"
        variants={container}
      >
        {/* Top Section: Hero */}
        <section className="grid md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)] gap-8 md:gap-10 items-center">
          {/* Left text */}
          <motion.div variants={child} className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 text-[11px] font-medium text-emerald-300">
              <FiInfo size={14} />
              <span>About the project</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              A personal{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                AI-powered study workspace
              </span>{" "}
              built for students.
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-xl">
              This app helps you clear doubts, practice quizzes, summarize your
              notes, track daily goals and save quick note snippets — all in one
              clean dashboard. Designed especially for college students who are
              self-learning DSA, Web Development and other subjects.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 md:gap-4 mt-4">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-3">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiZap className="text-emerald-300" /> AI tools
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  Doubts • Quizzes • Summaries
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-3">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiTarget className="text-cyan-300" /> Productivity
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  Daily targets & quick notes
                </p>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 px-3 py-3">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiClock className="text-violet-300" /> History
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-100">
                  All activity in one place
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right highlight card */}
          <motion.div
            variants={child}
            className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-[0_0_40px_rgba(8,47,73,0.7)] p-5 md:p-6 relative overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.16),transparent_55%)]" />
            <div className="relative space-y-4">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300/80">
                Why this project?
              </p>
              <p className="text-sm text-slate-100">
                Many juniors struggle because college teaching is not enough and
                resources are scattered. This app is created as a{" "}
                <span className="font-semibold">
                  real, usable tool for students
                </span>{" "}
                to learn smarter — not just a simple demo.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="mt-0.5 text-emerald-300" />
                  <span>
                    Ask AI to explain concepts in{" "}
                    <span className="font-medium">simple language</span>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="mt-0.5 text-emerald-300" />
                  <span>
                    Generate quick quizzes & summaries to revise better.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="mt-0.5 text-emerald-300" />
                  <span>
                    Track daily study targets and keep everything organised.
                  </span>
                </li>
              </ul>
              <p className="text-[11px] text-slate-400">
                Built and designed by{" "}
                <span className="font-semibold text-emerald-300">
                  Priyanshu Tripathi
                </span>{" "}
                as a major project and a real-world helper for juniors.
              </p>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <motion.section
          variants={child}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                How to use this app
              </h2>
              <p className="text-sm text-slate-300">
                Simple 4-step workflow to make your daily self-study powerful.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                1
              </span>
              <h3 className="font-semibold text-slate-100">
                Set today&apos;s targets
              </h3>
              <p className="text-slate-400">
                Go to Dashboard → &quot;Today&apos;s Focus&quot; and add 2–3
                clear tasks you will complete.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                2
              </span>
              <h3 className="font-semibold text-slate-100">
                Ask & practice with AI
              </h3>
              <p className="text-slate-400">
                Use AI Doubt Solver & Quiz Generator to understand and test your
                topics.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                3
              </span>
              <h3 className="font-semibold text-slate-100">
                Summarize & note down
              </h3>
              <p className="text-slate-400">
                Use summaries + quick notes to capture the final clear version
                of a concept.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-1.5">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold">
                4
              </span>
              <h3 className="font-semibold text-slate-100">
                Revise from history
              </h3>
              <p className="text-slate-400">
                Go to the History page to see all AI chats and notes with date &
                time and revise faster.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Tech stack & features */}
        <motion.section
          variants={child}
          className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)] gap-6 md:gap-8"
        >
          {/* Features */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5 md:p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              Key features for students
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <div className="mt-1 rounded-md bg-emerald-500/15 p-1.5 text-emerald-300">
                  <FiHelpCircle />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    AI Doubt Solver
                  </p>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Type any question (DSA, Web Dev, theory) and get
                    explanations in simple language — like a friendly senior
                    teaching you.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 rounded-md bg-violet-500/15 p-1.5 text-violet-300">
                  <FiZap />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">Quiz Generator</p>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Create quick MCQs from any topic to test your understanding
                    in 2–5 minutes.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 rounded-md bg-cyan-500/15 p-1.5 text-cyan-300">
                  <FiBookOpen />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    Summaries & Notes
                  </p>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Turn long text into short summaries and save your own quick
                    notes with timestamps & pinning.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 rounded-md bg-amber-500/15 p-1.5 text-amber-300">
                  <FiTarget />
                </div>
                <div>
                  <p className="font-semibold text-slate-100">
                    Focus & Targets
                  </p>
                  <p className="text-slate-400 text-xs md:text-sm">
                    Minimal target tracker to keep only 2–3 important tasks for
                    the day and actually finish them.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Tech / credits */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/85 p-5 md:p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              Under the hood
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1">
                <p className="text-slate-400">Frontend</p>
                <p className="font-semibold text-slate-100">
                  React • Vite • Tailwind CSS
                </p>
                <p className="text-slate-400">
                  Framer Motion, React Icons, React Router, Toast notifications.
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1">
                <p className="text-slate-400">Backend</p>
                <p className="font-semibold text-slate-100">
                  Node.js • Express (demo)
                </p>
                <p className="text-slate-400">
                  Simple auth + AI proxy, in-memory storage for demo use.
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1">
                <p className="text-slate-400">AI Provider</p>
                <p className="font-semibold text-slate-100">
                  OpenRouter + models like Gemma/Mistral (configurable)
                </p>
                <p className="text-slate-400">
                  Used only for explanation, quiz & summary endpoints.
                </p>
              </div>
              <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 space-y-1">
                <p className="text-slate-400">Focus</p>
                <p className="font-semibold text-slate-100">
                  Helping juniors learn better
                </p>
                <p className="text-slate-400">
                  Built as a real project, not just a UI clone — with daily
                  usable features.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/70">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <FiSmile className="text-emerald-300" />
                <span>
                  If this helped you, share it with a junior who needs a study
                  push.
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                <FiShield />
                Student friendly • No distractions
              </span>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          variants={child}
          className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-300/90">
              Ready to explore?
            </p>
            <p className="text-sm md:text-base text-slate-50">
              Go to the dashboard and start with one doubt, one quiz and one
              target for today.
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold px-3 py-2 rounded-lg bg-emerald-400 text-slate-900 hover:bg-emerald-300 active:scale-95 transition"
          >
            Open Dashboard
            <FiChevronRight size={14} />
          </a>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;
