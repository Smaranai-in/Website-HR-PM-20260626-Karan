import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import {
    Briefcase,
    Clock,
    GraduationCap,
    Loader2,
    FileText,
    MessageSquare,
    History,
    Award,
    TrendingDown,
    Shield,
    Brain,
    AlertTriangle,
    Target,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Star,
    Sparkles,
    ChevronRight,
    Calendar,
    RefreshCw,
    ArrowRight,
    LayoutDashboard,
    ClipboardList,
    Mic,
    Upload,
    CalendarDays
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAssessment } from "../context/AssessmentContext";
import ApplyInternship from "./ApplyInternship";

// ── Journey Steps ──────────────────────────────────────────
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
    if (s.includes("under review") || s.includes("review")) return 1;
    if (s.includes("applied") || s.includes("application")) return 0;
    return 0;
}

// ── Tab Config ──────────────────────────────────────────────
const TABS = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "application", label: "Application", icon: ClipboardList },
    { key: "interview", label: "AI Interview", icon: Mic },
    { key: "leaves", label: "Leaves", icon: Calendar }
];

export default function MyPage() {
    const { user, profile, loadingUser } = useAuthModal();
    const { studentAssessment, fetchStudentAssessment, getRemainingTime } = useAssessment();
    const [loading, setLoading] = useState(true);
    const [internData, setInternData] = useState(null);
    const [interviewData, setInterviewData] = useState(null);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [activeTask, setActiveTask] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Leave states
    const [leavesList, setLeavesList] = useState([]);
    const [leaveType, setLeaveType] = useState("Sick");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [attachmentUrl, setAttachmentUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingLeaves, setLoadingLeaves] = useState(true);
    const fileInputRef = useRef(null);

    // Tab state — default to "overview", but can be set via ?tab=application etc.
    const initialTab = searchParams.get("tab") || "overview";
    const [activeTab, setActiveTab] = useState(
        TABS.some(t => t.key === initialTab) ? initialTab : "overview"
    );

    // Track last fetched userId + whether auth was previously loading
    const fetchedForUserId = useRef(null);
    const wasLoadingUser = useRef(true);

    const fetchLeaves = async (currentUserId) => {
        const uid = currentUserId || user?.id || profile?.id;
        if (!uid) return;
        setLoadingLeaves(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ action: "get_my_leaves" })
            });
            const result = await response.json();
            if (response.ok && result.success) {
                setLeavesList(result.leaves || []);
            }
        } catch (e) {
            console.error("Error fetching leaves:", e);
        } finally {
            setLoadingLeaves(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uid = user?.id || profile?.id;
        if (!uid) {
            toast.error("Please login first.");
            return;
        }

        setIsUploading(true);
        try {
            const fileExt = file.name.split(".").pop();
            const filePath = `leaves/${uid}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("Interview_Resumes")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("Interview_Resumes")
                .getPublicUrl(filePath);

            setAttachmentUrl(data.publicUrl);
            toast.success("Attachment uploaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const getLocalDateString = (offsetYears = 0) => {
        const d = new Date();
        if (offsetYears !== 0) {
            d.setFullYear(d.getFullYear() + offsetYears);
        }
        const tzoffset = d.getTimezoneOffset() * 60000;
        return (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 10);
    };

    const minDateStr = getLocalDateString(0);
    const maxDateStr = getLocalDateString(1);

    const handleApplyLeave = async () => {
        if (!fromDate || !toDate || !reason.trim()) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (fromDate < minDateStr) {
            toast.error("From Date cannot be in the past.");
            return;
        }

        if (toDate < fromDate) {
            toast.error("To Date cannot be before From Date.");
            return;
        }

        if (fromDate > maxDateStr || toDate > maxDateStr) {
            toast.error("Leave dates cannot be more than 1 year in the future.");
            return;
        }

        const uid = user?.id || profile?.id;
        if (!uid) return;

        setIsSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Please log in again.");

            const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    action: "apply_leave",
                    leave_type: leaveType,
                    start_date: fromDate,
                    end_date: toDate,
                    reason,
                    attachment_url: attachmentUrl || null
                })
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Failed to submit leave request.");
            }

            toast.success("Leave request submitted successfully!");
            setLeaveType("Sick");
            setFromDate("");
            setToDate("");
            setReason("");
            setAttachmentUrl("");
            fetchLeaves(uid);
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to submit request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchDashboardDetails = async (forceUserId) => {
        const currentUserId = forceUserId || user?.id || profile?.id;
        if (!currentUserId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const [
                { data: interviewRes, error: interviewError },
                { data: internRes, error: internError },
                { data: activeTaskRes, error: activeTaskError }
            ] = await Promise.all([
                supabase
                    .from("interviews")
                    .select("id, status, score, feedback, is_suspicious, tab_switch_count, created_at, video_url")
                    .eq("user_id", currentUserId)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle(),
                supabase
                    .from("w_internship_applications")
                    .select("id, user_id, full_name, university, program_type, branch, graduation_year, top_priority_role, availability, available_to_join, start_time, end_time, phone_number, linkedin_profile, github_url, portfolio_url, cv_url, work_experience_desc, current_status, status_history, review, reviewtimestamp, created_at")
                    .eq("user_id", currentUserId)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle(),
                supabase
                    .from("w_intern_projects")
                    .select("id, project_name, assigned_task, priority, status, progress, due_date")
                    .eq("intern_id", currentUserId)
                    .neq("status", "Completed")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle()
            ]);

            if (activeTaskError) {
                console.warn("⚠️ Active task fetch error:", activeTaskError.message);
                setActiveTask(null);
            } else {
                setActiveTask(activeTaskRes || null);
            }

            if (interviewError) {
                console.warn("⚠️ Interview fetch error:", interviewError.message);
            }
            setInterviewData(interviewRes || null);

            if (internError) {
                console.warn("⚠️ Internship fetch error:", internError.message);
                setInternData(null);
            } else if (internRes) {
                let parsedHistory = [];
                try {
                    if (typeof internRes.status_history === "string") {
                        parsedHistory = JSON.parse(internRes.status_history);
                    } else if (Array.isArray(internRes.status_history)) {
                        parsedHistory = internRes.status_history;
                    }
                } catch (e) {
                    console.warn("Failed to parse status_history", e);
                }
                internRes.status_history = parsedHistory;
                setInternData(internRes);
                fetchStudentAssessment(currentUserId, internRes.id).catch(err =>
                    console.warn("⚠️ Assessment fetch error:", err)
                );
            } else {
                setInternData(null);
            }

            // Fetch leaves list as well
            fetchLeaves(currentUserId);

        } catch (error) {
            console.error("Error fetching Dashboard details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (loadingUser) {
            wasLoadingUser.current = true;
            return;
        }
        const currentUserId = user?.id || profile?.id;
        if (!currentUserId) {
            setLoading(false);
            wasLoadingUser.current = false;
            return;
        }
        const authJustSettled = wasLoadingUser.current === true;
        wasLoadingUser.current = false;
        if (!authJustSettled && fetchedForUserId.current === currentUserId) return;
        fetchedForUserId.current = currentUserId;
        fetchDashboardDetails(currentUserId);
    }, [user?.id, profile?.id, loadingUser]);

    useEffect(() => {
        if (location.state?.refresh) {
            navigate("/mypage", { replace: true, state: {} });
        }
        if (location.state?.tab && TABS.some(t => t.key === location.state.tab)) {
            setActiveTab(location.state.tab);
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (studentAssessment?.due_date) {
            const interval = setInterval(() => {
                setTimeLeft(getRemainingTime(studentAssessment.due_date));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [studentAssessment?.due_date, getRemainingTime]);

    useEffect(() => {
        if (!loadingUser && !user) navigate("/");
    }, [user, loadingUser, navigate]);

    // Update URL search param when tab changes (without full navigation)
    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        setSearchParams({ tab: tabKey }, { replace: true });
    };

    if (loadingUser) return null;

    const currentStatus = internData?.current_status || "Applied";
    const activeStep = internData ? matchStep(currentStatus) : -1;
    const isRejected = currentStatus.toLowerCase().includes("reject");

    const isInternSelected = internData && [
        "Selected", "Pre-boarding / Selected", "Pre-boarding Completed",
        "Onboarded", "Internship", "Week 1 Review", "Week 2 Review",
        "On Track", "Performance Issue", "Recommended for Offer", "Completed"
    ].includes(internData.current_status);

    // Build timeline
    let timeline = [];
    if (internData) {
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
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-16 transition-colors duration-300 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* ── Page Header ── */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-emerald-500" />
                            My Page
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Your SmaranAI internship hub — all in one place
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            fetchedForUserId.current = null;
                            fetchDashboardDetails(user?.id || profile?.id);
                        }}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh
                    </button>
                </div>

                {/* ── Tab Bar ── */}
                <div className="flex items-center gap-1 bg-white dark:bg-[#112240] rounded-2xl border border-slate-200 dark:border-slate-700/60 p-1.5 mb-8 shadow-sm">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                                }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Loading Skeleton ── */}
                {loading && (
                    <div className="space-y-4 mb-10">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 animate-pulse">
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map(j => <div key={j} className="h-4 bg-slate-100 dark:bg-slate-800 rounded" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && (
                    <>
                        {/* ============================== */}
                        {/* ======= OVERVIEW TAB ========= */}
                        {/* ============================== */}
                        {activeTab === "overview" && (
                            <div className="space-y-6 animate-fade-in">

                                {/* Hero Status Card */}
                                {internData ? (
                                    <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#112240] shadow-sm">
                                        <div className={`h-1.5 ${isRejected ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"}`} />
                                        <div className="p-6 flex flex-wrap items-center gap-5">
                                            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-md ${isRejected ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-emerald-500 to-teal-600"}`}>
                                                {(internData.full_name || "?")[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-bold text-slate-800 dark:text-white">{internData.full_name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{internData.top_priority_role || "Applicant"}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(currentStatus)}`}>
                                                        {currentStatus}
                                                    </span>
                                                    <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Applied {new Date(internData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </span>
                                                </div>
                                            </div>
                                            {internData.cv_url && (
                                                <a href={internData.cv_url} target="_blank" rel="noreferrer"
                                                    className="shrink-0 flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all">
                                                    <FileText className="h-3.5 w-3.5" /> View Resume
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-[#112240] p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Internship Application</h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-lg mb-6">
                                            You haven't applied for an internship yet.
                                        </p>
                                        <button
                                            onClick={() => handleTabChange("application")}
                                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 justify-center mx-auto"
                                        >
                                            <Briefcase className="w-4 h-4" /> Apply for Internship
                                        </button>
                                    </div>
                                )}

                                {/* Journey Tracker */}
                                {internData && !isRejected && (
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

                                {/* Active Task Card */}
                                {activeTask && (
                                    <div className="bg-gradient-to-br from-indigo-900/95 to-[#112240] dark:from-[#0a192f]/95 dark:to-[#112240]/95 rounded-2xl shadow-xl border border-indigo-500/20 overflow-hidden text-white p-8 relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Current Active Task</span>
                                                    <h2 className="text-xl font-bold">{activeTask.project_name}</h2>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                activeTask.priority === "High" ? "bg-red-500/20 text-red-300 border border-red-500/30" :
                                                activeTask.priority === "Medium" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                                                "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                            }`}>
                                                {activeTask.priority} Priority
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Task Details</h4>
                                                <p className="text-slate-200 text-sm leading-relaxed">{activeTask.assigned_task}</p>
                                            </div>
                                            <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                                                <div>
                                                    <span className="text-xs text-slate-400 block mb-1">Status</span>
                                                    <span className="text-sm font-semibold text-indigo-300">{activeTask.status}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-400 block mb-1">Progress</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                                                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${activeTask.progress}%` }}></div>
                                                        </div>
                                                        <span className="text-sm font-bold">{activeTask.progress}%</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-400 block mb-1">Due Date</span>
                                                    <span className="text-sm font-semibold text-slate-200">
                                                        {activeTask.due_date ? new Date(activeTask.due_date).toLocaleDateString() : "No deadline"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Assessment Card */}
                                {internData && (
                                    <>
                                        {studentAssessment && studentAssessment.assessment_outlines ? (
                                            <div className={`rounded-2xl border shadow-sm p-6 ${
                                                studentAssessment.status === "submitted"
                                                    ? "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/40"
                                                    : "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40"
                                            }`}>
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                                                            studentAssessment.status === "submitted"
                                                                ? "bg-blue-100 dark:bg-blue-900/30"
                                                                : "bg-amber-100 dark:bg-amber-900/30"
                                                        }`}>
                                                            {studentAssessment.status === "submitted"
                                                                ? <CheckCircle2 className="h-6 w-6 text-blue-500" />
                                                                : <AlertCircle className="h-6 w-6 text-amber-500 animate-pulse" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                                                                studentAssessment.status === "submitted" ? "text-blue-500" : "text-amber-500"
                                                            }`}>
                                                                {studentAssessment.status === "submitted" ? "Assessment Submitted" : "Assessment Pending"}
                                                            </p>
                                                            <p className="font-semibold text-slate-700 dark:text-slate-200">
                                                                {studentAssessment.assessment_outlines.title || studentAssessment.assessment_outlines.heading || "Task Assigned"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {studentAssessment.due_date && studentAssessment.status !== "submitted" && (
                                                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                {timeLeft || "Calculating..."}
                                                            </span>
                                                        )}
                                                        {studentAssessment.status !== "submitted" && (
                                                            <button
                                                                onClick={() => navigate(`/assessment/${internData?.id}`)}
                                                                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 transition-all"
                                                            >
                                                                Upload Now <ChevronRight className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6 flex items-start gap-4">
                                                <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-bold text-blue-900 dark:text-blue-300">No Active Assessment</h3>
                                                    <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">Go to the assessment page to choose your task.</p>
                                                    <button
                                                        onClick={() => navigate(`/assessment/${internData?.id}`)}
                                                        className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Select Assessment &rarr;
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Quick Actions */}
                                {internData && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                        <button
                                            onClick={() => handleTabChange("application")}
                                            className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-[#112240] border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                                    <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">View Application</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (activeStep < 4) {
                                                    handleTabChange("interview");
                                                } else {
                                                    toast.error("AI Interview is disabled for selected/onboarded interns.");
                                                }
                                            }}
                                            className={`flex items-center justify-between gap-3 p-4 bg-white dark:bg-[#112240] border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm transition-all group ${
                                                activeStep < 4
                                                    ? "hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer"
                                                    : "opacity-60 cursor-not-allowed"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeStep < 4 ? "bg-purple-100 dark:bg-purple-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                                                    <Star className={`h-4 w-4 ${activeStep < 4 ? "text-purple-600 dark:text-purple-400" : "text-slate-400"}`} />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">AI Interview</span>
                                            </div>
                                            <ChevronRight className={`h-4 w-4 transition-colors ${activeStep < 4 ? "text-slate-400 group-hover:text-purple-500" : "text-slate-300"}`} />
                                        </button>

                                        <button
                                            onClick={() => handleTabChange("leaves")}
                                            className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-[#112240] border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-sm hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/10 group transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Leave Request</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
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
                                                    : "opacity-60 cursor-not-allowed"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${activeStep >= 4 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                                                    <MessageSquare className={`h-4 w-4 ${activeStep >= 4 ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">My Dashboard</span>
                                            </div>
                                            <ChevronRight className={`h-4 w-4 transition-colors ${activeStep >= 4 ? "text-slate-400 group-hover:text-blue-500" : "text-slate-300"}`} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ================================ */}
                        {/* ====== APPLICATION TAB ========= */}
                        {/* ================================ */}
                        {activeTab === "application" && (
                            <div className="animate-fade-in">
                                {internData ? (
                                    <div className="space-y-6">
                                        {/* Internship Details Card */}
                                        <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                                    <Briefcase className="w-6 h-6 text-emerald-500" />
                                                    SmaranAI Internship Details
                                                </h2>
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(internData.current_status || "Applied")}`}>
                                                    {internData.current_status || "Applied"}
                                                </span>
                                            </div>

                                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                <div className="space-y-6">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <GraduationCap size={14} /> Education & Personal
                                                    </h3>
                                                    <Detail label="Full Name" value={internData.full_name} />
                                                    <Detail label="University" value={internData.university} />
                                                    <Detail label="Degree & Branch" value={`${internData.program_type} - ${internData.branch}`} />
                                                    <Detail label="Graduation Year" value={internData.graduation_year} />
                                                </div>
                                                <div className="space-y-6">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <Clock size={14} /> Role & Availability
                                                    </h3>
                                                    <Detail label="Priority Role" value={internData.top_priority_role} />
                                                    <Detail label="Availability" value={internData.availability} />
                                                    <Detail label="Ready to Join" value={internData.available_to_join} />
                                                    <Detail label="Working Hours" value={`${internData.start_time} - ${internData.end_time}`} />
                                                </div>
                                                <div className="space-y-6">
                                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                        <FileText size={14} /> Contact & Links
                                                    </h3>
                                                    <Detail label="Phone" value={internData.phone_number} />
                                                    <div className="flex flex-wrap gap-3 pt-2">
                                                        {internData.linkedin_profile && (
                                                            <a href={internData.linkedin_profile} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-blue-600 hover:scale-110 transition-transform">
                                                                <FaLinkedin size={20} />
                                                            </a>
                                                        )}
                                                        {internData.github_url && (
                                                            <a href={internData.github_url} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-slate-800 dark:text-white hover:scale-110 transition-transform">
                                                                <FaGithub size={20} />
                                                            </a>
                                                        )}
                                                        {internData.portfolio_url && (
                                                            <a href={internData.portfolio_url} target="_blank" rel="noreferrer" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-emerald-600 hover:scale-110 transition-transform">
                                                                <FaGlobe size={20} />
                                                            </a>
                                                        )}
                                                    </div>
                                                    {internData.cv_url && (
                                                        <a href={internData.cv_url} target="_blank" rel="noreferrer"
                                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20">
                                                            <FileText size={16} /> View Resume
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            {internData.work_experience_desc && (
                                                <div className="px-8 pb-8 pt-4">
                                                    <div className="bg-slate-50 dark:bg-[#0a192f] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                                        <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Work/Internship Description</p>
                                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                                                            "{internData.work_experience_desc}"
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Edit Application Button */}
                                            <div className="px-8 pb-8 flex justify-center">
                                                {!isInternSelected ? (
                                                    <button
                                                        onClick={() => navigate("/internapplication")}
                                                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                                                    >
                                                        Edit Application
                                                    </button>
                                                ) : (
                                                    <span className="px-6 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-900/30 text-sm">
                                                        ⚠️ Editing is disabled as you have been selected.
                                                    </span>
                                                )}
                                            </div>

                                            {/* Timeline & Remarks */}
                                            {((internData.status_history?.length > 0) || internData.review?.length > 0 || internData.reviewtimestamp?.length > 0) && (
                                                <div className="border-t border-slate-100 dark:border-slate-800 p-8 bg-slate-50/50 dark:bg-[#0a192f]/50">
                                                    <button
                                                        onClick={() => setIsTimelineOpen(!isTimelineOpen)}
                                                        className="w-full flex items-center justify-between group"
                                                    >
                                                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 group-hover:text-emerald-500 transition-colors">
                                                            <History className="w-4 h-4 text-emerald-500" />
                                                            Application Timeline & Remarks
                                                        </h3>
                                                        <div className="p-2 bg-white dark:bg-[#112240] rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                                                            {isTimelineOpen ? <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                                                        </div>
                                                    </button>

                                                    {isTimelineOpen && (
                                                        <div className="space-y-4 mt-6">
                                                            {timeline.length > 0 ? (
                                                                [...timeline].reverse().map((item, index) => (
                                                                    <div key={`tl-${index}`} className="bg-white dark:bg-[#112240] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden pl-4">
                                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.status === 'Rejected' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                                                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-3">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                                                    <MessageSquare className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                                                                </div>
                                                                                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">
                                                                                    {item.status}
                                                                                </span>
                                                                            </div>
                                                                            {item.date && (
                                                                                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md whitespace-nowrap">
                                                                                    <Clock className="w-3 h-3" />
                                                                                    {formatDateTime(item.date)}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {item.remark && (
                                                                            <div className="pl-8">
                                                                                <p className="text-slate-600 dark:text-slate-300 text-sm italic">
                                                                                    "{item.remark}"
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            ) : null}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* No application yet — render the full Apply Internship form */
                                    <ApplyInternship />
                                )}
                            </div>
                        )}

                        {/* ================================ */}
                        {/* ====== AI INTERVIEW TAB ======== */}
                        {/* ================================ */}
                        {activeTab === "interview" && (
                            <div className="animate-fade-in">
                                <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <Brain className="w-6 h-6 text-purple-500" />
                                            AI Interview
                                        </h2>
                                        {interviewData && (
                                            <button
                                                onClick={() => navigate('/ai-interview')}
                                                disabled={isInternSelected}
                                                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors shadow-lg ${
                                                    isInternSelected
                                                        ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none'
                                                        : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                                                }`}
                                            >
                                                Take Another Interview
                                            </button>
                                        )}
                                    </div>

                                    {interviewData ? (
                                        interviewData.status === 'completed' ? (
                                            <div className="p-8">
                                                <div className="grid md:grid-cols-2 gap-8 mb-8">
                                                    {/* Performance Score */}
                                                    <div className="bg-slate-50 dark:bg-[#0a192f] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                                                        <div className="relative w-24 h-24 flex-shrink-0">
                                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="8" />
                                                                <circle
                                                                    cx="50" cy="50" r="45" fill="none"
                                                                    stroke={interviewData.score >= 80 ? '#10b981' : interviewData.score >= 60 ? '#3b82f6' : '#ef4444'}
                                                                    strokeWidth="8" strokeLinecap="round"
                                                                    strokeDasharray={`${(interviewData.score || 0) * 2.83} 283`}
                                                                    className="transition-all duration-1000 ease-out"
                                                                />
                                                            </svg>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-2xl font-bold text-slate-800 dark:text-white">{interviewData.score || 0}%</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 tracking-tight">Overall Performance</h3>
                                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${(interviewData.score || 0) >= 60 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                                {(interviewData.score || 0) >= 60 ? <Award className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                                {(interviewData.score || 0) >= 60 ? 'Passed' : 'Needs Work'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Proctoring Status */}
                                                    <div className="bg-slate-50 dark:bg-[#0a192f] p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${interviewData.is_suspicious ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                                                            <Shield className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 tracking-tight">Proctoring Status</h3>
                                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                                                                Tab Switches: <span className={interviewData.tab_switch_count > 3 ? 'text-red-500' : 'text-emerald-500'}>{interviewData.tab_switch_count || 0}</span>
                                                            </p>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${interviewData.is_suspicious ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
                                                                {interviewData.is_suspicious ? 'Flagged / Suspicious' : 'Clean / Verified'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* AI Feedback */}
                                                {interviewData.feedback && (
                                                    <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-sm relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500 rounded-l-2xl"></div>
                                                        <h3 className="font-bold text-lg mb-4 text-purple-800 dark:text-purple-300 flex items-center gap-2">
                                                            <MessageSquare className="w-4 h-4" /> Comprehensive AI Feedback
                                                        </h3>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line pl-2 italic">
                                                            "{interviewData.feedback}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center flex flex-col items-center">
                                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                                    <Clock className="w-7 h-7 text-blue-500" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Interview In Progress</h3>
                                                <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                                                    You have an interview session currently started but not finished. Complete it to see your performance metrics here!
                                                </p>
                                                <button
                                                    onClick={() => navigate('/ai-interview')}
                                                    disabled={isInternSelected}
                                                    className={`px-6 py-2.5 text-white font-medium rounded-xl transition-all shadow-lg ${
                                                        isInternSelected
                                                            ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none'
                                                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                                    }`}
                                                >
                                                    Resume Interview
                                                </button>
                                            </div>
                                        )
                                    ) : (
                                        <div className="p-12 text-center flex flex-col items-center">
                                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                                <Brain className="w-7 h-7 text-purple-500" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Ready for an AI Interview?</h3>
                                            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                                                Take our AI-powered interview to assess your skills and get valuable feedback.
                                            </p>
                                            <button
                                                onClick={() => navigate('/ai-interview')}
                                                disabled={isInternSelected}
                                                className={`px-6 py-2.5 text-white font-medium rounded-xl transition-all shadow-lg ${
                                                    isInternSelected
                                                        ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed shadow-none'
                                                        : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                                                }`}
                                            >
                                                Start Interview
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ================================ */}
                        {/* ========= LEAVES TAB =========== */}
                        {/* ================================ */}
                        {activeTab === "leaves" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                                {/* Left column: Apply Leave Form */}
                                <div className="lg:col-span-1 bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Apply for Leave</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Submit a leave request for approval.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Leave Type</label>
                                                                            <select
                                                value={leaveType}
                                                onChange={(e) => setLeaveType(e.target.value)}
                                                className="w-full bg-white dark:bg-[#0a192f] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                                            >
                                                <option value="Sick" className="bg-white dark:bg-[#0a192f] text-slate-900 dark:text-white">Sick Leave</option>
                                                <option value="Casual" className="bg-white dark:bg-[#0a192f] text-slate-900 dark:text-white">Casual Leave</option>
                                                <option value="Vacation" className="bg-white dark:bg-[#0a192f] text-slate-900 dark:text-white">Vacation</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">From Date</label>
                                                <input
                                                    type="date"
                                                    value={fromDate}
                                                    min={minDateStr}
                                                    max={maxDateStr}
                                                    onChange={(e) => setFromDate(e.target.value)}
                                                    className="w-full bg-white dark:bg-[#0a192f] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">To Date</label>
                                                <input
                                                    type="date"
                                                    value={toDate}
                                                    min={fromDate || minDateStr}
                                                    max={maxDateStr}
                                                    onChange={(e) => setToDate(e.target.value)}
                                                    className="w-full bg-white dark:bg-[#0a192f] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">Reason</label>
                                            <textarea
                                                rows="3"
                                                placeholder="Explain the reason for your leave request..."
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-full bg-white dark:bg-[#0a192f] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                style={{ display: "none" }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isUploading}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 text-xs font-semibold rounded-lg hover:bg-emerald-100/50 transition-colors"
                                            >
                                                {isUploading ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Upload className="w-3.5 h-3.5" />
                                                )}
                                                {attachmentUrl ? "Change Attachment" : "Upload File"}
                                            </button>
                                            {attachmentUrl && (
                                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                                    ✓ Attached
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleApplyLeave}
                                            disabled={isSubmitting}
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-75"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : null}
                                            Submit Leave Request
                                        </button>
                                    </div>
                                </div>

                                {/* Right column: Leave History List */}
                                <div className="lg:col-span-2 bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Leave History</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">View and track your submitted leaves.</p>

                                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[450px] overflow-y-auto pr-1">
                                        {loadingLeaves ? (
                                            <div className="text-center py-12 text-sm text-slate-400 animate-pulse">
                                                Loading leave history...
                                            </div>
                                        ) : leavesList.length === 0 ? (
                                            <div className="text-center py-12">
                                                <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">No leave requests found.</p>
                                            </div>
                                        ) : (
                                            leavesList.map((leave, index) => (
                                                <div key={leave.id || index} className="py-4 flex flex-col sm:flex-row justify-between gap-4 first:pt-0 last:pb-0">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold text-sm text-slate-800 dark:text-white">
                                                                {leave.leave_type} Leave
                                                            </span>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getLeaveStatusBadgeColor(leave.status)}`}>
                                                                {leave.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                            <CalendarDays className="w-3.5 h-3.5" />
                                                            {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}
                                                        </p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
                                                            "{leave.reason}"
                                                        </p>
                                                        {leave.remarks && (
                                                            <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-2 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2">
                                                                <span className="font-bold">Remarks:</span> {leave.remarks}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {leave.attachment_url && (
                                                        <a
                                                            href={leave.attachment_url}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                                                        >
                                                            <FileText className="w-3.5 h-3.5" /> View Proof
                                                        </a>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Fade-in animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}


// ── Reusable Components ──────────────────────────────────────
const Detail = ({ label, value }) => (
    <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
        <p className="font-semibold text-slate-800 dark:text-white break-words">
            {value || (
                <span className="text-slate-400 font-normal italic">Not provided</span>
            )}
        </p>
    </div>
);

// ── Helper Functions ──────────────────────────────────────────
const getStatusColor = (is_select) => {
    if (is_select === "Applied") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (is_select === "Under Review") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";
    if (["Assessment Stage", "Task Assigned", "Task Submitted", "Task to be Selected", "Task Resubmitted"].includes(is_select)) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    if (["Task Reviewed – Pass", "Selected", "Onboarded", "Completed", "Internship", "Week 1 Review", "Week 2 Review", "On Track", "Recommended for Offer"].includes(is_select)) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (["Task Overdue (Auto)", "Task Reviewed – Fail (Resubmission Allowed)", "Task Reviewed – Fail (Final)", "Resubmission Not Received (Auto)", "Rejected", "Performance Issue", "Interview Failed", "Interview No Show"].includes(is_select)) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (is_select === "Interview Stage" || ["Interview Scheduled", "Interview Rescheduled", "Interview On Hold"].includes(is_select)) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    if (["Interview Passed", "Pre-boarding / Selected", "Rules Shared & Email Sent", "Rules Shared", "Selection Email Sent", "Pre-boarding Completed"].includes(is_select)) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (is_select === "On Hold") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (is_select === "Withdrawn" || is_select === "Inactive") return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
};

const getLeaveStatusBadgeColor = (status) => {
    switch (status) {
        case "Pending":
            return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200/30";
        case "Approved":
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200/30";
        case "Rejected":
            return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200/30";
        default:
            return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    }
};

const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
};
