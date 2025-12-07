// src/ComponentsOne/Footer.jsx
import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t mt-6">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-300">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          Made with ❤️ by <span className="font-semibold">Priyanshu Tripathi</span> — <span className="italic">StudyNotion</span>
        </motion.div>
        <div className="text-xs mt-1">Built with React, Tailwind & OpenRouter/HF — mobile-first</div>
      </div>
    </footer>
  );
}
