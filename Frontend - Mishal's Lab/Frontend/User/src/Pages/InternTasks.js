import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";
import { 
    ChevronLeft, FolderGit2, CheckCircle2, Clock, Circle, 
    Loader2, ArrowRight, Star, AlertCircle, Layout, ListTodo,
    GripVertical, Search, Filter, Calendar, TrendingUp, CheckCircle, 
    Layers, Zap, MoreVertical, Hash, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InternTasks() {
    const navigate = useNavigate();
    const { user, profile, loadingUser } = useAuthModal();
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        if (!loadingUser && !user) navigate("/");
    }, [user, loadingUser, navigate]);

    useEffect(() => {
        async function fetchWork() {
            const uid = user?.id || profile?.id;
            if (!uid) return;
            setLoading(true);
            try {
                const { data: projDevs } = await supabase
                    .from("p_project_developers")
                    .select("project_id")
                    .eq("developer_id", uid);
                
                let pIds = projDevs?.map(pd => pd.project_id) || [];

                let myProjects = [];
                if (pIds.length > 0) {
                    const [
                        { data: fetchedProjects },
                        { data: progressData }
                    ] = await Promise.all([
                        supabase.from("p_projects").select("*").in("id", pIds),
                        supabase.from("p_calculate_project_progress").select("*").in("project_id", pIds)
                    ]);
                    
                    myProjects = (fetchedProjects || []).map(p => ({
                        ...p,
                        progress: progressData?.find(pr => pr.project_id === p.id) || { progress_percentage: 0 }
                    }));
                }
                setProjects(myProjects);
                if (myProjects.length > 0 && !activeProjectId) setActiveProjectId(myProjects[0].id);

                const { data: myTasks } = await supabase
                    .from("p_tasks")
                    .select("*")
                    .eq("assignee_id", uid)
                    .order("created_at", { ascending: false });
                
                setTasks(myTasks || []);
            } catch (e) {
                console.error("Failed to fetch work:", e);
            } finally {
                setLoading(false);
            }
        }
        if (!loadingUser && (user?.id || profile?.id)) {
            fetchWork();
        }
    }, [user?.id, profile?.id, loadingUser]);

    const callEdge = async (action, payload) => {
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
                body: JSON.stringify({ action, ...payload }),
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result?.error) {
            throw new Error(result?.error || "Edge request failed");
        }

        return result;
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            await callEdge("update_task_status", {
                taskId,
                status: newStatus,
                completed_at: newStatus === "done" ? new Date().toISOString() : null,
            });

            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        } catch (e) {
            console.error(e);
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesProject = !activeProjectId || t.project_id === activeProjectId;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = filterStatus === "all" || t.status === filterStatus;
        return matchesProject && matchesSearch && matchesStatus;
    });

    const activeProject = projects.find(p => p.id === activeProjectId);
    const stats = {
        total: filteredTasks.length,
        completed: filteredTasks.filter(t => t.status === "done").length,
        inProgress: filteredTasks.filter(t => t.status === "in_progress").length,
        todo: filteredTasks.filter(t => t.status === "todo").length
    };

    if (loadingUser || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-600 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Layers className="w-6 h-6 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Loading Workspace</h2>
                        <p className="text-sm text-slate-500 font-medium">Preparing your professional environment...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfdfe] dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-30">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-400/30 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-indigo-400/20 blur-[100px] rounded-full" />
            </div>

            {/* Glassy Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <motion.button 
                            whileHover={{ x: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/intern-portal")} 
                            className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold transition-colors"
                        >
                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
                                <ChevronLeft className="w-5 h-5" />
                            </div>
                            <span className="hidden md:inline">Back to Portal</span>
                        </motion.button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                                    Professional Workspace
                                </h1>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search everything..." 
                                className="pl-11 pr-4 py-2.5 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 rounded-2xl text-sm outline-none w-80 transition-all duration-300 backdrop-blur-sm"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-6 pt-28 pb-12">
                <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">
                    
                    {/* LEFT SIDEBAR: Projects & Analytics */}
                    <div className="space-y-8 sticky top-28">
                        {/* Projects Card */}
                        <div className="bg-white dark:bg-slate-900/50 rounded-[32px] p-6 border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                        <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h2 className="text-lg font-bold tracking-tight">Your Projects</h2>
                                </div>
                                <span className="text-[11px] font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full ring-1 ring-slate-200 dark:ring-slate-700">
                                    {projects.length} ACTIVE
                                </span>
                            </div>
                            
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {projects.map((p, idx) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setActiveProjectId(p.id)}
                                            className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                                                activeProjectId === p.id 
                                                ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20" 
                                                : "bg-slate-50 dark:bg-slate-800/40 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                                                        activeProjectId === p.id 
                                                        ? "bg-white/20 text-white shadow-inner" 
                                                        : "bg-white dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 shadow-sm"
                                                    }`}>
                                                        <FolderGit2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-bold text-sm transition-colors ${activeProjectId === p.id ? "text-white" : "text-slate-800 dark:text-white"}`}>
                                                            {p.name}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeProjectId === p.id ? "bg-white/60" : "bg-emerald-500"}`} />
                                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${activeProjectId === p.id ? "text-white/70" : "text-slate-400"}`}>
                                                                {p.status?.replace("_", " ") || "In Progress"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <span className={activeProjectId === p.id ? "text-white/60" : "text-slate-400"}>Velocity</span>
                                                    <span className={activeProjectId === p.id ? "text-white" : "text-blue-600"}>
                                                        {Math.round(p.progress?.progress_percentage || 0)}%
                                                    </span>
                                                </div>
                                                <div className={`h-1.5 w-full rounded-full overflow-hidden p-[2px] ${activeProjectId === p.id ? "bg-black/10" : "bg-slate-200 dark:bg-slate-700"}`}>
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${p.progress?.progress_percentage || 0}%` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            activeProjectId === p.id ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-gradient-to-r from-blue-500 to-indigo-600"
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Completed", value: stats.completed, color: "emerald", icon: CheckCircle },
                                { label: "In Progress", value: stats.inProgress, color: "blue", icon: Clock },
                                { label: "Pending", value: stats.todo, color: "amber", icon: Circle },
                                { label: "Total Tasks", value: stats.total, color: "slate", icon: Hash }
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (i * 0.05) }}
                                    className="bg-white dark:bg-slate-900/50 p-4 rounded-[24px] border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2"
                                >
                                    <div className={`w-8 h-8 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                                        <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black">{stat.value}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT CONTENT: Tasks List */}
                    <div className="space-y-8">
                        {/* Header & Controls */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Workspace</h2>
                                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                                    <span className="text-blue-600 font-bold px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm">
                                        {activeProject?.name || "All Projects"}
                                    </span>
                                </div>
                                <p className="text-slate-500 font-medium">Manage your deliverables and track daily progress</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800">
                                    {["all", "todo", "in_progress", "done"].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-300 ${
                                                filterStatus === status 
                                                ? "bg-white dark:bg-slate-800 text-blue-600 shadow-md shadow-slate-200 dark:shadow-none" 
                                                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                                            }`}
                                        >
                                            {status.replace("_", " ")}
                                        </button>
                                    ))}
                                </div>
                                <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-all group">
                                    <Filter className="w-4 h-4 text-slate-500 group-hover:text-blue-500" />
                                </button>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="grid gap-5">
                            <AnimatePresence mode="popLayout">
                                {filteredTasks.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="py-24 flex flex-col items-center justify-center bg-white dark:bg-slate-900/30 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center"
                                    >
                                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 relative">
                                            <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
                                            <Zap className="w-10 h-10 text-blue-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Clear Skies!</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto font-medium">
                                            No tasks found matching your criteria. Take a moment to breathe or switch your filter.
                                        </p>
                                    </motion.div>
                                ) : filteredTasks.map((t, idx) => (
                                    <motion.div
                                        key={t.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className={`group relative overflow-hidden bg-white dark:bg-slate-900/40 rounded-[28px] border transition-all duration-500 ${
                                            t.status === "done" 
                                            ? "border-emerald-200 dark:border-emerald-900/20 opacity-75" 
                                            : "border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30"
                                        }`}
                                    >
                                        {/* Status Accent Bar */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                            t.status === "done" ? "bg-emerald-500" :
                                            t.status === "in_progress" ? "bg-blue-500" :
                                            "bg-slate-300 dark:bg-slate-700"
                                        }`} />

                                        <div className="p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
                                            <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors hidden md:block mt-1">
                                                <GripVertical className="w-6 h-6" />
                                            </div>
                                            
                                            <div className="flex-1 space-y-5">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <h3 className={`text-xl font-bold transition-all duration-500 ${
                                                                t.status === "done" 
                                                                ? "text-slate-400 line-through decoration-emerald-500/50" 
                                                                : "text-slate-900 dark:text-white"
                                                            }`}>
                                                                {t.title}
                                                            </h3>
                                                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ${
                                                                t.priority === "high" ? "bg-red-50 text-red-600 ring-red-100 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-900/30" :
                                                                t.priority === "medium" ? "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-900/30" :
                                                                "bg-blue-50 text-blue-600 ring-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-900/30"
                                                            }`}>
                                                                {t.priority}
                                                            </div>
                                                        </div>
                                                        {t.description && (
                                                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 max-w-2xl">
                                                                {t.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    
                                                    <button className="md:hidden p-2 text-slate-400">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-6">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">
                                                            Deadline: <span className="text-slate-900 dark:text-slate-200">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "Flexible"}</span>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                                                            Pushed: {new Date(t.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center gap-3 self-center md:self-start bg-slate-50 dark:bg-slate-800/80 p-2 rounded-[22px] border border-slate-200/50 dark:border-slate-700/50">
                                                <button 
                                                    onClick={() => updateTaskStatus(t.id, "todo")}
                                                    title="Set to Todo"
                                                    className={`p-3 rounded-2xl transition-all duration-300 ${
                                                        t.status === "todo" 
                                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg ring-1 ring-slate-200 dark:ring-slate-600" 
                                                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                    }`}
                                                >
                                                    <Circle className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => updateTaskStatus(t.id, "in_progress")}
                                                    title="Set to In Progress"
                                                    className={`p-3 rounded-2xl transition-all duration-300 ${
                                                        t.status === "in_progress" 
                                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30" 
                                                        : "text-slate-400 hover:text-blue-500"
                                                    }`}
                                                >
                                                    <TrendingUp className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => updateTaskStatus(t.id, "done")}
                                                    title="Mark as Complete"
                                                    className={`p-3 rounded-2xl transition-all duration-300 ${
                                                        t.status === "done" 
                                                        ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/30" 
                                                        : "text-slate-400 hover:text-emerald-500"
                                                    }`}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Action Button (Optional) */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-3xl shadow-2xl shadow-blue-600/40 flex items-center justify-center z-40 md:hidden"
            >
                <PlusIcon className="w-8 h-8" />
            </motion.button>
        </div>
    );
}

function PlusIcon({ className }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );
}

