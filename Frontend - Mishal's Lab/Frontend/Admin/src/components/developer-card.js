import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ListTodo, TrendingUp, Star } from "lucide-react";

const avatarGradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
];

function getAvatarGradient(id) {
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

function getPerformanceLabel(progress) {
    if (progress >= 80) return { label: "Top Performer", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" };
    if (progress >= 50) return { label: "On Track", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" };
    if (progress >= 20) return { label: "Needs Focus", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/30" };
    return { label: "Getting Started", color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" };
}

export function DeveloperCard({ developer, progress }) {
    const initials = getInitials(developer.name);
    const gradient = getAvatarGradient(developer.id);
    const perf = getPerformanceLabel(progress?.progress || 0);
    const progressVal = progress?.progress || 0;

    return (
        <div className="flex flex-col h-full rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Card header with avatar */}
            <div className="relative p-5 pb-4">
                {/* Background blob */}
                <div className={`absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-[0.08]`} />

                <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-lg font-bold text-white shadow-md`}>
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-[15px] text-slate-800 dark:text-slate-100 truncate">
                            {developer.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {developer.role || "Developer"}
                        </p>
                        {developer.employeeId && developer.employeeId !== "—" && (
                            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                                ID: {developer.employeeId}
                            </p>
                        )}
                    </div>
                </div>

                {/* Performance badge */}
                <span className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${perf.bg} ${perf.color}`}>
                    <Star className="h-3 w-3" />
                    {perf.label}
                </span>
            </div>

            {/* Stats section */}
            {progress ? (
                <div className="flex-1 px-5 pb-4 space-y-4">
                    {/* Progress bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Completion
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{progressVal}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                                style={{ width: `${progressVal}%` }}
                            />
                        </div>
                    </div>

                    {/* Task stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                                <ListTodo className="h-3 w-3" /> Assigned
                            </div>
                            <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                                {progress.total}
                            </span>
                        </div>
                        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 border border-emerald-100 dark:border-emerald-800/40">
                            <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 mb-1">
                                <CheckCircle2 className="h-3 w-3" /> Done
                            </div>
                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {progress.completed}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 px-5 pb-4 flex items-center justify-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">No tasks assigned yet</p>
                </div>
            )}

            {/* Footer CTA */}
            <div className="px-5 pb-5">
                <Link
                    to={`/projects/developers/${developer.id}`}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${gradient} px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:opacity-90 transition-all duration-200`}
                >
                    View Profile
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
