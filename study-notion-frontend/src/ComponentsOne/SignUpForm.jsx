import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../utils/api";

const SignUpForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function changeHandler(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    if (!formData.firstname.trim()) {
      toast.error("Please enter your first name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const resp = await signup({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        password: formData.password,
        accountType,
      });

      if (resp.error) {
        toast.error(resp.error || "Signup failed");
        return;
      }

      const { token, user } = resp;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoggedIn?.(true);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error", err);
      toast.error("Signup failed. Please try again.");
    }
  }

  return (
    <form
      onSubmit={submitHandler}
      className="mt-4 flex flex-col gap-4 text-sm text-slate-100"
    >
      {/* Account type toggle */}
      <div className="flex w-full sm:w-auto justify-between sm:justify-start bg-slate-900/80 border border-slate-700/80 rounded-full p-1 text-xs mb-1 gap-1">
        <button
          type="button"
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-full transition ${
            accountType === "student"
              ? "bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-semibold shadow-[0_8px_18px_rgba(16,185,129,0.35)]"
              : "text-slate-300 hover:text-slate-100"
          }`}
          onClick={() => setAccountType("student")}
        >
          Student
        </button>
        <button
          type="button"
          className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-full transition ${
            accountType === "instructor"
              ? "bg-gradient-to-r from-emerald-400 to-cyan-300 text-slate-950 font-semibold shadow-[0_8px_18px_rgba(16,185,129,0.35)]"
              : "text-slate-300 hover:text-slate-100"
          }`}
          // value same: "instructor", label changed:
          onClick={() => setAccountType("instructor")}
        >
          Exam mode
        </button>
      </div>

      {/* Name fields */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="w-full">
          <p className="text-[0.8rem] text-slate-200 mb-1.5">
            First name<span className="text-red-400">*</span>
          </p>
          <input
            required
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={changeHandler}
            placeholder="Enter first name"
            className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
          />
        </label>

        <label className="w-full">
          <p className="text-[0.8rem] text-slate-200 mb-1.5">Last name</p>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={changeHandler}
            placeholder="Enter last name (optional)"
            className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
          />
        </label>
      </div>

      {/* Email */}
      <label className="w-full">
        <p className="text-[0.8rem] text-slate-200 mb-1.5">
          Email address<span className="text-red-400">*</span>
        </p>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          placeholder="you@example.com"
          className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
        />
      </label>

      {/* Passwords */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label className="relative w-full">
          <p className="text-[0.8rem] text-slate-200 mb-1.5">
            Create password<span className="text-red-400">*</span>
          </p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="At least 6 characters"
            className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 pr-9"
          />
          <button
            type="button"
            className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-200"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible fontSize={18} />
            ) : (
              <AiOutlineEye fontSize={18} />
            )}
          </button>
          <p className="mt-1 text-[0.7rem] text-slate-500">
            Minimum 6 characters required.
          </p>
        </label>

        <label className="relative w-full">
          <p className="text-[0.8rem] text-slate-200 mb-1.5">
            Confirm password<span className="text-red-400">*</span>
          </p>
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={changeHandler}
            placeholder="Re-enter your password"
            className="w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 pr-9"
          />
          <button
            type="button"
            className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-200"
            onClick={() => setShowConfirmPassword((s) => !s)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible fontSize={18} />
            ) : (
              <AiOutlineEye fontSize={18} />
            )}
          </button>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-sm py-2.5 transition shadow-[0_10px_25px_rgba(16,185,129,0.35)] active:scale-[0.98]"
      >
        Create account
      </button>
    </form>
  );
};

export default SignUpForm;
