import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaEnvelope, FaSpinner } from "react-icons/fa"; // Added FaSpinner
import { supabase } from "../supabaseClient";
import { useAuthModal } from "../context/AuthModalContext";

function ForgotEmail({ setemail, onClose, onSubmit }) {
  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [loading, setLoading] = useState(false); // Added Loading State
  const { forgotPassword } = useAuthModal();

  const handlesubmit = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true); // Start Loading

    try {
      await forgotPassword(email);
      toast.success("reset-password sent to your Email");
      localStorage.setItem("Login", "True");
      
      setLoading(false); // Stop Loading on success

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      toast.error(error.message);
      setLoading(false); // Stop Loading on error
    }
  };

  return (
    <AnimatePresence>
      {/* 🔹 Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
      />

      {/* Box */}
      <motion.div
        key="forgot"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.25 }}
        className="
          fixed top-[85px] right-2 sm:right-10 md:right-24 z-[9999]
          bg-white/60 dark:bg-[#0E1835]/60
          backdrop-blur-lg shadow-2xl rounded-2xl
          p-8 sm:p-10 w-[90%] max-w-[380px]
          border border-emerald-100 dark:border-teal-700/40
          text-gray-800 dark:text-gray-100
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-emerald-400 text-lg font-bold"
        >
          ✕
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-8">
          Reset Password
        </h1>

        {/* Email Field */}
        <div className="relative mb-8">
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
            className="
              w-full border-b-2 border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-gray-100 bg-transparent
              focus:outline-none focus:border-emerald-500
              py-2 px-3 pr-10
            "
            onFocus={() => setEmailFocus(true)}
            onBlur={(e) => !e.target.value && setEmailFocus(false)}
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 dark:text-emerald-400">
            <FaEnvelope />
          </span>
        </div>

        {/* Submit Button with Loading */}
        <button
          onClick={handlesubmit}
          disabled={loading}
          className={`
            w-full py-2 text-white rounded-full font-semibold
            bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
            hover:opacity-90 transition-transform duration-150
            focus:scale-95 active:scale-95 focus:outline-none
            ${loading ? "opacity-75 cursor-not-allowed" : ""}
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Sending...
            </div>
          ) : (
            "Send Reset Link"
          )}
        </button>

        {/* Hint text */}
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
          We’ll send a password reset link to your email.
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default ForgotEmail;