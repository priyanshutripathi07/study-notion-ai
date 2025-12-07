import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiClock,
  FiZap,
  FiBookOpen,
  FiHelpCircle,
  FiEdit3,
  FiTrash2,
  FiCopy,
  FiStar,
} from "react-icons/fi";
import { getHistory } from "../utils/api";
import { toast } from "react-toastify";

// ---------- Utils ----------
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

// Sab alag-alag note formats ko ek hi common shape me convert
function normalizeNote(rawNote, extra = {}) {
  const created = rawNote?.createdAt
    ? new Date(rawNote.createdAt).getTime()
    : Date.now();

  return {
    id: String(
      rawNote.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    ),
    title: rawNote.title || rawNote.topic || "Untitled note",
    content: rawNote.content || rawNote.body || rawNote.text || "",
    pinned: !!rawNote.pinned,
    createdAt: created,
    ...extra,
  };
}

// ================= HISTORY PAGE =================
const History = () => {
  // userId ek hi baar nikaal lete hain
  const [userId] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.id || null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState("ai"); // "ai" | "notes"
  const [aiHistory, setAiHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingAi, setLoadingAi] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [error, setError] = useState("");

  // ---------- Load AI history + notes ----------
  useEffect(() => {
    if (!userId) {
      setError("Please login to view your history.");
      setLoadingAi(false);
      setLoadingNotes(false);
      return;
    }

    // --- AI history from backend ---
    (async () => {
      try {
        const res = await getHistory(userId);
        setAiHistory(res.history || []);
      } catch (err) {
        console.error("History error:", err);
        setError("Failed to load AI activity history.");
      } finally {
        setLoadingAi(false);
      }
    })();

    // --- Notes from localStorage (Home + Dashboard) ---
    (async () => {
      try {
        const merged = [];
        const seen = new Set(); // duplicate avoid

        const pushNote = (raw, extra) => {
          const normalized = normalizeNote(raw, extra);
          const key = `${normalized.storageKey || extra.storageKey || "note"}-${
            normalized.id
          }`;
          if (seen.has(key)) return;
          seen.add(key);
          merged.push(normalized);
        };

        // 1) Home notes old format: "studyNotes"
        const homeOldRaw = safeParse(localStorage.getItem("studyNotes"));
        if (Array.isArray(homeOldRaw)) {
          homeOldRaw.forEach((n) => {
            // note jaisa hi lage tab hi
            const looksNote =
              n &&
              typeof n === "object" &&
              (n.content || n.body || n.text || n.title);
            if (!looksNote) return;
            pushNote(n, {
              storageKey: "studyNotes",
              userScoped: false,
              sourceLabel: "Home",
            });
          });
        } else if (homeOldRaw && typeof homeOldRaw === "object") {
          const mine = Array.isArray(homeOldRaw[userId])
            ? homeOldRaw[userId]
            : [];
          mine.forEach((n) => {
            const looksNote =
              n &&
              typeof n === "object" &&
              (n.content || n.body || n.text || n.title);
            if (!looksNote) return;
            pushNote(n, {
              storageKey: "studyNotes",
              userScoped: true,
              sourceLabel: "Home",
            });
          });
        }

        // 2) Home notes new format: "studyNotes_v2" (array OR map)
        const homeNewRaw = safeParse(localStorage.getItem("studyNotes_v2"));
        if (Array.isArray(homeNewRaw)) {
          homeNewRaw.forEach((n) => {
            const looksNote =
              n &&
              typeof n === "object" &&
              (n.content || n.body || n.text || n.title);
            if (!looksNote) return;
            pushNote(n, {
              storageKey: "studyNotes_v2",
              userScoped: false,
              sourceLabel: "Home",
            });
          });
        } else if (homeNewRaw && typeof homeNewRaw === "object") {
          const mine = Array.isArray(homeNewRaw[userId])
            ? homeNewRaw[userId]
            : [];
          mine.forEach((n) => {
            const looksNote =
              n &&
              typeof n === "object" &&
              (n.content || n.body || n.text || n.title);
            if (!looksNote) return;
            pushNote(n, {
              storageKey: "studyNotes_v2",
              userScoped: true,
              sourceLabel: "Home",
            });
          });
        }

        // 3) Dashboard quick notes: "dashboardQuickNotes_v2"
        const dashRaw = safeParse(
          localStorage.getItem("dashboardQuickNotes_v2")
        );
        if (dashRaw && typeof dashRaw === "object") {
          const mine = Array.isArray(dashRaw[userId]) ? dashRaw[userId] : [];
          mine.forEach((n) => {
            const looksNote =
              n &&
              typeof n === "object" &&
              (n.content || n.body || n.text || n.title);
            if (!looksNote) return;
            pushNote(n, {
              storageKey: "dashboardQuickNotes_v2",
              userScoped: true,
              sourceLabel: "Dashboard",
            });
          });
        }

        // 4) Generic fallback: agar Home notes kisi aur key me saved hon
        //    (e.g. "homeNotes", "homeQuickNotes_v2" etc.)
        try {
          const SKIP_KEYS = new Set([
            "user",
            "token",
            "theme",
            "studyNotes",
            "studyNotes_v2",
            "dashboardQuickNotes_v2",
          ]);

          Object.keys(localStorage || {}).forEach((key) => {
            if (SKIP_KEYS.has(key)) return;

            const parsed = safeParse(localStorage.getItem(key));
            if (!parsed) return;

            // case: simple array
            if (Array.isArray(parsed)) {
              parsed.forEach((n) => {
                const looksNote =
                  n &&
                  typeof n === "object" &&
                  (n.content || n.body || n.text) &&
                  (n.title || n.topic);
                if (!looksNote) return;
                pushNote(n, {
                  storageKey: key,
                  userScoped: false,
                  sourceLabel: "Home",
                });
              });
            }
            // case: per-user map
            else if (parsed && typeof parsed === "object") {
              const mine = Array.isArray(parsed[userId]) ? parsed[userId] : [];
              mine.forEach((n) => {
                const looksNote =
                  n &&
                  typeof n === "object" &&
                  (n.content || n.body || n.text) &&
                  (n.title || n.topic);
                if (!looksNote) return;
                pushNote(n, {
                  storageKey: key,
                  userScoped: true,
                  sourceLabel: "Home",
                });
              });
            }
          });
        } catch (err) {
          console.error("Generic notes scan error:", err);
        }

        // Final sort: pinned first, then latest first
        merged.sort((a, b) => {
          if (a.pinned === b.pinned) {
            return b.createdAt - a.createdAt;
          }
          return a.pinned ? -1 : 1;
        });

        setNotes(merged);
      } catch (e) {
        console.error("Notes load error:", e);
      } finally {
        setLoadingNotes(false);
      }
    })();
  }, [userId]);

  // ---------- LocalStorage update helpers ----------
  const updateStorageAfterChange = (noteId, storageKey, updater) => {
    if (!storageKey) return;
    try {
      const raw = safeParse(localStorage.getItem(storageKey));
      if (!raw) return;

      // per-user map
      if (typeof raw === "object" && !Array.isArray(raw)) {
        const obj = { ...raw };
        const arr = Array.isArray(obj[userId]) ? obj[userId] : [];
        obj[userId] = arr.map((n) =>
          String(n.id) === String(noteId) ? updater(n) : n
        );
        localStorage.setItem(storageKey, JSON.stringify(obj));
      }
      // plain array
      else if (Array.isArray(raw)) {
        const arr = raw.map((n) =>
          String(n.id) === String(noteId) ? updater(n) : n
        );
        localStorage.setItem(storageKey, JSON.stringify(arr));
      }
    } catch (e) {
      console.error("updateStorageAfterChange error:", e);
    }
  };

  const removeFromStorage = (noteId, storageKey) => {
    if (!storageKey) return;
    try {
      const raw = safeParse(localStorage.getItem(storageKey));
      if (!raw) return;

      if (typeof raw === "object" && !Array.isArray(raw)) {
        const obj = { ...raw };
        const arr = Array.isArray(obj[userId]) ? obj[userId] : [];
        obj[userId] = arr.filter((n) => String(n.id) !== String(noteId));
        localStorage.setItem(storageKey, JSON.stringify(obj));
      } else if (Array.isArray(raw)) {
        const arr = raw.filter((n) => String(n.id) !== String(noteId));
        localStorage.setItem(storageKey, JSON.stringify(arr));
      }
    } catch (e) {
      console.error("removeFromStorage error:", e);
    }
  };

  // ---------- Notes handlers ----------
  const handleCopyNote = (note) => {
    if (!note?.content) {
      toast.error("Nothing to copy");
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(note.content)
        .then(() => toast.success("Note copied"))
        .catch(() => toast.error("Failed to copy"));
    } else {
      toast.error("Clipboard not available");
    }
  };

  const handleDeleteNote = (note) => {
    const next = notes.filter(
      (n) =>
        !(
          String(n.id) === String(note.id) &&
          (n.storageKey || "") === (note.storageKey || "")
        )
    );
    setNotes(next);
    removeFromStorage(note.id, note.storageKey);
    toast.success("Note deleted");
  };

  const handleTogglePin = (note) => {
    const next = notes
      .map((n) =>
        String(n.id) === String(note.id) &&
        (n.storageKey || "") === (note.storageKey || "")
          ? { ...n, pinned: !n.pinned }
          : n
      )
      .sort((a, b) => {
        if (a.pinned === b.pinned) return b.createdAt - a.createdAt;
        return a.pinned ? -1 : 1;
      });

    setNotes(next);

    updateStorageAfterChange(note.id, note.storageKey, (n) => ({
      ...n,
      pinned: !n.pinned,
    }));
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-50 px-4">
      <div className="max-w-[1160px] mx-auto py-8 space-y-6">
        {/* Top header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
              <FiClock className="text-emerald-400" />
              Study History
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl">
              See all your AI questions, quizzes, summaries and personal notes
              in one place, with time and date.
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div className="inline-flex rounded-full bg-slate-900/80 border border-slate-800 p-1 text-xs md:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-1.5 rounded-full flex items-center gap-1 transition ${
              activeTab === "ai"
                ? "bg-emerald-400 text-slate-900 font-semibold shadow"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            <FiZap />
            AI Activity
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-1.5 rounded-full flex items-center gap-1 transition ${
              activeTab === "notes"
                ? "bg-cyan-400 text-slate-900 font-semibold shadow"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            <FiBookOpen />
            My Notes
          </button>
        </div>

        {/* Content area */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 md:p-6">
          {error && (
            <div className="mb-4 text-sm text-red-300 bg-red-900/30 border border-red-700/60 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {activeTab === "ai" ? (
            <AIHistoryList loading={loadingAi} items={aiHistory} />
          ) : (
            <NotesHistoryList
              loading={loadingNotes}
              notes={notes}
              onCopy={handleCopyNote}
              onDelete={handleDeleteNote}
              onTogglePin={handleTogglePin}
            />
          )}
        </section>
      </div>
    </div>
  );
};

// ---------- AI History List ----------
function AIHistoryList({ loading, items }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl bg-slate-800/60 h-16"
          />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-sm text-slate-300 text-center py-6">
        No AI activity yet. Ask a doubt, generate a quiz or create a summary
        from your dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const type = item.type || "chat";
        let typeLabel = "Chat";
        let typeClass = "bg-emerald-500/15 text-emerald-300";
        let icon = <FiHelpCircle />;

        if (type === "quiz") {
          typeLabel = "Quiz";
          typeClass = "bg-purple-500/15 text-purple-300";
          icon = <FiZap />;
        } else if (type === "summary") {
          typeLabel = "Summary";
          typeClass = "bg-amber-500/15 text-amber-300";
          icon = <FiBookOpen />;
        }

        const questionText =
          item.question || item.topic || "No question stored";
        const answerText = item.answer || "";

        return (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${typeClass}`}
                >
                  {icon}
                  {typeLabel}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <FiClock />
                {formatDate(item.createdAt)}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-1 line-clamp-2">
              <span className="font-semibold text-slate-100">Q: </span>
              {questionText}
            </p>
            <p className="text-xs text-slate-400 line-clamp-3">
              <span className="font-semibold text-slate-200">A: </span>
              {answerText}
            </p>
          </motion.article>
        );
      })}
    </div>
  );
}

// ---------- Notes History List ----------
function NotesHistoryList({ loading, notes, onCopy, onDelete, onTogglePin }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl bg-slate-800/60 h-16"
          />
        ))}
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <div className="text-sm text-slate-300 text-center py-6">
        No saved notes yet. Create notes from the Home or Dashboard quick notes
        section.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <motion.article
          key={`${note.storageKey || "note"}-${note.id}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <FiEdit3 className="text-cyan-300" />
                  {note.title || "Untitled note"}
                </span>
                {note.sourceLabel && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {note.sourceLabel}
                  </span>
                )}
              </p>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <FiClock />
                {formatDate(note.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onTogglePin(note)}
                title={note.pinned ? "Unpin note" : "Pin note"}
                className={`p-1.5 rounded-full border text-xs transition ${
                  note.pinned
                    ? "border-amber-400 text-amber-300 bg-amber-500/10"
                    : "border-slate-700 text-slate-300 hover:border-amber-300 hover:text-amber-300"
                }`}
              >
                <FiStar />
              </button>
              <button
                type="button"
                onClick={() => onCopy(note)}
                title="Copy note"
                className="p-1.5 rounded-full border border-slate-700 text-slate-300 text-xs hover:border-emerald-300 hover:text-emerald-300 transition"
              >
                <FiCopy />
              </button>
              <button
                type="button"
                onClick={() => onDelete(note)}
                title="Delete note"
                className="p-1.5 rounded-full border border-red-700/70 text-red-300 text-xs hover:bg-red-900/40 transition"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 whitespace-pre-wrap">
            {note.content}
          </p>
        </motion.article>
      ))}
    </div>
  );
}

export default History;
