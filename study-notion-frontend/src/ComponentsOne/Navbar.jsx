import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiInfo,
  FiPhone,
  FiClock,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";

function NavLink({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={
        "inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[13px] transition-all " +
        (active
          ? "text-emerald-300 font-semibold bg-slate-800 border border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.3)] scale-[1.05]"
          : "text-slate-300 hover:text-white hover:bg-slate-800/60 hover:scale-[1.07]")
      }
    >
      {icon} {label}
    </Link>
  );
}

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const loc = useLocation();
  const [menu, setMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isDash = loc.pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-[1160px] mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="logo"
            className="w-16 h-16 rounded-xl object-cover shadow-[0_0_20px_rgba(0,255,200,0.3)]"
          />
          <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            StudyNotion
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink
            to="/"
            icon={<FiHome size={15} />}
            label="Home"
            active={loc.pathname === "/"}
          />
          <NavLink
            to="/about"
            icon={<FiInfo size={15} />}
            label="About"
            active={loc.pathname === "/about"}
          />
          <NavLink
            to="/contact"
            icon={<FiPhone size={15} />}
            label="Contact"
            active={loc.pathname === "/contact"}
          />
          <NavLink
            to="/history"
            icon={<FiClock size={15} />}
            label="History"
            active={loc.pathname === "/history"}
          />

          {/* Dashboard CTA */}
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className={
                "relative inline-flex items-center gap-2 px-5 py-2 rounded-2xl font-semibold text-[13px] " +
                "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 shadow-[0_0_28px_rgba(34,197,235,0.7)] " +
                "hover:brightness-110 hover:scale-[1.08] transition-all"
              }
            >
              Dashboard
              {/* ACTIVE Pulse Dot */}
              {isDash && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-600 rounded-full animate-pulse" />
              )}
            </Link>
          )}

          {/* AUTH buttons */}
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-[13px] border border-slate-600 text-slate-100 hover:border-cyan-400 hover:text-cyan-300 transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-900 text-[13px] font-semibold hover:bg-yellow-300 transition-all"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="px-3 py-2 rounded-full border border-slate-600 hover:border-emerald-400 transition"
              >
                <FiUser />
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500/90 text-white hover:bg-red-400 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggler */}
        <button
          className="md:hidden text-slate-200 text-xl"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menu && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 p-3">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/"
              label="Home"
              icon={<FiHome />}
              active={loc.pathname === "/"}
              onClick={() => setMenu(false)}
            />
            <NavLink
              to="/about"
              label="About"
              icon={<FiInfo />}
              active={loc.pathname === "/about"}
              onClick={() => setMenu(false)}
            />
            <NavLink
              to="/contact"
              label="Contact"
              icon={<FiPhone />}
              active={loc.pathname === "/contact"}
              onClick={() => setMenu(false)}
            />
            <NavLink
              to="/history"
              label="History"
              icon={<FiClock />}
              active={loc.pathname === "/history"}
              onClick={() => setMenu(false)}
            />

            {isLoggedIn && (
              <Link
                to="/dashboard"
                onClick={() => setMenu(false)}
                className="relative mt-1 flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold"
              >
                Dashboard
                {isDash && (
                  <span className="absolute -top-1 right-2 w-2 h-2 bg-emerald-700 rounded-full animate-pulse" />
                )}
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-center px-4 py-2 rounded-xl border border-slate-600 text-white"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-center px-4 py-2 rounded-xl bg-yellow-400 text-slate-900 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                className="px-4 py-2 rounded-xl bg-red-500/90 text-white"
                onClick={() => {
                  setMenu(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
