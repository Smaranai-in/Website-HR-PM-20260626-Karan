import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaInfoCircle, FaSpinner } from "react-icons/fa";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";

function ForgotOtpVerify() {
  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuthModal();
  const navigate = useNavigate();

  const passwordRules = [
    { text: "Minimum 6 characters", regex: /^.{6,}$/ },
    { text: "At least one uppercase letter", regex: /[A-Z]/ },
    { text: "At least one lowercase letter", regex: /[a-z]/ },
    { text: "Contains numbers", regex: /[0-9]/ },
    { text: "Contains special characters (@, _)", regex: /[@_]/ },
  ];

  const handlesubmit = async () => {
    const invalidRule = passwordRules.find(
      (rule) => !rule.regex.test(password)
    );

    if (invalidRule) {
      toast.error(`Password invalid: ${invalidRule.text}`);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(password);
      toast.success("Password updated successfully");
      

      setLoading(false);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    // 🔹 Full Page Container
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3 }}
          className="
            relative w-full max-w-[400px]
            bg-white/80 dark:bg-[#0E1835]/80
            backdrop-blur-xl shadow-2xl rounded-2xl
            p-8 sm:p-10
            border border-emerald-100 dark:border-teal-700/40
            text-gray-800 dark:text-gray-100
          "
        >
          {/* Close / Cancel Button -> Navigates Home */}
          

          {/* Header */}
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent mb-8">
            Set New Password
          </h1>

          {/* Password Field */}
          <div className="relative mb-6">
            <label
              className={`absolute left-3 transition-all ${
                passwordFocus
                  ? "text-xs -top-3 text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 top-2.5 text-sm"
              }`}
            >
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                setPasswordFocus(true);
                setShowRules(true);
              }}
              onBlur={(e) => {
                !e.target.value && setPasswordFocus(false);
                setShowRules(false);
              }}
              className="w-full border-b-2 border-gray-300 dark:border-gray-600 bg-transparent py-2 px-3 pr-10 focus:outline-none focus:border-emerald-500 transition-colors"
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-emerald-500 hover:text-emerald-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {/* Password Rules Tooltip */}
            {showRules && (
              <div className="absolute left-0 mt-2 p-3 bg-emerald-50 dark:bg-[#1B294E] border border-emerald-200 dark:border-teal-600 rounded-lg shadow-lg text-xs z-50 w-full">
                <p className="font-semibold mb-2 flex items-center gap-1 text-emerald-800 dark:text-emerald-400">
                  <FaInfoCircle /> Password must contain:
                </p>
                <ul className="space-y-1 ml-1">
                  {passwordRules.map((rule) => (
                    <li
                      key={rule.text}
                      className={`flex items-center gap-2 ${
                        rule.regex.test(password)
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          rule.regex.test(password)
                            ? "bg-emerald-500"
                            : "bg-gray-400"
                        }`}
                      />
                      {rule.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handlesubmit}
            disabled={loading}
            className={`w-full py-2.5 text-white rounded-full font-bold shadow-lg 
            bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
            hover:shadow-emerald-500/30 hover:scale-[1.02] 
            active:scale-[0.98] transition-all duration-200
            ${loading ? "opacity-75 cursor-not-allowed transform-none" : ""}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin text-lg" /> Updating...
              </div>
            ) : (
              "Update Password"
            )}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ForgotOtpVerify;