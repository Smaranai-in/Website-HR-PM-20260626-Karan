import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";
import {
  ArrowLeft, Clock, User, MessageSquare, Search, RefreshCw,
  LogIn, LogOut, BookOpen, Calendar, CheckCircle2, AlertCircle,
  Activity, Filter, ChevronDown, TrendingUp, Users, Eye,
  X, Phone, MapPin, ExternalLink, Briefcase, FileText, ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";

const EVENT_TYPES = {
  "Status Update": { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-blue-500" },
  "Applied": { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
  "Check In": { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
  "Check Out": { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", dot: "bg-orange-500" },
  "Assessment Assigned": { color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", dot: "bg-purple-500" },
  "Assessment Submitted": { color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400", dot: "bg-teal-500" },
};

const typeStyle = (type) => EVENT_TYPES[type] || { color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", dot: "bg-slate-400" };

const GRAD = ["from-violet-500 to-purple-600","from-emerald-500 to-teal-600","from-blue-500 to-indigo-600","from-rose-500 to-pink-600","from-amber-500 to-orange-600","from-cyan-500 to-sky-600"];

const statusColor = (s="") => {
  if (s.includes("Selected")||s.includes("Onboard")||s.includes("Track")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (s.includes("Reject")||s.includes("Fail")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (s.includes("Review")||s.includes("Interview")) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
  if (s.includes("Task")||s.includes("Assessment")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
};

export default function UserActivity() {
  const [internStats, setInternStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [attendanceData, setAttendanceData] = useState([]);
  const [allAssessments, setAllAssessments] = useState([]);
  const [internProjects, setInternProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const { profile, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && (!profile || profile.role !== "admin")) navigate("/");
  }, [profile, loadingUser, navigate]);

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

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callEdge("get_admin_user_activity");
      const apps = res.apps || [];
      const attendance = res.attendance || [];
      const assessments = res.assessments || [];

      setAttendanceData(attendance);
      setAllAssessments(assessments);

      // Build user_id → name+email map from apps
      const userMap = {};
      (apps || []).forEach(a => { userMap[a.user_id] = { name: a.full_name, email: a.email, role: a.top_priority_role }; });

      // Build per-intern stats
      const statsMap = {};
      (apps || []).forEach(a => {
        statsMap[a.user_id] = { ...a, name: a.full_name, email: a.email, role: a.top_priority_role, status: a.current_status, present: 0, totalSessions: 0, totalHours: 0, assessmentStatus: null, attendanceLogs: [] };
      });
      (attendance || []).forEach(log => {
        if (!statsMap[log.user_id]) return;
        statsMap[log.user_id].attendanceLogs.push(log);
        if (log.check_in) statsMap[log.user_id].present++;
        if (log.check_in && log.check_out) {
          statsMap[log.user_id].totalSessions++;
          statsMap[log.user_id].totalHours += (new Date(log.check_out) - new Date(log.check_in)) / 3600000;
        }
      });
      (assessments || []).forEach(asm => {
        if (statsMap[asm.user_id]) statsMap[asm.user_id].assessmentStatus = asm.status;
      });
      setInternStats(Object.values(statsMap));

    } catch (err) {
      console.error("Error fetching activities:", err);
      toast.error("Failed to load activities: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const today = new Date().toISOString().split("T")[0];
  const checkinsToday = internStats.filter(i => i.attendanceLogs?.some(l => l.date === today)).length;
  const submittedCount = allAssessments.filter(a => a.status === "submitted").length;
  const totalHrsAll = internStats.reduce((s, i) => s + (i.totalHours || 0), 0);
  const avgHrs = internStats.length ? (totalHrsAll / internStats.length).toFixed(1) : 0;

  const getPerfScore = (intern) => {
    const h = Math.min((intern.totalHours / 40) * 40, 40);
    const a = intern.assessmentStatus === "submitted" ? 30 : intern.assessmentStatus === "assigned" ? 10 : 0;
    const d = Math.min((intern.present / 20) * 30, 30);
    return Math.round(h + a + d);
  };
  const isActiveToday = (intern) => intern.attendanceLogs?.some(l => l.date === today && l.check_in);
  const getLastActive = (intern) => {
    const logs = [...(intern.attendanceLogs || [])].sort((a,b) => new Date(b.date)-new Date(a.date));
    return logs[0]?.date || null;
  };
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—";

  const statusOptions = ["All", ...Array.from(new Set(internStats.map(i => i.status).filter(Boolean)))];
  const roleOptions = ["All", ...Array.from(new Set(internStats.map(i => i.role).filter(Boolean)))];

  const filteredInterns = internStats.filter(intern => {
    const q = searchTerm.toLowerCase();
    const matchSearch = intern.name?.toLowerCase().includes(q) || intern.email?.toLowerCase().includes(q) || intern.role?.toLowerCase().includes(q) || intern.university?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || intern.status === statusFilter;
    const matchRole = roleFilter === "All" || intern.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  }).sort((a,b) => {
    if (sortBy === "perf") return getPerfScore(b) - getPerfScore(a);
    if (sortBy === "hours") return (b.totalHours||0) - (a.totalHours||0);
    if (sortBy === "days") return (b.present||0) - (a.present||0);
    if (sortBy === "applied") return new Date(b.created_at||0) - new Date(a.created_at||0);
    return (a.name||"z").localeCompare(b.name||"z");
  });

  const fmt = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: true });
  };

  if (loadingUser || (loading && internStats.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020c1b]">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-28 pb-20 px-4 md:px-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Intern Activity</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Attendance, status updates, and assessments from all interns</p>
          </div>
          <button onClick={fetchAll} disabled={loading}
            className="ml-auto p-2 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-colors">
            <RefreshCw size={16} className={`text-slate-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Interns", value: internStats.length, icon: Users, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30", sub: `${roleOptions.length-1} roles` },
            { label: "Active Today", value: checkinsToday, icon: LogIn, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30", sub: checkinsToday>0?"Currently online":"No check-ins yet" },
            { label: "Avg Hours / Intern", value: avgHrs, icon: Clock, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30", sub: `${totalHrsAll.toFixed(1)} hrs total` },
            { label: "Assessments Done", value: submittedCount, icon: CheckCircle2, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30", sub: `of ${allAssessments.length} assigned` },
          ].map((s,i) => (
            <div key={i} className="bg-white dark:bg-[#112240] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center`}><s.icon size={18}/></div>
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{s.value}</p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters + Sort */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
            <input type="text" placeholder="Search name, email, role, university..."
              value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 dark:text-white"/>
          </div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {statusOptions.map(s=><option key={s}>{s}</option>)}
          </select>
          <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {roleOptions.map(r=><option key={r}>{r}</option>)}
          </select>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="px-3 py-2.5 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
            <option value="name">Sort: Name</option>
            <option value="perf">Sort: Performance</option>
            <option value="hours">Sort: Hours</option>
            <option value="days">Sort: Attendance</option>
            <option value="applied">Sort: Applied Date</option>
          </select>
        </div>
        <p className="text-xs text-slate-400 mb-4">{filteredInterns.length} intern{filteredInterns.length!==1?"s":""} shown</p>

        {/* Intern Grid */}
        {filteredInterns.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800">
            <Users size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No interns found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredInterns.map((intern, i) => {
              const score = getPerfScore(intern);
              const active = isActiveToday(intern);
              const lastActive = getLastActive(intern);
              const grad = GRAD[i % GRAD.length];
              const scoreColor = score>=70?"text-emerald-500":score>=40?"text-amber-500":"text-red-400";
              const scoreBg = score>=70?"bg-emerald-500":score>=40?"bg-amber-500":"bg-red-400";
              return (
                <div key={i} onClick={()=>navigate('/intern-detail/' + intern.user_id)}
                  className="bg-white dark:bg-[#112240] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-200 cursor-pointer group">

                  {/* Gradient Top Bar */}
                  <div className={`bg-gradient-to-r ${grad} h-1.5 w-full`}/>

                  <div className="p-5">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {(intern.name||"?")[0].toUpperCase()}
                          </div>
                          {active && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#112240] rounded-full"/>}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate text-sm`}>{intern.name}</p>
                          <p className="text-xs text-slate-400 truncate">{intern.email}</p>
                        </div>
                      </div>
                      {/* Performance Score */}
                      <div className="text-center flex-shrink-0">
                        <p className={`text-xl font-black ${scoreColor}`}>{score}</p>
                        <p className="text-[10px] text-slate-400">Score</p>
                      </div>
                    </div>

                    {/* Role + Status */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {intern.role && <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">{intern.role}</span>}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor(intern.status||"")}` }>{intern.status||"Applied"}</span>
                      {active && <span className="text-xs font-bold px-2 py-0.5 bg-emerald-500 text-white rounded-full animate-pulse">● Online</span>}
                    </div>

                    {/* Performance Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Performance</span><span className={`font-bold ${scoreColor}`}>{score}/100</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${scoreBg} rounded-full transition-all duration-500`} style={{width:`${score}%`}}/>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 dark:bg-[#0a192f] rounded-xl p-3 mb-3">
                      <div><p className="text-base font-bold text-slate-800 dark:text-white">{intern.present}</p><p className="text-[10px] text-slate-400">Days In</p></div>
                      <div><p className="text-base font-bold text-slate-800 dark:text-white">{intern.totalHours.toFixed(1)}</p><p className="text-[10px] text-slate-400">Hours</p></div>
                      <div><p className="text-base font-bold text-slate-800 dark:text-white">{intern.totalSessions}</p><p className="text-[10px] text-slate-400">Sessions</p></div>
                    </div>

                    {/* University + Location */}
                    {(intern.university||intern.city) && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <MapPin size={11} className="text-slate-400 flex-shrink-0"/>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {[intern.university, intern.city, intern.state].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                    )}

                    {/* Assessment + Last Active */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        intern.assessmentStatus==="submitted"?"bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400":
                        intern.assessmentStatus==="assigned"?"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400":
                        "bg-slate-100 text-slate-400 dark:bg-slate-800"}`}>
                        {intern.assessmentStatus?`Task: ${intern.assessmentStatus}`:"No Task"}
                      </span>
                      {lastActive && <span className="text-[10px] text-slate-400">Last: {fmtDate(lastActive)}</span>}
                    </div>

                    {/* Social Links + Applied */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex gap-2">
                        {intern.linkedin_profile && <a href={intern.linkedin_profile} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-blue-500 hover:text-blue-600"><ExternalLink size={13}/></a>}
                        {intern.github_url && <a href={intern.github_url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-slate-500 hover:text-slate-700 dark:hover:text-white"><ExternalLink size={13}/></a>}
                        {intern.cv_url && <a href={intern.cv_url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-emerald-500 hover:text-emerald-600"><FileText size={13}/></a>}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">{fmtDate(intern.created_at)}</span>
                        <ChevronRight size={12} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"/>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>

    </>
  );
}
