import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuthModal } from "../context/AuthModalContext";
import { toast } from "react-toastify";
import {
    Briefcase, Clock, CheckCircle2, MessageSquare, History,
    AlertCircle, FileText, ArrowRight, Loader2, Calendar,
    TrendingUp, Star, Shield, ChevronRight, Sparkles, Award,
    XCircle, RefreshCw
} from "lucide-react";

// ── Status color helpers ──────────────────────────────────────────────────────
const STATUS_COLORS = {
    Applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Under Review": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    Selected: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "On Hold": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

function statusColor(status) {
    return STATUS_COLORS[status] || STATUS_COLORS.default;
}

function statusDot(status) {
    if (!status) return "bg-slate-400";
    const s = status.toLowerCase();
    if (s.includes("reject") || s.includes("fail") || s.includes("overdue")) return "bg-red-500";
    if (s.includes("select") || s.includes("pass") || s.includes("complet") || s.includes("onboard")) return "bg-emerald-500";
    if (s.includes("review") || s.includes("under") || s.includes("submitted")) return "bg-indigo-500";
    if (s.includes("hold") || s.includes("pending") || s.includes("schedule")) return "bg-amber-500";
    if (s.includes("progress") || s.includes("assign")) return "bg-blue-500";
    return "bg-slate-400";
}

function formatDateTime(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

// ── Journey steps (ordered pipeline) ─────────────────────────────────────────
const JOURNEY_STEPS = [
    { key: "Applied", label: "Applied", icon: Briefcase },
    { key: "Under Review", label: "Under Review", icon: FileText },
    { key: "Interview Stage", label: "Interview", icon: Star },
    { key: "Assessment Stage", label: "Assessment", icon: Shield },
    { key: "Selected", label: "Selected", icon: Award },
    { key: "Onboarded", label: "Onboarded", icon: CheckCircle2 },
];

function matchStep(currentStatus) {
    if (!currentStatus) return -1;
    const s = currentStatus.toLowerCase();
    if (s.includes("week") || s.includes("track") || s.includes("performance") || s.includes("onboard") || s.includes("complet") || s.includes("internship")) return 5;
    if (s.includes("select") || s.includes("pre-board") || s.includes("offer")) return 4;
    if (s.includes("assessment") || s.includes("task")) return 3;
    if (s.includes("interview")) return 2;
    if (s.includes("under review")) return 1;
    if (s.includes("review")) return 1;
    if (s.includes("applied") || s.includes("application")) return 0;
    return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
export default function InternActivity() {
    const { user, profile, loadingUser } = useAuthModal();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [internData, setInternData] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const fetchedForUid = useRef(null);
    const wasLoadingUser = useRef(true);

    // Fetch data
    useEffect(() => {
        if (loadingUser) { wasLoadingUser.current = true; return; }

        const userId = user?.id || profile?.id;
        if (!userId) { setLoading(false); return; }

        const authJustSettled = wasLoadingUser.current === true;
        wasLoadingUser.current = false;

        if (!authJustSettled && fetchedForUid.current === userId) return;
        fetchedForUid.current = userId;

        async function load() {
            try {
                const { data, error } = await supabase
                    .from("w_internship_applications")
                    .select(
                        "id, full_name, top_priority_role, current_status, status_history, " +
                        "review, reviewtimestamp, created_at, cv_url"
                    )
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (error) { console.warn("Intern fetch:", error.message); }

                if (data) {
                    // Parse status_history
                    let history = [];
                    try {
                        history = typeof data.status_history === "string"
                            ? JSON.parse(data.status_history)
                            : Array.isArray(data.status_history)
                            ? data.status_history : [];
                    } catch (_) {}
                    data.status_history = history;
                    setInternData(data);

                    // Fetch assessment
                    const { data: asmData } = await supabase
                        .from("internship_student_assessments")
                        .select("id, status, due_date, submission_url, submitted_at, internship_assessments(heading, role)")
                        .eq("user_id", userId)
                        .eq("internship_application_id", data.id)
                        .maybeSingle();
                    setAssessment(asmData || null);
                }
            } catch (e) {
                console.error("InternActivity load error:", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [user?.id, profile?.id, loadingUser]);

    // Redirect if not logged in
    useEffect(() => {
        if (!loadingUser && !user) navigate("/");
    }, [user, loadingUser, navigate]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loadingUser) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-9 w-9 animate-spin text-emerald-500" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading your activity...</p>
                </div>
            </div>
        );
    }

    // ── No application ────────────────────────────────────────────────────────
    if (!internData) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-16 px-4 transition-colors">
                <div className="max-w-2xl mx-auto text-center mt-16">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 mb-6">
                        <Briefcase className="h-9 w-9 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No Internship Application Found</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        You haven't applied for an internship at SmaranAI yet. Apply now to start your journey!
                    </p>
                    <button
                        onClick={() => navigate("/internapplication")}
                        className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                    >
                        Apply for Internship <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    }

    const currentStatus = internData.current_status || "Applied";
    const activeStep = matchStep(currentStatus);
    const isRejected = currentStatus.toLowerCase().includes("reject");

    // Build timeline (status_history preferred, fallback to legacy review arrays)
    let timeline = [];
    if (Array.isArray(internData.status_history) && internData.status_history.length > 0) {
        timeline = [...internData.status_history].reverse();
    } else if (Array.isArray(internData.review) && internData.review.length > 0) {
        const ts = internData.reviewtimestamp || [];
        timeline = internData.review.map((r, i) => ({
            status: "Admin Update",
            remark: r,
            date: Array.isArray(ts) ? ts[i] : null,
        })).reverse();
    } else if (typeof internData.review === "string" && internData.review.trim()) {
        timeline = [{ status: "Admin Update", remark: internData.review, date: null }];
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-16 px-4 sm:px-6 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* ── Page header ── */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-emerald-500" />
                            Intern Activity
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Your SmaranAI internship journey at a glance
                        </p>
                    </div>
                    <button
                        onClick={() => { fetchedForUid.current = null; setLoading(true); setInternData(null); setAssessment(null); window.location.reload(); }}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh
                    </button>
                </div>

                {/* ── Hero status card ── */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#112240] shadow-sm">
                    <div className={`h-1.5 ${isRejected ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"}`} />
                    <div className="p-6 flex flex-wrap items-center gap-5">
                        {/* Avatar */}
                        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md ${isRejected ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"}`}>
                            {(internData.full_name || "?")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-lg font-bold text-slate-800 dark:text-white">{internData.full_name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{internData.top_priority_role || "Applicant"}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColor(currentStatus)}`}>
                                    {currentStatus}
                                </span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Applied {new Date(internData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                        {internData.cv_url && (
                            <a
                                href={internData.cv_url}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all"
                            >
                                <FileText className="h-3.5 w-3.5" /> View Resume
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Journey tracker ── */}
                {!isRejected && (
                    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#112240] shadow-sm p-6">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-5 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-500" /> Application Journey
                        </h2>
                        <div className="flex items-start gap-0 overflow-x-auto pb-2">
                            {JOURNEY_STEPS.map((step, i) => {
                                const done = i <= activeStep;
                                const active = i === activeStep;
                                return (
                                    <React.Fragment key={step.key}>
                                        <div className="flex flex-col items-center min-w-[72px] relative">
                                            {/* Circle */}
                                            <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                                active
                                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-4 ring-emerald-500/20"
                                                    : done
                                                    ? "border-emerald-400 bg-emerald-400 text-white"
                                                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600"
                                            }`}>
                                                <step.icon className="h-4 w-4" />
                                            </div>
                                            <span className={`mt-2 text-[10px] font-semibold text-center leading-tight ${
                                                active ? "text-emerald-600 dark:text-emerald-400" : done ? "text-slate-600 dark:text-slate-400" : "text-slate-300 dark:text-slate-600"
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {i < JOURNEY_STEPS.length - 1 && (
                                            <div className={`flex-1 h-0.5 mt-4 min-w-[16px] transition-all ${i < activeStep ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ── Assessment card ── */}
                {assessment && (
                    <div className={`rounded-2xl border shadow-sm p-6 ${
                        assessment.status === "submitted"
                            ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/40"
                            : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40"
                    }`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                    assessment.status === "submitted"
                                        ? "bg-blue-100 dark:bg-blue-900/30"
                                        : "bg-amber-100 dark:bg-amber-900/30"
                                }`}>
                                    {assessment.status === "submitted"
                                        ? <CheckCircle2 className="h-6 w-6 text-blue-500" />
                                        : <AlertCircle className="h-6 w-6 text-amber-500 animate-pulse" />
                                    }
                                </div>
                                <div>
                                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                                        assessment.status === "submitted" ? "text-blue-500" : "text-amber-500"
                                    }`}>
                                        {assessment.status === "submitted" ? "Assessment Submitted" : "Assessment Pending"}
                                    </p>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                                        {assessment.internship_assessments?.heading || "Task Assigned"}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {assessment.internship_assessments?.role || ""}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {assessment.due_date && assessment.status !== "submitted" && (
                                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        Due {new Date(assessment.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                )}
                                {assessment.status !== "submitted" && (
                                    <button
                                        onClick={() => navigate(`/assessment/${internData.id}`)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all"
                                    >
                                        Upload Now <ChevronRight className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                {assessment.status === "submitted" && assessment.submission_url && (
                                    <a
                                        href={assessment.submission_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all"
                                    >
                                        View Submission <ChevronRight className="h-3.5 w-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}                {/* ── Quick actions ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        onClick={() => navigate("/internapplication")}
                        className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-[#112240] border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 group transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Update Application</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </button>
                    <button
                        onClick={() => {
                            if (activeStep < 4) {
                                navigate("/ai-interview");
                            } else {
                                toast.error("AI Interview is disabled for selected/onboarded interns.");
                            }
                        }}
                        className={`flex items-center justify-between gap-3 p-4 bg-white dark:bg-[#112240] border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm transition-all group ${
                            activeStep < 4 
                                ? "hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer" 
                                : "opacity-60 cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#152a4f]"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                activeStep < 4 ? "bg-purple-100 dark:bg-purple-900/30" : "bg-slate-100 dark:bg-slate-800"
                            }`}>
                                <Star className={`h-4 w-4 ${
                                    activeStep < 4 ? "text-purple-600 dark:text-purple-400" : "text-slate-400"
                                }`} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI Interview</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${
                            activeStep < 4 ? "text-slate-400 group-hover:text-purple-500" : "text-slate-300"
                        }`} />
                    </button>

                    <button
                        onClick={() => {
                            if (activeStep >= 4) {
                                navigate("/intern-portal");
                            } else {
                                toast.error("Dashboard access is restricted to selected interns.");
                            }
                        }}
                        className={`flex items-center justify-between gap-3 p-4 bg-white dark:bg-[#112240] border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm transition-all group ${
                            activeStep >= 4 
                                ? "hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer" 
                                : "opacity-60 cursor-not-allowed hover:bg-slate-50 dark:hover:bg-[#152a4f]"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                activeStep >= 4 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-slate-800"
                            }`}>
                                <MessageSquare className={`h-4 w-4 ${
                                    activeStep >= 4 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                                }`} />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">My Dashboard</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${
                            activeStep >= 4 ? "text-slate-400 group-hover:text-blue-500" : "text-slate-300"
                        }`} />
                    </button>
                </div>

            </div>
        </div>
    );
}
