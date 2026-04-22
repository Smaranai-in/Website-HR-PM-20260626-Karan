import React, { useState, useEffect } from "react";
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
    ChevronUp
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function MyPage() {
    const { user, profile, loadingUser } = useAuthModal();
    const [loading, setLoading] = useState(true);
    const [internData, setInternData] = useState(null);
    const [interviewData, setInterviewData] = useState(null);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardDetails = async () => {
            try {
                if (!profile?.id) return;

                // 1. Fetch Internship App
                const { data, error } = await supabase
                    .from("internship_applications")
                    .select("*")
                    .eq("user_id", user?.id || profile?.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (data) {
                    let parsedHistory = [];
                    try {
                        if (typeof data.status_history === "string") {
                            parsedHistory = JSON.parse(data.status_history);
                        } else if (Array.isArray(data.status_history)) {
                            parsedHistory = data.status_history;
                        }
                    } catch (e) {
                        console.warn("Failed to parse status_history", e);
                    }
                    data.status_history = parsedHistory;
                }

                setInternData(data || null);

                // 2. Fetch Latest AI Interview Results
                const { data: interviewRes } = await supabase
                    .from("interviews")
                    .select("*")
                    .eq("user_id", user?.id || profile?.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (interviewRes) {
                    setInterviewData(interviewRes);
                }

            } catch (error) {
                console.error("Error fetching Dashboard details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardDetails();
    }, [profile, user]);

    useEffect(() => {
        if (!loadingUser && !user) navigate("/");
    }, [user, loadingUser, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-16 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">

                {/* ================= INTERNSHIP APPLICATION DETAILS ================= */}
                <div className="max-w-5xl mx-auto">
                    {internData ? (
                        <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <Briefcase className="w-6 h-6 text-emerald-500" />
                                    SmaranAI Internship Details
                                </h2>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(internData.is_select || internData.current_status || "Applied")}`}>
                                    {internData.is_select || internData.current_status || "Applied"}
                                </span>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Academic Info */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <GraduationCap size={14} /> Education & Personal
                                    </h3>
                                    <Detail label="Full Name" value={internData.full_name} />
                                    <Detail label="University" value={internData.university} />
                                    <Detail label="Degree & Branch" value={`${internData.program_type} - ${internData.branch}`} />
                                    <Detail label="Graduation Year" value={internData.graduation_year} />
                                </div>

                                {/* Role & Availability */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock size={14} /> Role & Availability
                                    </h3>
                                    <Detail label="Priority Role" value={internData.top_priority_role} />
                                    <Detail label="Availability" value={internData.availability} />
                                    <Detail label="Ready to Join" value={internData.available_to_join} />
                                    <Detail label="Working Hours" value={`${internData.start_time} - ${internData.end_time}`} />
                                </div>

                                {/* Contact & Professional Links */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={14} /> Contact & Links
                                    </h3>
                                    <Detail label="Phone" value={internData.phone_number} />
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {internData.linkedin_profile && (
                                            <a href={internData.linkedin_profile} target="_blank" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-blue-600 hover:scale-110 transition-transform">
                                                <FaLinkedin size={20} />
                                            </a>
                                        )}
                                        {internData.github_url && (
                                            <a href={internData.github_url} target="_blank" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-slate-800 dark:text-white hover:scale-110 transition-transform">
                                                <FaGithub size={20} />
                                            </a>
                                        )}
                                        {internData.portfolio_url && (
                                            <a href={internData.portfolio_url} target="_blank" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-emerald-600 hover:scale-110 transition-transform">
                                                <FaGlobe size={20} />
                                            </a>
                                        )}
                                    </div>
                                    {internData.cv_url && (
                                        <a
                                            href={internData.cv_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
                                        >
                                            <FileText size={16} /> View Resume
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Experience Description Footer */}
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

                            {/* Admin Updates & Remarks Section */}
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
                                        <div className="p-2 bg-white dark:bg-[#112240] rounded-full border border-slate-200 dark:border-slate-700 shadow-sm group-hover:bg-slate-50 dark:group-hover:bg-[#0a192f] transition-colors">
                                            {isTimelineOpen ? (
                                                <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            )}
                                        </div>
                                    </button>

                                    {isTimelineOpen && (
                                        <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
                                            {/* 1. New JSONB History Array (Prioritized) */}
                                            {internData.status_history && Array.isArray(internData.status_history) && internData.status_history.length > 0 ? (
                                                internData.status_history.map((historyItem, index) => (
                                                    <div key={`history-${index}`} className="bg-white dark:bg-[#112240] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden pl-4">
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${historyItem.status === 'Rejected' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>

                                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                                    {historyItem.status === 'Applied' ? (
                                                                        <Briefcase className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                                                                    ) : (
                                                                        <MessageSquare className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                                                    )}
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest">
                                                                    {historyItem.status}
                                                                </span>
                                                            </div>

                                                            {historyItem.date && (
                                                                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md whitespace-nowrap">
                                                                    <Clock className="w-3 h-3" />
                                                                    {formatDateTime(historyItem.date)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {historyItem.remark && (
                                                            <div className="pl-8">
                                                                <p className="text-slate-600 dark:text-slate-300 text-sm italic">
                                                                    "{historyItem.remark}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    {/* 2. Fallback: Old Arrays of reviews */}
                                                    {Array.isArray(internData.review) && internData.review.map((rev, index) => {
                                                        const tsArray = internData.reviewtimestamp || internData.review_timestamp;
                                                        const timestamp = Array.isArray(tsArray) ? tsArray[index] : null;

                                                        return (
                                                            <div key={`legacy-arr-${index}`} className="bg-white dark:bg-[#112240] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden pl-4">
                                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

                                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                                            <MessageSquare className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                                                        </div>
                                                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Admin Update</span>
                                                                    </div>

                                                                    {timestamp && (
                                                                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md">
                                                                            <Clock className="w-3 h-3" />
                                                                            {formatDateTime(timestamp)}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="text-slate-700 dark:text-slate-300 text-sm pl-8 italic">
                                                                    "{rev}"
                                                                </p>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* 3. Fallback: Old single string reviews */}
                                                    {typeof internData.review === "string" && internData.review.trim() !== "" && !Array.isArray(internData.review) && (
                                                        <div className="bg-white dark:bg-[#112240] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden pl-4">
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                                    <MessageSquare className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Admin Remark</span>
                                                            </div>
                                                            <p className="text-slate-700 dark:text-slate-300 text-sm pl-8 italic">
                                                                "{internData.review}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#112240] p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-slate-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                                Internship Application
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                You are not applied for the internship in <span className="text-emerald-500 font-semibold">SmaranAI</span>.
                            </p>
                        </div>
                    )}
                </div>

                {/* ================= AI INTERVIEW RESULTS SECTION ================= */}
                <div className="max-w-5xl mx-auto mt-10">
                    <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Brain className="w-6 h-6 text-purple-500" />
                                AI Interview
                            </h2>
                            {interviewData && (
                                <button
                                    onClick={() => navigate('/ai-interview')}
                                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-lg shadow-purple-600/20"
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
                                                    Tab Switches Detected: <span className={interviewData.tab_switch_count > 3 ? 'text-red-500' : 'text-emerald-500'}>{interviewData.tab_switch_count || 0}</span>
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
                                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20"
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
                                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-600/20"
                                >
                                    Start Interview
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}


// Reusable Detail Component
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

// ---------------- HELPER FUNCTIONS for Profile Display ----------------
const getStatusColor = (is_select) => {
    if (is_select === "Applied") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (is_select === "Under Review") return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";

    // Assessment Group
    if ([
        "Assessment Stage", "Task Assigned", "Task Submitted", "Task to be Selected", "Task Resubmitted"
    ].includes(is_select)) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

    if ([
        "Task Reviewed – Pass", "Selected", "Onboarded", "Completed", "Internship",
        "Week 1 Review", "Week 2 Review", "On Track", "Recommended for Offer"
    ].includes(is_select)) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";

    if ([
        "Task Overdue (Auto)", "Task Reviewed – Fail (Resubmission Allowed)", "Task Reviewed – Fail (Final)",
        "Resubmission Not Received (Auto)", "Rejected", "Performance Issue", "Interview Failed", "Interview No Show"
    ].includes(is_select)) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    // Interview Group
    if (is_select === "Interview Stage" || [
        "Interview Scheduled", "Interview Rescheduled", "Interview On Hold"
    ].includes(is_select)) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

    if ([
        "Interview Passed", "Pre-boarding / Selected", "Rules Shared & Email Sent", "Rules Shared",
        "Selection Email Sent", "Pre-boarding Completed"
    ].includes(is_select)) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    if (is_select === "On Hold") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (is_select === "Withdrawn" || is_select === "Inactive") return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

    return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
};

const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
};
