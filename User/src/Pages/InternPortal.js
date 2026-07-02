import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";
import {
    LogIn, LogOut, User, Briefcase, Calendar, Clock, TrendingUp,
    CheckCircle2, XCircle, AlertCircle, ChevronLeft, Award,
    BookOpen, Activity, Shield, Star, MapPin, Phone, Mail, Linkedin,
    Github, Globe, FileText, BarChart2, Loader2
} from "lucide-react";
import { toast } from "react-toastify";

export default function InternPortal() {
    const navigate = useNavigate();
    const { user, profile, loadingUser } = useAuthModal();

    const [internData, setInternData] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [todayLog, setTodayLog] = useState(null);
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState({ present: 0, absent: 0, total: 0, rate: 0 });

    // Tick clock
    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    // Auth guard
    useEffect(() => {
        if (!loadingUser && !user) navigate("/");
    }, [user, loadingUser, navigate]);

    const callEdge = useCallback(async (action, payload = {}) => {
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
    }, []);

    const fetchAll = useCallback(async () => {
        const uid = user?.id || profile?.id;
        if (!uid) return;
        setLoading(true);
        try {
            const applicationResult = await callEdge("get_my_intern_application");
            setInternData(applicationResult?.application || null);

            const attendanceResult = await callEdge("get_my_attendance");
            const allLogs = attendanceResult?.attendance || [];
            setAttendance(allLogs);

            const today = new Date().toISOString().split("T")[0];
            const tLog = allLogs.find(l => l.date === today) || null;
            setTodayLog(tLog);
            setIsCheckedIn(Boolean(tLog?.check_in && !tLog?.check_out));

            const present = allLogs.filter(l => l.check_in).length;
            const total = allLogs.length;
            setStats({
                present,
                absent: total - present,
                total,
                rate: total ? Math.round((present / total) * 100) : 0,
            });
        } catch (e) {
            console.error("InternPortal fetch error:", e);
            toast.error("Unable to load portal data right now.");
        } finally {
            setLoading(false);
        }
    }, [user?.id, profile?.id, callEdge]);

    useEffect(() => {
        if (!loadingUser && (user?.id || profile?.id)) fetchAll();
    }, [loadingUser, user?.id, profile?.id, fetchAll]);

    const handleCheckIn = async () => {
        if (!user?.id) return;
        setCheckingIn(true);
        try {
            if (todayLog?.id) {
                await callEdge("check_out", { attendance_id: todayLog.id });
                toast.success("✅ Checked out successfully!");
            } else {
                await callEdge("check_in");
                toast.success("🟢 Checked in successfully!");
            }
            await fetchAll();
        } catch (e) {
            toast.error(e.message || "Action failed");
        } finally {
            setCheckingIn(false);
        }
    };

    const handleBreakToggle = async () => {
        if (!todayLog?.id || !isCheckedIn) return;
        setCheckingIn(true);
        try {
            if (todayLog.on_break) {
                await callEdge("end_break", { attendance_id: todayLog.id });
                toast.success("▶️ Break ended. Welcome back!");
            } else {
                await callEdge("start_break", { attendance_id: todayLog.id });
                toast.success("⏸️ Break started. Enjoy!");
            }
            await fetchAll();
        } catch (e) {
            toast.error(e.message || "Failed to toggle break.");
        } finally {
            setCheckingIn(false);
        }
    };

    const getStatusColor = (s) => {
        if (!s) return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
        if (["Selected", "Onboarded", "Completed"].some(x => s.includes(x))) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
        if (s.includes("Reject")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        if (s.includes("Assessment")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
        if (s.includes("Interview")) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    };

    const fmt = (iso) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    };
    const fmtDate = (iso) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };
    const duration = (log) => {
        if (!log?.check_in) return null;
        const end = log.check_out ? new Date(log.check_out) : currentTime;
        let diff = end - new Date(log.check_in);
        
        // Subtract total breaks
        if (log.total_break_ms) diff -= log.total_break_ms;
        
        // If currently on break, subtract the ongoing break time
        if (log.on_break && log.break_start) {
            diff -= (currentTime - new Date(log.break_start));
        }

        if (diff < 0) diff = 0;
        
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return `${h}h ${m}m`;
    };

    if (loadingUser || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-20 pb-16">
            {/* Header Bar */}
            <div className="bg-white dark:bg-[#0a192f] border-b border-slate-200 dark:border-slate-800 px-4 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate("/mypage")}
                            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-500" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Intern Portal</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">SmaranAI Internship Dashboard</p>
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {currentTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
                        </p>
                        <p className="text-xs text-slate-500">{currentTime.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

                {/* ── CHECK-IN CARD ── */}
                <div className={`relative rounded-3xl overflow-hidden shadow-xl ${isCheckedIn ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-slate-700 to-slate-900 dark:from-[#0a192f] dark:to-[#112240]"}`}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                    <div className="relative p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
                        <div>
                            <p className="text-white/70 text-sm font-medium mb-1">
                                {isCheckedIn ? (todayLog?.on_break ? "On Break ⏸️" : "Currently Working 🟢") : todayLog?.check_out ? "Shift Complete" : "Not Checked In"}
                            </p>
                            <h2 className="text-3xl font-bold text-white">
                                {isCheckedIn ? (todayLog?.on_break ? "Enjoy your break" : `In since ${fmt(todayLog?.check_in)}`) : todayLog?.check_out ? `Out at ${fmt(todayLog?.check_out)}` : "Start your day"}
                            </h2>
                            {isCheckedIn && (
                                <p className="text-white/60 text-sm mt-1">
                                    Today: checked in at {fmt(todayLog?.check_in)}
                                </p>
                            )}
                            {todayLog?.check_out && (
                                <p className="text-white/70 text-sm mt-1">
                                    Duration: {duration(todayLog) || "—"}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {isCheckedIn && !todayLog?.check_out && (
                                <button onClick={handleBreakToggle} disabled={checkingIn}
                                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95 ${
                                        todayLog.on_break
                                            ? "bg-amber-500 text-white hover:bg-amber-600"
                                            : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                                    }`}>
                                    {checkingIn ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                        todayLog.on_break ? <LogIn className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    {todayLog.on_break ? "End Break" : "Take Break"}
                                </button>
                            )}

                            {!todayLog?.check_out && (
                                <button onClick={handleCheckIn} disabled={checkingIn || todayLog?.on_break}
                                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all active:scale-95 ${
                                        todayLog?.on_break ? "opacity-50 cursor-not-allowed bg-white text-slate-400" :
                                        isCheckedIn
                                        ? "bg-white text-red-600 hover:bg-red-50"
                                        : "bg-white text-emerald-700 hover:bg-emerald-50"}`}>
                                    {checkingIn ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                        isCheckedIn ? <LogOut className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                    {checkingIn ? "Please wait..." : isCheckedIn ? "Check Out" : "Check In"}
                                </button>
                            )}
                            {todayLog?.check_out && (
                                <div className="flex items-center gap-2 px-6 py-3 bg-white/20 rounded-2xl">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                    <span className="text-white font-semibold">Day Complete</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── STATS ROW ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Days Present", value: stats.present, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
                        { label: "Attendance Rate", value: `${stats.rate}%`, icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
                        { label: "Total Logged Days", value: stats.total, icon: Calendar, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
                        { label: "Status", value: internData?.current_status || "Applied", icon: Star, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
                    ].map((s, i) => (
                        <div key={i} className="bg-white dark:bg-[#112240] rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                                <s.icon className={`w-5 h-5 ${s.color}`} />
                            </div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── ATTENDANCE LOG ── */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            <h2 className="font-bold text-slate-800 dark:text-white">Attendance Log (Last 30 Days)</h2>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
                            {attendance.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">No attendance records yet.</p>
                                    <p className="text-slate-400 text-xs mt-1">Check in daily to start building your record.</p>
                                </div>
                            ) : attendance.map((log) => (
                                <div key={log.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-[#0a192f] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${log.check_in ? "bg-emerald-500" : "bg-red-400"}`} />
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{fmtDate(log.date)}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {log.check_in ? `In: ${fmt(log.check_in)}` : "Absent"}
                                                {log.check_out ? ` · Out: ${fmt(log.check_out)}` : log.check_in ? " · Working..." : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {duration(log) ? (
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                                                {duration(log)}
                                            </span>
                                        ) : log.check_in ? (
                                            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">Ongoing</span>
                                        ) : (
                                            <span className="text-xs text-red-400">Absent</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── INTERN DETAILS ── */}
                    <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <User className="w-5 h-5 text-blue-500" />
                            <h2 className="font-bold text-slate-800 dark:text-white">Intern Details</h2>
                        </div>
                        {internData ? (
                            <div className="p-6 space-y-4">
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                        {(internData.full_name || "?")[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{internData.full_name || "—"}</p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(internData.current_status)}`}>
                                            {internData.current_status || "Applied"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    {[
                                        { icon: Briefcase, label: internData.top_priority_role || "—" },
                                        { icon: BookOpen, label: `${internData.program_type || ""} ${internData.branch || ""}`.trim() || "—" },
                                        { icon: MapPin, label: internData.university || "—" },
                                        { icon: Clock, label: internData.availability || "—" },
                                        { icon: Calendar, label: `Joined ${fmtDate(internData.created_at)}` },
                                    ].map((r, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                            <r.icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span className="truncate">{r.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-2 pt-2 flex-wrap">
                                    {internData.linkedin_profile && (
                                        <a href={internData.linkedin_profile} target="_blank" rel="noreferrer"
                                            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:scale-110 transition-transform">
                                            <Linkedin className="w-4 h-4" />
                                        </a>
                                    )}
                                    {internData.github_url && (
                                        <a href={internData.github_url} target="_blank" rel="noreferrer"
                                            className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl hover:scale-110 transition-transform">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                    {internData.portfolio_url && (
                                        <a href={internData.portfolio_url} target="_blank" rel="noreferrer"
                                            className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl hover:scale-110 transition-transform">
                                            <Globe className="w-4 h-4" />
                                        </a>
                                    )}
                                    {internData.cv_url && (
                                        <a href={internData.cv_url} target="_blank" rel="noreferrer"
                                            className="flex items-center gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl text-xs font-semibold hover:scale-105 transition-transform">
                                            <FileText className="w-3 h-3" /> CV
                                        </a>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 text-sm">No application found.</p>
                                <button onClick={() => navigate("/internapplication")}
                                    className="mt-3 text-sm text-emerald-600 font-semibold hover:underline">
                                    Apply Now →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── PERFORMANCE CARD ── */}
                <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                        <BarChart2 className="w-5 h-5 text-purple-500" />
                        <h2 className="font-bold text-slate-800 dark:text-white">Performance Overview</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            {
                                label: "Attendance", value: stats.rate, suffix: "%", color: "from-emerald-400 to-teal-500",
                                desc: `${stats.present} of ${stats.total} days`
                            },
                            {
                                label: "Consistency Streak", value: (() => {
                                    let streak = 0;
                                    for (const l of attendance) {
                                        if (l.check_in) streak++; else break;
                                    }
                                    return streak;
                                })(), suffix: " days", color: "from-blue-400 to-indigo-500",
                                desc: "consecutive check-ins"
                            },
                            {
                                label: "Avg Daily Hours", value: (() => {
                                    const withBoth = attendance.filter(l => l.check_in && l.check_out);
                                    if (!withBoth.length) return 0;
                                    const avg = withBoth.reduce((acc, l) => acc + (new Date(l.check_out) - new Date(l.check_in)), 0) / withBoth.length;
                                    return (avg / 3600000).toFixed(1);
                                })(), suffix: " hrs", color: "from-purple-400 to-pink-500",
                                desc: "based on logged sessions"
                            },
                        ].map((p, i) => (
                            <div key={i} className="flex items-center gap-5 p-4 bg-slate-50 dark:bg-[#0a192f] rounded-2xl">
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="10" />
                                        <circle cx="50" cy="50" r="40" fill="none"
                                            stroke={`url(#g${i})`} strokeWidth="10" strokeLinecap="round"
                                            strokeDasharray={`${Math.min(parseFloat(p.value) || 0, 100) * 2.51} 251`}
                                            className="transition-all duration-1000" />
                                        <defs>
                                            <linearGradient id={`g${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="100%" stopColor="#3b82f6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xs font-bold text-slate-700 dark:text-white">{p.value}{p.suffix}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white">{p.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { label: "My Tasks", icon: Briefcase, path: "/intern-tasks", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
                        { label: "Daily Report", icon: FileText, path: "/intern-report", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
                        { label: "Leave Request", icon: Calendar, path: "/mypage?tab=leaves", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
                        { label: "My Page", icon: User, path: "/mypage", color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
                        { label: "Assessment", icon: BookOpen, path: internData ? `/assessment/${internData.id}` : "/mypage", color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
                        { label: "Interview", icon: Shield, path: "/ai-interview", color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
                    ].map((l, i) => {
                        const isInterviewDisabled = l.label === "Interview" && internData && [
                            "Selected",
                            "Pre-boarding / Selected",
                            "Pre-boarding Completed",
                            "Onboarded",
                            "Internship",
                            "Week 1 Review",
                            "Week 2 Review",
                            "On Track",
                            "Performance Issue",
                            "Recommended for Offer",
                            "Completed"
                        ].includes(internData.current_status);

                        return (
                            <button key={i}
                                onClick={() => {
                                    if (isInterviewDisabled) {
                                        toast.error("AI Interview is disabled for selected/onboarded interns.");
                                    } else {
                                        navigate(l.path);
                                    }
                                }}
                                className={`flex flex-col items-center justify-center gap-3 p-4 bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all text-center ${
                                    isInterviewDisabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:shadow-md hover:-translate-y-0.5"
                                }`}>
                                <div className={`w-10 h-10 ${isInterviewDisabled ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : l.color} rounded-xl flex items-center justify-center`}>
                                    <l.icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs font-semibold ${isInterviewDisabled ? "text-slate-400" : "text-slate-700 dark:text-slate-200"}`}>{l.label}</span>
                            </button>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
