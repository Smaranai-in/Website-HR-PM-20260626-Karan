import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaSpinner // Added Spinner Icon
} from "react-icons/fa";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";

function Login({ onClose, onSignup, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added Loading State
  const { login, loginWithGoogle } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();

  const handlelogin = async () => {
    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login successful!");
      setLoading(false);

      // Redirect to originally intended page, or home
      const from = location.state?.from?.pathname || "/";
      setTimeout(() => {
        onClose();
        if (from !== "/") navigate(from, { replace: true });
      }, 600);

    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <AnimatePresence>
      {/* Overlay */}
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-emerald-400 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-8">
          Login
        </h1>

        {/* Email Field */}
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

        {/* Password Field */}
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
            onFocus={() => setPasswordFocus(true)}
            onBlur={(e) => !e.target.value && setPasswordFocus(false)}
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Login Button with Loading */}
        <button
          onClick={handlelogin}
          disabled={loading}
          className={`w-full py-2 text-white rounded-full font-semibold 
            bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
            hover:opacity-90 transition-transform duration-150 focus:scale-95 active:scale-95 focus:outline-none
            ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* Forgot Password */}
        <div className="text-right mt-3">
          <button
            onClick={onForgot}
            className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          <span className="mx-3 text-gray-500 dark:text-gray-400 font-medium">
            or
          </span>
          <hr className="flex-1 border-gray-300 dark:border-gray-600" />
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-full hover:bg-gradient-to-r from-emerald-500 to-cyan-500 hover:text-white transition-all duration-150"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium text-gray-700 dark:text-gray-200 cursor-pointer">
            Sign in with Google
          </span>
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
          Don’t have an account?{" "}
          <button
            onClick={onSignup}
            className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default Login;