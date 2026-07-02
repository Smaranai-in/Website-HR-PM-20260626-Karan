import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAllProjectData, getDevelopers, getDevelopersProgress, getTasksByDeveloper, getDeveloperDailyStats, getProjects } from "../../lib/data";
import { ArrowLeft, CheckCircle2, Circle, Clock, TrendingUp, User, Calendar, Loader2, ListTodo, Star } from "lucide-react";

const avatarGradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
];

function getGradient(id) {
    if (!id) return avatarGradients[0];
    const sum = String(id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarGradients[sum % avatarGradients.length];
}

function getInitials(name) {
    return (name || "?")
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

const taskStatusConfig = {
    todo: { label: "To Do", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
    in_progress: { label: "In Progress", bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
    done: { label: "Done", bg: "bg-emerald-50 dark:bg-emerald-900/30", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
};

export default function DeveloperDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const rawData = await fetchAllProjectData();
                const developers = getDevelopers(rawData);
                const projects = getProjects(rawData);
                const progressData = getDevelopersProgress(projects, developers);
                const tasksByDev = getTasksByDeveloper(projects, developers);
                const dailyStats = await getDeveloperDailyStats(id, 14, projects);

                const developer = developers.find(d => d.id === id);
                const stats = progressData.find(p => p.developerId === id);
                const tasks = tasksByDev[id] || [];

                setData(developer ? { developer, stats, tasks, dailyStats } : null);
            } catch (error) {
                console.error("Error fetching developer details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-sm font-medium">Loading developer profile...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] flex items-center justify-center">
                <div className="text-center">
                    <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="font-semibold text-slate-600 dark:text-slate-300">Developer not found</p>
                    <Link to="/projects/developers" className="mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-700">
                        <ArrowLeft className="h-4 w-4" /> Back to Team
                    </Link>
                </div>
            </div>
        );
    }

    const { developer, stats, tasks, dailyStats } = data;
    const initials = getInitials(developer.name);
    const gradient = getGradient(developer.id);
    const progressVal = stats?.progress || 0;
    const pending = (stats?.total || 0) - (stats?.completed || 0);

    const maxBar = Math.max(...(dailyStats || []).map(s => s.count), 1);

    const todoTasks = tasks.filter(t => t.status === "todo");
    const inProgressTasks = tasks.filter(t => t.status === "in_progress");
    const doneTasks = tasks.filter(t => t.status === "done");

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-12 px-6 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/projects" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Projects</Link>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <Link to="/projects/developers" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">Team</Link>
                    <span className="text-slate-300 dark:text-slate-600">/</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{developer.name}</span>
                </div>

                {/* Profile hero card */}
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                    <div className="p-6 flex flex-wrap items-center gap-6">
                        {/* Avatar */}
                        <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-2xl font-bold text-white shadow-lg`}>
                            {initials}
                        </div>

                        {/* Name + info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{developer.name}</h1>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800">
                                    <User className="h-3 w-3" />
                                    {developer.role || "Developer"}
                                </span>
                                {developer.employeeId && developer.employeeId !== "—" && (
                                    <span className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800">
                                        ID: {developer.employeeId}
                                    </span>
                                )}
                                {progressVal >= 80 && (
                                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <Star className="h-3 w-3" />
                                        Top Performer
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Circular progress */}
                        <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
                            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="3" />
                                <circle
                                    cx="18" cy="18" r="15.9" fill="none"
                                    stroke="url(#devGrad)"
                                    strokeWidth="3"
                                    strokeDasharray={`${progressVal} ${100 - progressVal}`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="devGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{progressVal}%</span>
                                <span className="text-[9px] text-slate-400 uppercase tracking-wider">Rate</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Total Assigned", value: stats?.total || 0, icon: ListTodo, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", sub: "Tasks across all projects" },
                        { label: "Completed", value: stats?.completed || 0, icon: CheckCircle2, gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", sub: "Successfully delivered" },
                        { label: "In Progress", value: inProgressTasks.length, icon: TrendingUp, gradient: "from-blue-400 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", sub: "Currently working on" },
                        { label: "Pending", value: pending, icon: Clock, gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-300", sub: "Remaining workload" },
                    ].map(item => (
                        <div key={item.label} className={`relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 ${item.bg} p-5 shadow-sm`}>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.label}</p>
                                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-sm`}>
                                    <item.icon className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <p className={`text-3xl font-bold ${item.text}`}>{item.value}</p>
                            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{item.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Daily completion chart */}
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Daily Task Completion</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Tasks completed over the last 14 days</p>
                    </div>
                    <div className="px-5 pb-5 pt-4">
                        <div className="flex items-end gap-1.5 h-32">
                            {(dailyStats || []).map(stat => {
                                const height = (stat.count / maxBar) * 100;
                                return (
                                    <div key={stat.date} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                                        {stat.count > 0 && (
                                            <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">{stat.count}</span>
                                        )}
                                        <div
                                            className={`w-full rounded-t-md bg-gradient-to-t ${gradient} min-h-[3px] transition-all duration-300 group-hover:opacity-80`}
                                            style={{ height: `${Math.max(height, stat.count > 0 ? 8 : 3)}%` }}
                                        />
                                        <span className="text-[9px] text-slate-400 dark:text-slate-600">
                                            {new Date(stat.date).toLocaleDateString(undefined, { day: "numeric", month: "short" }).split(" ")[0]}
                                        </span>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded-lg shadow-lg whitespace-nowrap z-10">
                                            {new Date(stat.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}: {stat.count} task{stat.count !== 1 ? "s" : ""}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Task table */}
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Task Assignment History</h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All tasks assigned to {developer.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">
                                <span className="font-semibold text-emerald-600">{doneTasks.length}</span> / {tasks.length} done
                            </span>
                        </div>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                                <ListTodo className="h-5 w-5 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">No tasks assigned yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {tasks.map(task => {
                                const sc = taskStatusConfig[task.status] || taskStatusConfig.todo;
                                return (
                                    <div key={task.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <span className={`h-2 w-2 rounded-full shrink-0 ${sc.dot}`} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{task.title}</p>
                                            {task.description && (
                                                <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{task.description}</p>
                                            )}
                                        </div>
                                        <span className={`shrink-0 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
                                            {sc.label}
                                        </span>
                                        {task.createdAt && (
                                            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(task.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
