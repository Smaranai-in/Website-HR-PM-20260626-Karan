import React, { useEffect, useState } from "react";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
    Search,
    MonitorPlay,
    FileText,
    X,
    CheckCircle,
    XCircle,
    Briefcase,
    Star,
    User,
    Clock,
    ExternalLink,
    Filter
} from "lucide-react";

export default function AIInterviewsList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const { profile, loadingUser } = useAuthModal();
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);

    useEffect(() => {
        setActiveVideoIndex(0);
    }, [selected]);

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
        if (!loadingUser) {
            if (!profile || profile?.role !== "admin") navigate("/");
        }
    }, [profile, loadingUser, navigate]);

    // ---------------- LOAD DATA ----------------
    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                const res = await callEdge("get_ai_interviews");
                const interviewsData = res.interviews || [];
                const usersData = res.users || [];

                const usersMap = {};
                if (usersData) {
                    usersData.forEach(u => {
                        if (u.user_id) {
                            usersMap[u.user_id] = u;
                        }
                    });
                }

                const mappedData = (interviewsData || []).map(interview => ({
                    ...interview,
                    w_users: usersMap[interview.user_id] || null
                }));

                if (!cancelled) setItems(mappedData);
            } catch (err) {
                console.error("Failed to load AI interviews:", err);
                if (!cancelled) setError("Failed to load AI interviews.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // Helpers
    const getInitials = (name) => {
        return name
            ? name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "??";
    };

    const getFullName = (item) => {
        return item?.w_users?.full_name || item?.w_users?.name || item?.w_users?.email || item?.profiles?.full_name || item?.profiles?.email || item?.user_id || "Unknown User";
    };

    const statusList = ["in_progress", "completed", "failed"];

    // ---------------- FILTER LOGIC ----------------
    const filtered = items.filter((it) => {
        if (filterStatus !== "All" && it.status !== filterStatus) return false;
        if (!search) return true;

        const q = search.toLowerCase();
        const name = getFullName(it).toLowerCase();
        const role = (it.job_role || "").toLowerCase();
        return name.includes(q) || role.includes(q);
    });

    // ---------------- DETAILS ----------------
    const openDetails = (id) => {
        const found = items.find((x) => x.id === id);
        setSelected(found || null);
    };

    const closeDetails = () => setSelected(null);

    const getStatusColor = (status) => {
        if (status === "completed") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        if (status === "in_progress") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        if (status === "failed") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    };

    // ---------------- UI ----------------
    return (
        <div className="flex h-screen bg-[#f3f8f7] dark:bg-[#020c1b] font-sans text-slate-800 dark:text-slate-200 overflow-hidden pt-20 transition-colors duration-300">
            {/* BACKDROP OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#0A0F2C] border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 z-40 shadow-xl lg:shadow-sm transition-all duration-300 transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-pink-700 dark:text-pink-400">
                        <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                            <MonitorPlay size={16} />
                        </div>
                        AI Interviews
                    </h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Status Filters
                    </h3>
                    <nav className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
                        <button
                            onClick={() => {
                                setFilterStatus("All");
                                setSelected(null);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === "All"
                                ? "bg-pink-500 text-white shadow-md"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            <MonitorPlay size={18} />
                            All Interviews
                        </button>

                        {statusList.map((st) => (
                            <button
                                key={st}
                                onClick={() => {
                                    setFilterStatus(st);
                                    setSelected(null);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${filterStatus === st
                                    ? "bg-pink-500 text-white shadow-md"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {st === "completed" ? <CheckCircle size={16} className={filterStatus === st ? "text-white" : "text-gray-400"} /> :
                                    st === "in_progress" ? <Clock size={16} className={filterStatus === st ? "text-white" : "text-gray-400"} /> :
                                        <XCircle size={16} className={filterStatus === st ? "text-white" : "text-gray-400"} />}
                                <span className="truncate capitalize">{st.replace("_", " ")}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* MAIN LAYOUT */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* CENTER COLUMN: LIST */}
                <div
                    className={`flex flex-col p-4 sm:p-8 overflow-hidden transition-all duration-300 ${selected ? "lg:w-7/12 w-full" : "w-full"
                        }`}
                >
                    {/* HEADER */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm font-medium mb-3">
                                    <MonitorPlay size={14} className="mr-2" /> AI Interviews
                                </div>
                                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                                    Candidate Results{" "}
                                    <span className="text-gray-400 dark:text-gray-500 text-xl font-normal ml-2">
                                        {items.length}
                                    </span>
                                </h1>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm font-semibold hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-all border border-pink-100 dark:border-pink-800"
                            >
                                <Filter size={16} /> Filters
                            </button>
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative mb-6">
                        <Search
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search by candidate name or targeted role..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#112240] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-center">
                            {error}
                        </div>
                    )}

                    {/* SCROLLABLE LIST */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-20 text-gray-400">
                                Loading interviews...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                No interviews found.
                            </div>
                        ) : (
                            filtered.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => openDetails(item.id)}
                                    className={`group bg-white dark:bg-[#112240] p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-5
                                ${selected?.id === item.id
                                            ? "ring-2 ring-pink-500 border-transparent shadow-md"
                                            : "border-gray-100 dark:border-gray-700"
                                        }
                            `}
                                >
                                    {/* Initials */}
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm
                                ${item.status === 'completed' ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-pink-400 to-pink-600'}
                            `}
                                    >
                                        {getInitials(getFullName(item))}
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate">
                                            {getFullName(item)}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                                            <Briefcase size={14} /> {item.job_role || "Unknown Role"}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-xs flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">
                                                <Star size={12} className="text-yellow-500" /> Skill Rating: {item.skill_rating || 0}/10
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status + Date on the right */}
                                    <div className="flex flex-col items-end gap-1 ">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mr-2">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleDateString()
                                                : ""}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${getStatusColor(item.status)}
                      `}
                                        >
                                            {item.status ? item.status.replace("_", " ") : "pending"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: DETAILS */}
                {selected && (
                    <div className="w-full lg:w-5/12 bg-white dark:bg-[#0A0F2C] border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl z-30 absolute right-0 h-full animate-in slide-in-from-right-10 duration-300">
                        {/* Details Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="flex justify-between items-start mb-4">
                                <button
                                    onClick={closeDetails}
                                    className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                                >
                                    <X size={20} />
                                </button>
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(selected.status)}`}
                                >
                                    {selected.status ? selected.status.replace("_", " ") : "pending"}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                    {getInitials(getFullName(selected))}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {getFullName(selected)}
                                    </h2>
                                    <p className="text-pink-600 dark:text-pink-400 font-medium text-sm flex items-center gap-1">
                                        <Briefcase size={14} /> {selected.job_role || "Unknown Role"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                            <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-100 dark:border-pink-900/30">
                                <h3 className="font-bold text-pink-800 dark:text-pink-300 mb-3 flex items-center gap-2">
                                    <MonitorPlay size={18} /> Interview Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Field
                                            icon={<Star size={14} />}
                                            label="Candidate Self Skill Rating"
                                            value={`${selected.skill_rating}/10`}
                                        />
                                        <Field
                                            icon={<Clock size={14} />}
                                            label="Date Initiated"
                                            value={new Date(selected.created_at).toLocaleString()}
                                        />
                                    </div>
                                </div>
                            </div>

                            {selected.resume_url && (
                                <a
                                    href={selected.resume_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-4 border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors text-pink-700 dark:text-pink-300 group"
                                >
                                    <div className="bg-white dark:bg-[#0A0F2C] p-2 rounded-lg text-pink-600 dark:text-pink-400 group-hover:text-pink-800 dark:group-hover:text-pink-200">
                                        <FileText size={20} />
                                    </div>
                                    <span className="font-medium flex-1">View Uploaded Resume</span>
                                    <ExternalLink size={16} />
                                </a>
                            )}

                            {selected.video_url && (() => {
                                let videoList = [];
                                try {
                                    if (selected.video_url.startsWith('[')) {
                                        videoList = JSON.parse(selected.video_url);
                                    } else {
                                        videoList = [selected.video_url];
                                    }
                                } catch (e) {
                                    videoList = [selected.video_url];
                                }
                                
                                if (videoList.length === 0) return null;
                                
                                const activeIdx = activeVideoIndex < videoList.length ? activeVideoIndex : 0;
                                const currentVideoUrl = videoList[activeIdx];
                                
                                return (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 px-1">Interview Recording</h4>
                                        <div className="bg-black rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md">
                                            <video
                                                key={currentVideoUrl}
                                                src={currentVideoUrl}
                                                controls
                                                className="w-full h-auto object-contain"
                                                style={{ maxHeight: '400px' }}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        {videoList.length > 1 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {videoList.map((url, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveVideoIndex(idx)}
                                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                                                            activeIdx === idx
                                                                ? 'bg-pink-600 border-pink-600 text-white shadow-sm shadow-pink-500/20'
                                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/55'
                                                        }`}
                                                    >
                                                        Question {idx + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {selected.questions && Array.isArray(selected.questions) && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase mb-3 px-1">Questions & Answers ({selected.questions.length})</h4>
                                    <div className="space-y-3">
                                        {selected.questions.map((q, idx) => {
                                            const ans = selected.answers && selected.answers[idx];
                                            return (
                                                <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Q: {q.question || q}</p>
                                                    <div className="text-xs mt-2 border-t dark:border-gray-700 pt-2">
                                                        <span className="font-medium text-pink-500 dark:text-pink-400 block mb-1">Answer:</span>
                                                        <span className="text-gray-600 dark:text-gray-400">{ans || "Not answered"}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Proctoring Summary Card */}
                            {((selected.tab_switch_count !== undefined && selected.tab_switch_count !== null) ||
                              selected.face_missing_duration !== undefined ||
                              selected.face_visibility_warnings !== undefined) && (
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase px-1">
                                        Proctoring Summary
                                    </h4>
                                    
                                    {/* Suspicion Flag Banner */}
                                    <div className={`p-4 rounded-xl text-center border font-bold text-sm ${
                                        selected.is_suspicious
                                            ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                            : 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                    }`}>
                                        {selected.is_suspicious 
                                            ? '⚠️ FLAG FOR REVIEW: Suspicious Activity Detected'
                                            : '✅ CLEAR: Candidate adhered to all proctoring guidelines'}
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Tab Switches */}
                                        <div className={`p-3 rounded-xl border text-center ${
                                            (selected.tab_switch_count ?? 0) >= 3
                                                ? 'bg-red-50/50 dark:bg-red-500/5 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/10'
                                                : 'bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800'
                                        }`}>
                                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">Tab Switches</p>
                                            <p className="text-lg font-extrabold">{selected.tab_switch_count ?? 0}</p>
                                        </div>

                                        {/* Face Missing Duration */}
                                        <div className={`p-3 rounded-xl border text-center ${
                                            (selected.face_missing_duration ?? 0) >= 30
                                                ? 'bg-red-50/50 dark:bg-red-500/5 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/10'
                                                : (selected.face_missing_duration ?? 0) > 0
                                                    ? 'bg-amber-50/50 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/10'
                                                    : 'bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800'
                                        }`}>
                                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">Face Hidden</p>
                                            <p className="text-lg font-extrabold">
                                                {selected.face_missing_duration !== undefined
                                                    ? selected.face_missing_duration < 60
                                                        ? `${selected.face_missing_duration}s`
                                                        : `${Math.floor(selected.face_missing_duration / 60)}m ${selected.face_missing_duration % 60}s`
                                                    : '0s'}
                                            </p>
                                        </div>

                                        {/* Face Warnings */}
                                        <div className={`p-3 rounded-xl border text-center ${
                                            (selected.face_visibility_warnings ?? 0) > 0
                                                ? 'bg-amber-50/50 dark:bg-amber-500/5 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/10'
                                                : 'bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 border-gray-100 dark:border-gray-800'
                                        }`}>
                                            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1">Face Warnings</p>
                                            <p className="text-lg font-extrabold">{selected.face_visibility_warnings ?? 0}</p>
                                        </div>
                                    </div>

                                    {/* Camera Disconnected Events */}
                                    {selected.camera_disconnected_events && 
                                     Array.isArray(selected.camera_disconnected_events) && 
                                     selected.camera_disconnected_events.length > 0 && (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                                Camera Connection Events ({selected.camera_disconnected_events.length})
                                            </p>
                                            <div className="space-y-1.5 text-xs max-h-24 overflow-y-auto custom-scrollbar pr-1">
                                                {selected.camera_disconnected_events.map((evt, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/50 pb-1 last:border-0 last:pb-0">
                                                        <span className="capitalize font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                evt.type === 'disconnected' ? 'bg-red-500' : 'bg-green-500'
                                                            }`} />
                                                            Camera {evt.type}
                                                        </span>
                                                        <span className="font-mono text-[10px]">
                                                            {new Date(evt.timestamp).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

// ---------------- SUB COMPONENT ----------------
function Field({ label, value, icon, isFull }) {
    return (
        <div className={isFull ? "col-span-2" : ""}>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                {icon} {label}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
                {value || "—"}
            </p>
        </div>
    );
}
