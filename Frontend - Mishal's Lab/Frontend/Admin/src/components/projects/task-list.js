import React, { useMemo } from "react";
import { ChevronDown, User, Calendar, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

const columnConfig = {
    todo: {
        title: "Backlog",
        dot: "bg-slate-400",
        headerBg: "bg-slate-50 dark:bg-slate-800/60",
        border: "border-slate-200 dark:border-slate-700",
        cardBorder: "border-slate-200 dark:border-slate-700",
        emptyText: "No tasks in backlog"
    },
    in_progress: {
        title: "In Progress",
        dot: "bg-blue-500",
        headerBg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        cardBorder: "border-blue-100 dark:border-blue-900",
        emptyText: "Nothing in progress"
    },
    done: {
        title: "Completed",
        dot: "bg-emerald-500",
        headerBg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        cardBorder: "border-emerald-100 dark:border-emerald-900",
        emptyText: "No tasks completed yet"
    }
};

const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
];

const avatarGradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
];

function getGradient(id) {
    if (!id) return "from-slate-400 to-slate-500";
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

function formatDate(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function TaskList({ tasks, developers, onStatusChange }) {
    const tasksByStatus = useMemo(() => ({
        todo: tasks.filter(t => t.status === "todo"),
        in_progress: tasks.filter(t => t.status === "in_progress"),
        done: tasks.filter(t => t.status === "done"),
    }), [tasks]);

    const getDeveloper = (id) => developers.find(d => d.id === id);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(columnConfig).map(([key, col]) => {
                const colTasks = tasksByStatus[key];
                return (
                    <div
                        key={key}
                        className={cn(
                            "flex flex-col rounded-2xl border",
                            col.border,
                            "bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden"
                        )}
                    >
                        {/* Column header */}
                        <div className={cn("flex items-center justify-between px-4 py-3 border-b", col.border, col.headerBg)}>
                            <div className="flex items-center gap-2">
                                <span className={cn("h-2 w-2 rounded-full", col.dot)} />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    {col.title}
                                </span>
                            </div>
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                                {colTasks.length}
                            </span>
                        </div>

                        {/* Tasks */}
                        <div className="flex flex-1 flex-col gap-2 p-3 min-h-[120px]">
                            {colTasks.map(task => {
                                const dev = getDeveloper(task.assigneeId);
                                const devGradient = getGradient(dev?.id);
                                const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done";

                                return (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "rounded-xl border p-3 shadow-sm transition-all duration-150",
                                            "bg-white dark:bg-slate-900",
                                            col.cardBorder,
                                            "hover:shadow-md"
                                        )}
                                    >
                                        {/* Task title */}
                                        <p className="font-semibold text-[13px] text-slate-800 dark:text-slate-100 leading-snug">
                                            {task.title}
                                        </p>
                                        {task.description && (
                                            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                        {/* Developer & dates */}
                                        <div className="mt-2.5 flex items-center justify-between gap-2">
                                            {/* Assignee */}
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                {dev ? (
                                                    <>
                                                        <div className={cn(
                                                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[8px] font-bold text-white",
                                                            devGradient
                                                        )}>
                                                            {getInitials(dev.name)}
                                                        </div>
                                                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                                                            {dev.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                                                            <User className="h-3 w-3 text-slate-400" />
                                                        </div>
                                                        <span className="text-[11px] text-slate-400">Unassigned</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Deadline */}
                                            {task.deadline && (
                                                <div className={cn(
                                                    "flex items-center gap-0.5 text-[10px] font-medium shrink-0",
                                                    isOverdue ? "text-rose-500" : "text-slate-400 dark:text-slate-500"
                                                )}>
                                                    {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                                                    {formatDate(task.deadline)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Status selector */}
                                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <StatusSelect current={task.status} onChange={s => onStatusChange(task.id, s)} />
                                        </div>
                                    </div>
                                );
                            })}

                            {colTasks.length === 0 && (
                                <div className="flex flex-1 items-center justify-center py-8">
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                                        {col.emptyText}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function StatusSelect({ current, onChange }) {
    const cfg = {
        todo: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        in_progress: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        done: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    };

    return (
        <div className="relative">
            <select
                className={cn(
                    "w-full appearance-none rounded-lg border-0 pl-2 pr-6 py-1 text-[11px] font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400",
                    cfg[current] || cfg.todo
                )}
                value={current}
                onChange={e => onChange(e.target.value)}
            >
                {statusOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-current opacity-60" />
        </div>
    );
}
