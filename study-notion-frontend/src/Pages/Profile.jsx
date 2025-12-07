import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiClock,
  FiTarget,
  FiBookOpen,
  FiZap,
  FiLogOut,
  FiEdit3,
  FiActivity,
  FiHelpCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getHistory } from "../utils/api";
import RobotProfile from "../assets/robot-profile.png";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatDate(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    safeParse(localStorage.getItem("user"))
  );
  const [nameInput, setNameInput] = useState(user?.firstname || "");
  const [loadingStats, setLoadingStats] = useState(true);
  const [historyStats, setHistoryStats] = useState({
    total: 0,
    chats: 0,
    quizzes: 0,
    summaries: 0,
    recent: [],
  });
  const [notesStats, setNotesStats] = useState({
    homeNotes: 0,
    dashboardNotes: 0,
    targets: 0,
  });

  // --- load stats from backend + localStorage ---
  useEffect(() => {
    if (!user?.id) {
      setLoadingStats(false);
      return;
    }

    (async () => {
      try {
        const res = await getHistory(user.id);
        const history = Array.isArray(res.history) ? res.history : [];
        const chats = history.filter(
          (h) => (h.type || "chat") === "chat"
        ).length;
        const quizzes = history.filter((h) => h.type === "quiz").length;
        const summaries = history.filter((h) => h.type === "summary").length;

        setHistoryStats({
          total: history.length,
          chats,
          quizzes,
          summaries,
          recent: history.slice(0, 3),
        });
      } catch (err) {
        console.error("Profile history load error:", err);
      } finally {
        setLoadingStats(false);
      }
    })();

    // Notes + targets from localStorage
    try {
      const homeRaw = safeParse(localStorage.getItem("studyNotes"));
      const dashRaw = safeParse(localStorage.getItem("dashboardQuickNotes_v2"));
      const targetsRaw = safeParse(localStorage.getItem("studyTargets"));

      const homeNotes = Array.isArray(homeRaw) ? homeRaw.length : 0;

      let dashboardNotes = 0;
      if (dashRaw && typeof dashRaw === "object") {
        const mine = dashRaw[user.id] || [];
        dashboardNotes = Array.isArray(mine) ? mine.length : 0;
      }

      let targets = 0;
      if (targetsRaw && typeof targetsRaw === "object") {
        const mineTargets = targetsRaw[user.id] || [];
        targets = Array.isArray(mineTargets) ? mineTargets.length : 0;
      }

      setNotesStats({
        homeNotes,
        dashboardNotes,
        targets,
      });
    } catch (e) {
      console.error("Profile notes stats error:", e);
    }
  }, [user?.id]);

  const handleNameSave = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      toast.error("Name cannot be empty.");
      return;
    }
    const updated = { ...user, firstname: trimmed };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    toast.success("Name updated!");
  };

  const handleLogout = () => {
    // Pure logout from profile
    localStorage.clear();
    toast.success("Logged out successfully");
    // Hard redirect so App ka isLoggedIn bhi reset ho jaaye
    navigate("/login", { replace: true });
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const joinedAt = (() => {
    if (!user?.id) return null;
    const num = Number(user.id);
    if (!Number.isFinite(num)) return null;
    const d = new Date(num);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  })();

  const displayName = user?.firstname || "Student";

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-50 px-4">
      <motion.div
        className="max-w-[1160px] mx-auto py-8 md:py-10 space-y-7"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Top header */}
        <motion.header
          variants={fadeUp}
          className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
        >
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
              Profile & Stats
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              Hello,
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                {displayName}
              </span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl">
              This page shows your basic info, study activity stats, notes count
              and targets. You can update your name and log out from here.
            </p>
          </div>

          {/* Robot card on right */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 flex items-center gap-3 shadow-[0_0_32px_rgba(8,47,73,0.6)] overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.22),transparent_55%)]" />
            <div className="relative z-10 flex items-center gap-3">
              <motion.img
                src={RobotProfile}
                alt="Profile robot"
                className="w-45 h-42 md:w-45 md:h-42 object-contain drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                animate={{
                  y: [3, -5, 3],
                  x: [1, -2, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              />
              <div className="space-y-1">
                <p className="text-[11px] text-emerald-300/90 flex items-center gap-1">
                  <FiActivity size={12} />
                  Personal study space
                </p>
                <p className="text-xs text-slate-200 max-w-[220px]">
                  Track how you use AI, quizzes and notes in your daily study
                  routine.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Main grid */}
        <motion.section
          variants={fadeUp}
          className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)] gap-6"
        >
          {/* LEFT: Profile card + quick stats */}
          <div className="space-y-4">
            {/* Profile main card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5 shadow-[0_0_32px_rgba(8,47,73,0.55)]">
              <div className="flex items-start gap-4">
                {/* Avatar circle */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center text-slate-900 text-xl md:text-2xl font-bold shadow-lg">
                  {(displayName[0] || "S").toUpperCase()}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <p className="text-base md:text-lg font-semibold text-slate-50 flex items-center gap-2">
                        {displayName}
                        {user?.accountType && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
                            {user.accountType}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <FiMail size={12} />
                        {user?.email || "No email set"}
                      </p>
                      {joinedAt && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <FiClock size={11} />
                          Joined on {formatDate(joinedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Name edit form */}
                  <form
                    onSubmit={handleNameSave}
                    className="mt-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
                  >
                    <label className="flex-1 text-[11px] text-slate-300 space-y-1">
                      <span className="inline-flex items-center gap-1">
                        <FiEdit3 size={12} />
                        First name
                      </span>
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                        placeholder="Enter your first name"
                      />
                    </label>
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-lg bg-cyan-400 text-slate-900 text-xs font-semibold hover:bg-cyan-300 active:scale-95 transition mt-1 sm:mt-5"
                    >
                      Save name
                    </button>
                  </form>
                </div>
              </div>

              {/* Logout button */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/60 bg-red-500/10 text-red-300 text-xs font-medium px-3 py-1.5 hover:bg-red-500/20 active:scale-95 transition"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              </div>
            </div>

            {/* Small stats row */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col gap-1">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiActivity size={12} className="text-emerald-300" />
                  Total AI activity
                </p>
                <p className="text-lg font-semibold text-slate-50">
                  {loadingStats ? "…" : historyStats.total}
                </p>
                <p className="text-[11px] text-slate-500">
                  Doubts, quizzes & summaries.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col gap-1">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiBookOpen size={12} className="text-indigo-300" />
                  Notes & targets
                </p>
                <p className="text-lg font-semibold text-slate-50">
                  {notesStats.homeNotes +
                    notesStats.dashboardNotes +
                    notesStats.targets}
                </p>
                <p className="text-[11px] text-slate-500">
                  Home notes, dashboard notes & today&apos;s focus.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Detailed stats + recent activity */}
          <div className="space-y-4">
            {/* Detailed stats cards */}
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col gap-1">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiHelpCircle className="text-cyan-300" size={12} />
                  AI doubts cleared
                </p>
                <p className="text-xl font-semibold text-slate-50">
                  {loadingStats ? "…" : historyStats.chats}
                </p>
                <p className="text-[11px] text-slate-500">
                  Questions asked in AI Doubt Solver.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col gap-1">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiZap className="text-violet-300" size={12} />
                  Quizzes generated
                </p>
                <p className="text-xl font-semibold text-slate-50">
                  {loadingStats ? "…" : historyStats.quizzes}
                </p>
                <p className="text-[11px] text-slate-500">
                  MCQ sets created for revision.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col gap-1">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FiBookOpen className="text-amber-300" size={12} />
                  Summaries saved
                </p>
                <p className="text-xl font-semibold text-slate-50">
                  {loadingStats ? "…" : historyStats.summaries}
                </p>
                <p className="text-[11px] text-slate-500">
                  Topics you summarized using AI.
                </p>
              </div>
            </div>

            {/* Recent activity preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                    <FiClock className="text-emerald-300" />
                    Recent AI activity
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Last few doubts / quizzes / summaries you created.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/history")}
                  className="text-[11px] text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1"
                >
                  View full history
                </button>
              </div>

              {loadingStats ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-xl bg-slate-800/60 animate-pulse"
                    />
                  ))}
                </div>
              ) : historyStats.recent.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No AI activity yet. Go to your dashboard and ask a doubt,
                  generate a quiz or summarize your notes to see them here.
                </p>
              ) : (
                <div className="space-y-2">
                  {historyStats.recent.map((item) => {
                    const type = item.type || "chat";
                    let label = "Chat";
                    let chipClass =
                      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";

                    if (type === "quiz") {
                      label = "Quiz";
                      chipClass =
                        "bg-violet-500/15 text-violet-300 border border-violet-500/40";
                    } else if (type === "summary") {
                      label = "Summary";
                      chipClass =
                        "bg-amber-500/15 text-amber-300 border border-amber-500/40";
                    }

                    return (
                      <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span
                            className={
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] " +
                              chipClass
                            }
                          >
                            {label}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-1">
                          <span className="font-semibold text-slate-100">
                            Q:&nbsp;
                          </span>
                          {item.question || item.topic || "No question stored"}
                        </p>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Profile;
