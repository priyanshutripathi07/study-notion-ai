import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageCircle,
  FiArrowRight,
  FiSend,
  FiZap,
  FiHelpCircle,
  FiUsers,
  FiBookOpen,
  FiHeart,
  FiGithub,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";
import { toast } from "react-toastify";
import RobotContact from "../assets/robot-contact.png";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
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

const faqs = [
  {
    id: 1,
    q: "How is this platform useful for students?",
    a: "You can quickly ask doubts, generate quizzes, summarize your notes and track study targets at one place instead of jumping between multiple apps.",
  },
  {
    id: 2,
    q: "Is this project free to use?",
    a: "Yes, it is built as a learning and productivity tool for students. You can freely explore all the features added by Priyanshu.",
  },
  {
    id: 3,
    q: "Can I use this project idea for my own learning?",
    a: "Absolutely. You can get inspiration from the features, UI and workflow, and try building your own version to improve your skills.",
  },
  {
    id: 4,
    q: "Which skills does this project showcase?",
    a: "Modern React, Tailwind-based UI, framer-motion animations, REST APIs, authentication, localStorage usage and clean UX for study workflows.",
  },
];

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState(faqs[0].id);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "general",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill all required fields.");
      return;
    }
    setSending(true);

    // Fake send – yahan future me backend se integrate bhi kar sakte ho
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! Priyanshu will get back to you soon.");
      setForm({
        name: "",
        email: "",
        type: "general",
        message: "",
      });
    }, 900);
  };

  const userName = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u?.firstname || "there";
    } catch {
      return "there";
    }
  })();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-50 px-4">
      <motion.div
        className="max-w-[1160px] mx-auto py-8 md:py-10 space-y-8"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Top Hero Section */}
        <motion.header
          variants={fadeUp}
          className="grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)] gap-8 items-center"
        >
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 text-xs font-medium text-cyan-300 uppercase tracking-[0.22em]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
              Contact & Support
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
              Need help with studies or project doubts?
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-xl">
              Whether you are confused with DSA, stuck in a web dev bug, or want
              to understand how this project works, you can reach out directly
              from here. This space is built for students like you.
            </p>

            {/* Quick info line */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] md:text-xs text-slate-400 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-300">
                <FiZap size={12} />
                Fast student-focused replies
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-sky-500/50 bg-sky-500/10 text-sky-300">
                <FiBookOpen size={12} />
                Doubts, bugs, suggestions – all welcome
              </span>
            </div>
          </div>

          {/* Cute robot + contact summary */}
          <motion.div
            variants={fadeUp}
            className="relative rounded-2xl border border-slate-800 bg-slate-900/70 shadow-[0_0_40px_rgba(8,47,73,0.7)] overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.22),transparent_55%)]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-stretch gap-4 p-5">
              <motion.div
                className="flex-1 flex flex-col justify-between gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="text-sm md:text-base font-semibold text-slate-50 flex items-center gap-2">
                  <FiMessageCircle className="text-cyan-300" />
                  Talk to Priyanshu&apos;s AI study space
                </h2>
                <p className="text-xs text-slate-300">
                  Get help about the project, features, or your own study plan.
                  You can also share feedback to improve this tool for other
                  juniors.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <FiMail size={12} /> Support, doubts, feedback
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiUsers size={12} /> Mentorship-style guidance
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="flex-1 flex items-center justify-center"
                animate={{
                  y: [8, -8, 4],
                  x: [8, -6, 2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
              >
                <img
                  src={RobotContact}
                  alt="Contact robot assistant"
                  className="w-32 md:w-40 h-auto object-contain drop-shadow-[0_0_26px_rgba(34,211,238,0.75)]"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.header>

        {/* 3 Support cards (A + C ka mix) */}
        <motion.section
          variants={fadeUp}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {/* General queries */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-xl bg-sky-500/15 text-sky-300">
                <FiMail />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  General questions
                </h3>
                <p className="text-xs text-slate-400">
                  Ask about project features, usage, or improvements.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Ideal if you want to understand how any panel works or request a
              new feature for students.
            </p>
          </div>

          {/* Technical / bug support */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300">
                <FiZap />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Technical & bugs
                </h3>
                <p className="text-xs text-slate-400">
                  Something broken in dashboard, quiz or notes?
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Share error messages, screenshots or steps. This helps Priyanshu
              fix issues faster and keep the project stable.
            </p>
          </div>

          {/* Mentorship / seniors connect */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-xl bg-violet-500/15 text-violet-300">
                <FiUsers />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-50">
                  Study & roadmap help
                </h3>
                <p className="text-xs text-slate-400">
                  Need basic direction for DSA or web dev roadmap?
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Use this when you want guidance on what to learn next, how to use
              this project in your daily study routine, or how to show it in
              your resume.
            </p>
          </div>
        </motion.section>

        {/* Main body: Form + FAQ */}
        <motion.section
          variants={fadeUp}
          className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] gap-6"
        >
          {/* Left: Contact form */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-6 space-y-4 shadow-[0_0_36px_rgba(8,47,73,0.55)]"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-slate-50">
                  Send a message
                </h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Hey {userName}, tell what you need help with. Short and clear
                  messages work best.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                <FiHeart className="text-pink-400" />
                Built with care by Priyanshu
              </span>
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="text-xs md:text-sm text-slate-200 space-y-1">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="mt-1 w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                  />
                </label>
                <label className="text-xs md:text-sm text-slate-200 space-y-1">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="mt-1 w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                  />
                </label>
              </div>

              <label className="text-xs md:text-sm text-slate-200 space-y-1 block">
                What is this about?
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
                >
                  <option value="general">General question</option>
                  <option value="bug">Bug / technical issue</option>
                  <option value="feature">Feature suggestion</option>
                  <option value="mentorship">Study / roadmap guidance</option>
                </select>
              </label>

              <label className="text-xs md:text-sm text-slate-200 space-y-1 block">
                Your message
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your doubt or message clearly…"
                  className="mt-1 w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 resize-none"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 text-slate-900 text-xs md:text-sm font-semibold px-4 py-2 hover:bg-emerald-300 active:scale-95 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send message
                    </>
                  )}
                </button>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <FiPhone size={12} /> Response time may vary, but your
                    message matters.
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin size={12} /> Built for students, from student
                    life.
                  </span>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Right: FAQ + social links */}
          <motion.div variants={fadeUp} className="space-y-4">
            {/* FAQ block */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 md:p-5">
              <div className="flex items-center justify-between mb-3 gap-2">
                <div>
                  <h2 className="text-sm md:text-base font-semibold text-slate-50 flex items-center gap-2">
                    <FiHelpCircle className="text-amber-300" />
                    Frequently asked by students
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Small FAQ to understand why & how to use this project
                    better.
                  </p>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                {faqs.map((f) => {
                  const open = activeFaq === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFaq(open ? null : f.id)}
                      className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-xs md:text-sm text-slate-100 hover:border-cyan-400/60 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{f.q}</span>
                        <FiArrowRight
                          className={
                            "text-slate-400 transition-transform " +
                            (open ? "rotate-90 text-cyan-300" : "")
                          }
                          size={14}
                        />
                      </div>
                      {open && (
                        <p className="mt-1.5 text-[11px] md:text-xs text-slate-300">
                          {f.a}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social / external links strip */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Connect with the builder
                </p>
                <p className="text-sm text-slate-100">
                  Designed & developed by{" "}
                  <span className="text-emerald-300 font-semibold">
                    Priyanshu Tripathi
                  </span>
                  . Use this project idea in your own learning journey.
                </p>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <a
                  href="https://github.com/priyanshutripathi07"
                  className="p-2 rounded-full border border-slate-700 hover:border-slate-300 hover:text-slate-50 transition"
                  aria-label="GitHub"
                >
                  <FiGithub />
                </a>
                <a
                  href="https://www.linkedin.com/in/priyanshu-tripathi-ab932b378?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  className="p-2 rounded-full border border-slate-700 hover:border-sky-300 hover:text-sky-300 transition"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin />
                </a>
                <a
                  href="https://www.instagram.com/priyanshu_070830?igsh=amgxdXdtdWo1MXI0"
                  className="p-2 rounded-full border border-slate-700 hover:border-pink-400 hover:text-pink-400 transition"
                  aria-label="Instagram"
                >
                  <FiInstagram />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Contact;
