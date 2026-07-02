import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

function SignUpOtp({ email, onClose, onSubmit }) {
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const BASE_URL =process.env.REACT_APP_API_URL;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handlesubmit = async (e) => {
    e?.preventDefault();
    try {
      const OTP = otp.join("").trim();
      if (OTP.length === 0) {
        toast.error("Please enter OTP");
        return;
      }

      const user = { email, OTP };
      const result = await axios.post(
        `${BASE_URL}/api/user/verifyEmail`,
        user,
        { withCredentials: true }
      );

      toast.success(result.data.message);
      setTimeout(() => onSubmit(), 1000);
    } catch (error) {
      if (error.response) toast.error(error.response.data.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {/* 🔹 Overlay Background */}
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
          Enter OTP
        </h1>

        {/* OTP Input Fields */}
        <div className="flex justify-between mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onFocus={(e) => e.target.select()}
              className="
                w-10 h-12 text-center text-lg font-semibold
                border-b-2 border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-gray-100
                bg-transparent rounded-md
                focus:border-emerald-500 dark:focus:border-emerald-400
                focus:text-emerald-600 dark:focus:text-emerald-400
                outline-none transition-all duration-150
              "
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handlesubmit}
          className="
            w-full py-2 text-white rounded-full font-semibold
            bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
            hover:opacity-90 transition-transform duration-150
            focus:scale-95 active:scale-95 focus:outline-none cursor-pointer
          "
        >
          Verify OTP
        </button>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-700 dark:text-gray-300 mt-6">
          OTP sent to{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {email}
          </span>
        </p>
      </motion.div>
    </AnimatePresence>
  );
}

export default SignUpOtp;
