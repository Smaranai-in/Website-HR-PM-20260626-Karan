import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { AuthProvider } from "../chatApp/components/AuthProvider";
import ClientDashboard from "../chatApp/pages/Client/Dashboard";
import { X } from "lucide-react";
import { FaRobot } from "react-icons/fa6";


export default function ChatWidget({ onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);


  // Get logged in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user || null);
      setLoading(false);
    });
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (loading) {
    return (
      <div
        className="fixed bottom-24 right-6 z-[9999] flex items-center justify-center rounded-2xl shadow-2xl"
        style={{ width: "420px", height: "600px", background: "#0f172a" }}
      >
        <div className="flex flex-col items-center gap-3 text-white">
          <FaRobot className="w-10 h-10 text-emerald-400 animate-pulse" />
          <span className="text-sm text-gray-400">Loading chat...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`fixed bottom-24 right-6 z-[9999] flex flex-col items-center justify-center gap-4
          rounded-2xl shadow-2xl p-8 text-center text-white transition-all duration-300
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        style={{
          width: "320px",
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <FaRobot className="w-12 h-12 text-emerald-400" />
        <p className="font-semibold text-lg">Please log in to use chat</p>
        <p className="text-sm text-gray-400">
          You need to be logged in to message our team.
        </p>
        <button
          onClick={handleClose}
          className="mt-2 px-6 py-2 rounded-lg font-semibold text-white"
          style={{ background: "linear-gradient(to right, #10b981, #06b6d4)" }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-24 right-6 z-[9999] flex flex-col overflow-hidden rounded-2xl shadow-2xl
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{
        width: "420px",
        height: "600px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "#0f172a",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0"
        style={{
          height: "60px",
          background: "linear-gradient(to right, #10b981, #0891b2)",
        }}
      >
        <div className="flex items-center gap-3">
          <FaRobot className="w-7 h-7 text-white" />
          <span className="font-semibold text-white text-base">
            Support Chat
          </span>
        </div>
        <button
          onClick={handleClose}
          className="flex items-center justify-center w-8 h-8 rounded-full text-white hover:bg-white/20 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Chat body */}
      <div className="flex-1 overflow-hidden">
        <AuthProvider>
          <ClientDashboard />
        </AuthProvider>
      </div>
    </div>
  );
}