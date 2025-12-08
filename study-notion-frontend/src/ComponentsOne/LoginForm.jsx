import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../utils/api";

const LoginForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submitHandler(e) {
    e.preventDefault();

    try {
      const resp = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!resp || resp.error) {
        let msg =
          "No account found for these details. Please check your email/password or sign up first.";

        if (typeof resp?.error === "string" && resp.error.trim().length > 0) {
          const raw = resp.error.toLowerCase();
          if (raw.includes("invalid") || raw.includes("not found")) {
            // same friendly msg rehne do
          } else {
            msg = resp.error;
          }
        }

        toast.error(msg, { autoClose: 4000 });
        return;
      }

      const { token, user } = resp;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoggedIn(true);
      toast.success("Logged in successfully ✨", { autoClose: 2500 });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err);

      toast.error(
        "No account found for these details. Please check your email/password or sign up first.",
        { autoClose: 4000 }
      );
    }
  }

  const handleForgot = (e) => {
    e.preventDefault();
    toast.info("Forgot password? For now, please create a new account.");
  };

  return (
    <form
      onSubmit={submitHandler}
      className="mt-5 flex flex-col w-full gap-4 text-sm text-slate-100"
    >
      <label className="w-full">
        <p className="text-[0.8rem] text-slate-200 mb-1">
          Email Address<span className="text-red-400 ml-0.5">*</span>
        </p>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          placeholder="Enter email"
          className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 w-full text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/70 focus:border-emerald-400"
        />
      </label>

      <label className="w-full relative">
        <p className="text-[0.8rem] text-slate-200 mb-1">
          Password<span className="text-red-400 ml-0.5">*</span>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={changeHandler}
          placeholder="Enter password"
          className="bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 w-full text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400/70 focus:border-emerald-400 pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-[32px] text-slate-400 hover:text-slate-200"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible fontSize={20} />
          ) : (
            <AiOutlineEye fontSize={20} />
          )}
        </button>

        <button
          type="button"
          onClick={handleForgot}
          className="text-[0.7rem] mt-1 text-sky-300 hover:text-sky-200 max-w-max ml-auto"
        >
          Forgot password?
        </button>
      </label>

      <button
        type="submit"
        className="mt-2 bg-emerald-400 hover:bg-emerald-300 rounded-xl font-semibold text-slate-950 px-3 py-2.5 text-sm shadow-[0_12px_28px_rgba(16,185,129,0.5)] transition transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Sign in
      </button>

      <p className="text-[0.75rem] text-slate-500 mt-1">
        Tip: Use the same email/password you used while signing up. If you
        forgot, just create a new account.
      </p>
    </form>
  );
};

export default LoginForm;
