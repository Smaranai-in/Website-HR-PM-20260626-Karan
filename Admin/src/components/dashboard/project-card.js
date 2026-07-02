import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Users, ListChecks, Calendar, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

const statusConfig = {
    on_track: {
        label: "On Track",
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
        bar: "bg-emerald-500"
    },
    at_risk: {
        label: "At Risk",
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
        bar: "bg-amber-500"
    },
    off_track: {
        label: "Off Track",
        bg: "bg-rose-100 dark:bg-rose-900/30",
        text: "text-rose-700 dark:text-rose-400",
        dot: "bg-rose-500",
        bar: "bg-rose-500"
    }
};

const cardGradients = [
    "from-blue-500 via-indigo-500 to-violet-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-orange-500 via-rose-500 to-pink-500",
    "from-violet-500 via-purple-500 to-fuchsia-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-rose-500 via-pink-500 to-fuchsia-500",
];

function getGradient(id) {
    if (!id) return cardGradients[0];
    const sum = String(id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return cardGradients[sum % cardGradients.length];
}

function getInitials(name) {
    return (name || "?")
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

export function ProjectCard({ project }) {
    const tasks = project.tasks || [];
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : (project.progress ?? 0);
    const cfg = statusConfig[project.status] || statusConfig.on_track;
    const gradient = getGradient(project.id);
    const deadline = project.deadline ? new Date(project.deadline) : null;
    const isOverdue = deadline && deadline < new Date() && project.status !== "completed";

    return (
        <Link to={`/projects/${project.id}`} className="block group">
            <div className={cn(
                "relative h-full overflow-hidden rounded-2xl border transition-all duration-300",
                "bg-white dark:bg-slate-900/80",
                "border-slate-200/60 dark:border-slate-700/60",
                "hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600",
                "shadow-sm"
            )}>
                {/* Top gradient bar */}
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradient}`} />

                <div className="p-5">
                    {/* Header: title + status badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[15px] text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                {project.name}
                            </h3>
                            {project.description && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {project.description}
                                </p>
                            )}
                        </div>
                        <span className={cn(
                            "flex items-center gap-1 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                            cfg.bg, cfg.text
                        )}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                            {cfg.label}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Progress
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                                className={cn("h-full rounded-full transition-all duration-500", cfg.bar)}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <ListChecks className="h-3.5 w-3.5 text-blue-500" />
                            <span className="font-medium text-slate-600 dark:text-slate-300">{completedTasks}</span>
                            <span>/ {tasks.length} tasks</span>
                        </div>

                        {/* Developer avatar stack */}
                        <div className="flex items-center">
                            {(project.team || []).slice(0, 4).map((member, i) => (
                                <div
                                    key={member.id || i}
                                    title={member.name}
                                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-br from-indigo-400 to-violet-500 text-[9px] font-bold text-white shadow-sm"
                                    style={{ marginLeft: i === 0 ? 0 : "-6px", zIndex: 4 - i }}
                                >
                                    {getInitials(member.name)}
                                </div>
                            ))}
                            {(project.team || []).length > 4 && (
                                <div
                                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 text-[9px] font-semibold text-slate-600 dark:text-slate-300"
                                    style={{ marginLeft: "-6px" }}
                                >
                                    +{(project.team || []).length - 4}
                                </div>
                            )}
                            {(project.team || []).length === 0 && (
                                <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>No devs</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer: deadline + link */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                        {deadline ? (
                            <div className={cn(
                                "flex items-center gap-1 text-[11px]",
                                isOverdue ? "text-rose-500" : "text-slate-400 dark:text-slate-500"
                            )}>
                                <Calendar className="h-3 w-3" />
                                {isOverdue ? "Overdue · " : "Due · "}
                                {deadline.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {(project.tags || []).slice(0, 2).map(tag => (
                                    <span key={tag} className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <span className="flex items-center text-[11px] font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-1 transition-all">
                            View
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
