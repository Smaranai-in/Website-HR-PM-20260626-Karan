import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";
import { 
    ChevronLeft, FileText, Calendar, CheckCircle2, 
    Loader2, Send, Clock, Sparkles, History,
    Layout, ArrowRight, BookOpen, PenTool, AlertTriangle
} from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function InternDailyReport() {
    const navigate = useNavigate();
    const { user, profile, loadingUser } = useAuthModal();
    const [reportText, setReportText] = useState("");
    const [hoursLogged, setHoursLogged] = useState("");
    const [blockers, setBlockers] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [todayReport, setTodayReport] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (!loadingUser && !user) navigate("/");
    }, [user, loadingUser, navigate]);

    const callEdge = async (action, payload = {}) => {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
            throw new Error("No active session token");
        }

        const response = await fetch(
            `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ action, ...payload }),
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result?.error) {
            throw new Error(result?.error || "Edge request failed");
        }

        return result;
    };

    useEffect(() => {
        async function fetchReports() {
            const uid = user?.id || profile?.id;
            if (!uid) return;
            setLoading(true);
            try {
                const result = await callEdge("get_my_daily_reports");
                const data = result.reports;
                
                if (data) {
                    setHistory(data);
                    const todayRep = data.find(r => r.report_date === today);
                    if (todayRep) {
                        setTodayReport(todayRep);
                        setReportText(todayRep.report_text || "");
                        setHoursLogged(todayRep.hours_logged !== null ? String(todayRep.hours_logged) : "");
                        setBlockers(todayRep.blockers || "");
                    }
                }
            } catch (e) {
                console.error("Failed to fetch reports:", e);
            } finally {
                setLoading(false);
            }
        }
        if (!loadingUser && (user?.id || profile?.id)) {
            fetchReports();
        }
    }, [user?.id, profile?.id, loadingUser, today]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reportText.trim()) return toast.error("Please describe your work.");
        
        const uid = user?.id || profile?.id;
        if (!uid) return;

        setSubmitting(true);
        try {
            if (todayReport) {
               const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error("Please login again");
}

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "update_daily_report",
      id: todayReport.id,
      report_text: reportText,
      hours_logged: hoursLogged ? parseFloat(hoursLogged) : null,
      blockers: blockers || null,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

toast.success("Progress report updated!");

setTodayReport(result.report);

setHistory(prev =>
  prev.map(item =>
    item.id === result.report.id
      ? result.report
      : item
  )
);
            } else {
               const {
  data: { session },
} = await supabase.auth.getSession();

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "create_daily_report",
      report_date: today,
      report_text: reportText,
      hours_logged: hoursLogged ? parseFloat(hoursLogged) : null,
      blockers: blockers || null,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

const data = result.report;
                toast.success("Progress report submitted!");
                setTodayReport(data);
                setHistory(prev => [data, ...prev]);
            }
        } catch (e) {
    console.error(e);
    toast.error(e.message || "Submission failed");
} finally {
            setSubmitting(false);
        }
    };

    if (loadingUser || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/intern-portal")} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-500" />
                        </button>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-emerald-600" /> Work Log
                        </h1>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                <div className="grid lg:grid-cols-12 gap-8">
                    
                    {/* Writing Column (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <PenTool className="w-32 h-32" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">Current Session</span>
                                </div>
                                <h2 className="text-3xl font-bold mb-6">
                                    What have you achieved <span className="text-slate-400">today?</span>
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="relative group">
                                        <textarea
                                            rows="8"
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6 text-slate-800 dark:text-slate-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all resize-none font-medium placeholder:text-slate-400"
                                            placeholder="Example: Finalized the API integration, fixed mobile responsiveness issues, and drafted the project documentation..."
                                            value={reportText}
                                            onChange={e => setReportText(e.target.value)}
                                        ></textarea>
                                        <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-400 uppercase">
                                            {reportText.length} characters
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Hours Logged</label>
                                            <input 
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="24"
                                                placeholder="e.g. 7.5"
                                                className="w-full bg-[#f8fafc] dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-slate-800 dark:text-slate-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                                value={hoursLogged}
                                                onChange={e => setHoursLogged(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Blockers (if any)</label>
                                            <input 
                                                type="text"
                                                placeholder="e.g. Supabase connection issue"
                                                className="w-full bg-[#f8fafc] dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-slate-800 dark:text-slate-100 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                                                value={blockers}
                                                onChange={e => setBlockers(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={submitting || !reportText.trim()}
                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                                            submitting || !reportText.trim()
                                            ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40"
                                        }`}
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        {submitting ? "Publishing..." : todayReport ? "Update Work Log" : "Publish Daily Report"}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>

                        {/* Quick Tip */}
                        <div className="p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-3xl flex items-start gap-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                                <Sparkles className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Pro Tip</h4>
                                <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-1">
                                    Be specific about your contributions. Instead of "worked on frontend", try "optimized the login page loading speed by 40%".
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* History Column (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                                <History className="w-4 h-4" /> Journal History
                            </h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">{history.length} Logs</span>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {history.map((h, idx) => (
                                    <motion.div 
                                        key={h.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <span className="text-xs font-bold text-slate-500">
                                                     {(() => {
                                                         const [y, m, d] = (h.report_date || "").split("-").map(Number);
                                                         return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
                                                     })()}
                                                </span>
                                            </div>
                                            {h.report_date === today && (
                                                <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full">TODAY</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                            {h.report_text}
                                        </p>
                                        {(h.hours_logged || h.blockers) && (
                                            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3 flex flex-wrap gap-4 text-xs font-semibold">
                                                {h.hours_logged !== null && h.hours_logged !== undefined && (
                                                    <span className="text-slate-500 flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5 text-blue-500" /> {h.hours_logged} hrs
                                                    </span>
                                                )}
                                                {h.blockers && (
                                                    <span className="text-rose-500 flex items-center gap-1">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Blocker: {h.blockers}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {history.length === 0 && (
                                <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
                                    <Clock className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-400 text-sm">Your history is empty.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
