// src/ComponentsOne/Tempelate.jsx
import React from "react";
import { motion } from "framer-motion";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { FiBookOpen, FiTarget } from "react-icons/fi";

import RobotLogin from "../assets/robot-login-small.png";
import RobotSignup from "../assets/robot-signup-small.png";

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const Tempelate = ({ title, desc1, desc2, image, formtype, setIsLoggedIn }) => {
  const robotImg = formtype === "signup" ? RobotSignup : RobotLogin;

  return (
    <motion.main
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="w-11/12 max-w-[1160px] mx-auto py-10"
      aria-labelledby="auth-heading"
    >
      <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-10">
        {/* LEFT: Card + robot + form */}
        <section
          className="w-full md:w-1/2"
          aria-label="Authentication form"
        >
          <div className="rounded-3xl bg-slate-900/95 border border-slate-800 shadow-[0_18px_40px_rgba(15,23,42,0.9)] px-6 py-7 sm:px-8 sm:py-8 relative overflow-hidden">
            {/* soft gradient */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.16),transparent_60%)] opacity-80" />

            <div className="relative z-10">
              {/* small robot pill – thoda bada */}
              <motion.div
                className="mb-5 inline-flex items-center gap-3 rounded-full bg-slate-950/90 border border-slate-700/80 px-4 py-1.5 pr-4.5 shadow-[0_12px_30px_rgba(15,23,42,0.9)]"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900/90 flex items-center justify-center overflow-hidden">
                  <motion.img
                    src={robotImg}
                    alt="Auth robot"
                    className="w-[120%] h-[120%] object-contain"
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span className="text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[0.18em] text-emerald-300">
                  Priyanshu.AI secure portal
                </span>
              </motion.div>

              <motion.h1
                id="auth-heading"
                variants={containerVariants}
                className="text-white font-semibold text-[1.9rem] leading-[2.3rem]"
              >
                {title}
              </motion.h1>

              <motion.p
                variants={containerVariants}
                className="text-[0.95rem] leading-6 mt-3 text-slate-300"
              >
                <span className="block">{desc1}</span>
                <span className="block text-sky-300 mt-1">{desc2}</span>
              </motion.p>

              <div className="mt-6">
                {formtype === "signup" ? (
                  <SignUpForm setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <LoginForm setIsLoggedIn={setIsLoggedIn} />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: animated illustration with shine + small text */}
        <aside className="w-full md:w-1/2 flex items-center justify-center md:justify-end">
          <motion.div
            variants={containerVariants}
            className="w-[260px] sm:w-[320px] md:w-[380px] relative"
            aria-hidden="true"
          >
            {/* glow behind */}
            <div className="absolute -inset-10 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.22),transparent_60%)] blur-2xl opacity-90" />

            {/* main hero image with movement + shine */}
            <motion.div
              className="relative rounded-3xl overflow-hidden border border-slate-800/80 shadow-[0_18px_45px_rgba(15,23,42,0.95)] bg-slate-950"
              animate={{
                boxShadow: [
                  "0 18px 45px rgba(8,47,73,0.9)",
                  "0 18px 60px rgba(6,182,212,0.6)",
                  "0 18px 45px rgba(8,47,73,0.9)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* shine layer */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-emerald-400/5 via-transparent to-cyan-300/12 mix-blend-screen" />
              <motion.img
                src={image} // 👈 path same, sirf animation add
                alt="Study illustration"
                width={480}
                height={480}
                loading="lazy"
                className="relative w-full h-auto object-cover"
                animate={{
                  y: [0, -10, 0],
                  rotate: [-1.2, 1.2, -1.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* small info card niche side me */}
            <motion.div
              className="absolute -bottom-5 left-4 right-4 rounded-2xl bg-slate-950/95 border border-slate-800 px-3 py-2.5 flex items-center justify-between gap-2 text-[0.7rem] sm:text-[0.75rem]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <FiBookOpen size={13} />
                </span>
                <div>
                  <p className="font-semibold text-slate-100">
                    Built for students
                  </p>
                  <p className="text-[0.7rem] text-slate-400">
                    Doubts, quizzes & notes in one workspace.
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="inline-flex items-center gap-1 text-emerald-300 text-[0.7rem]">
                  <FiTarget size={12} />
                  Exam ready
                </span>
                <span className="text-[0.65rem] text-slate-500">
                  No ads • study only
                </span>
              </div>
            </motion.div>
          </motion.div>
        </aside>
      </div>
    </motion.main>
  );
};

export default Tempelate;
