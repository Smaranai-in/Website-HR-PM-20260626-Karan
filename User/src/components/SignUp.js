import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaSpinner, // Added Spinner Icon
} from "react-icons/fa";
import { supabase } from "../supabaseClient";
import { useAuthModal } from "../context/AuthModalContext";

function SignUp({ onClose, onSubmit, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conformPassword, setConformPassword] = useState("");

  const [nameFocus, setNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [loading, setLoading] = useState(false); // Added Loading State
  const { signup } = useAuthModal();

  const passwordRules = [
    { text: "Minimum 6 characters", regex: /^.{6,}$/ },
    { text: "At least one uppercase letter", regex: /[A-Z]/ },
    { text: "At least one lowercase letter", regex: /[a-z]/ },
    { text: "Contains numbers", regex: /[0-9]/ },
    { text: "Contains special characters (@, _)", regex: /[@_]/ },
  ];

  const handregister = async (e) => {
    e.preventDefault();

    // Password rules
    const invalidRule = passwordRules.find(
      (rule) => !rule.regex.test(password)
    );
    if (invalidRule) {
      toast.error(`Password invalid: ${invalidRule.text}`);
      return;
    }

    if (password !== conformPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true); // Start Loading

    try {
      await signup(email, password);
      toast.success("verification mail send to your email");
      setLoading(false); // Stop Loading on success

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false); // Stop Loading on error
    }
  };

  return (
    <AnimatePresence>
      {/* 🔹 Dark overlay background */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }} // was 0.6, now lighter
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" // was bg-black/70
      ></motion.div>

      {/* Login Box */}
      <motion.div
        key="login"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.25 }}
        className="
    fixed top-[85px] right-2 sm:right-10 md:right-24 z-[9999]
    bg-white/60 dark:bg-[#0E1835]/60  // was /80 — more transparent
    backdrop-blur-lg shadow-2xl rounded-2xl p-8 sm:p-10 w-[90%] max-w-[380px]
    border border-emerald-100 dark:border-teal-700/40
    text-gray-800 dark:text-gray-100
  "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-emerald-400 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-8">
          Sign Up
        </h1>

        {/* 🔹 Name Field */}
        <div className="relative mb-6">
          <label
            className={`absolute left-3 transition-all ${
              nameFocus
                ? "text-xs -top-3 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 top-2.5 text-sm"
            }`}
          >
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none focus:border-emerald-500 py-2 px-3 pr-10"
            onFocus={() => setNameFocus(true)}
            onBlur={(e) => !e.target.value && setNameFocus(false)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400">
            <FaUser />
          </span>
        </div>

        {/* 🔹 Email Field */}
        <div className="relative mb-6">
          <label
            className={`absolute left-3 transition-all ${
              emailFocus
                ? "text-xs -top-3 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 top-2.5 text-sm"
            }`}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none focus:border-emerald-500 py-2 px-3 pr-10"
            onFocus={() => setEmailFocus(true)}
            onBlur={(e) => !e.target.value && setEmailFocus(false)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400">
            <FaEnvelope />
          </span>
        </div>

        {/* 🔹 Password Field */}
        <div className="relative mb-6">
          <label
            className={`absolute left-3 transition-all ${
              passwordFocus
                ? "text-xs -top-3 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 top-2.5 text-sm"
            }`}
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none focus:border-emerald-500 py-2 px-3 pr-10"
            onFocus={() => {
              setPasswordFocus(true);
              setShowRules(true);
            }}
            onBlur={(e) => {
              !e.target.value && setPasswordFocus(false);
              setShowRules(false);
            }}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

          {/* Password Rules */}
          {showRules && (
            <div className="absolute left-0 mt-1 p-3 bg-emerald-50 dark:bg-[#1B294E] border border-emerald-200 dark:border-teal-600 rounded-md shadow-md text-xs z-50 w-full">
              <p className="font-semibold mb-1 flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <FaInfoCircle /> Password must contain:
              </p>
              <ul className="list-disc list-inside ml-2">
                {passwordRules.map((rule) => (
                  <li
                    key={rule.text}
                    className={
                      rule.regex.test(password)
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-600 dark:text-gray-300"
                    }
                  >
                    {rule.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 🔹 Confirm Password */}
        <div className="relative mb-8">
          <label
            className={`absolute left-3 transition-all ${
              confirmFocus
                ? "text-xs -top-3 text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 top-2.5 text-sm"
            }`}
          >
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            value={conformPassword}
            onChange={(e) => setConformPassword(e.target.value)}
            className="w-full border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none focus:border-emerald-500 py-2 px-3 pr-10"
            onFocus={() => setConfirmFocus(true)}
            onBlur={(e) => !e.target.value && setConfirmFocus(false)}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400 cursor-pointer"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* 🔹 Submit Button with Loading */}
        <button
          onClick={handregister}
          disabled={loading}
          className={`w-full py-2 text-white rounded-full font-semibold 
            bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
            hover:opacity-90 transition-transform duration-150 
            focus:scale-95 active:scale-95 focus:outline-none
            ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Processing...
            </div>
          ) : (
            "Submit"
          )}
        </button>

        {/* 🔹 Login link */}
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
          Already have an account?{" "}
          <button
            onClick={onLogin}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default SignUp;