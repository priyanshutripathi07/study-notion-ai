// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./ComponentsOne/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import History from "./Pages/History";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const KEY = "sn_desktop_tip_shown_v2";

    if (!localStorage.getItem(KEY)) {
      setTimeout(() => {
        toast.info(
          "Tip: For the best experience, open this site in desktop mode (or enable 'Desktop site' in your browser).",
          {
            autoClose: 12000,
          }
        );
      }, 1200);

      localStorage.setItem(KEY, "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="flex-1 pt-4 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/history" element={<History />} />

          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile setIsLoggedIn={setIsLoggedIn} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/signup"
            element={<Signup setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="py-5 text-center text-xs md:text-sm text-slate-500 border-t border-slate-800">
        Made with ❤ by{" "}
        <span className="text-sky-300 font-semibold">Priyanshu Tripathi</span>
      </footer>
    </div>
  );
}
