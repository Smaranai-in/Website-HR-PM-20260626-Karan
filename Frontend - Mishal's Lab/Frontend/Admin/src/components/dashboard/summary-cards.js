import React from "react";
import { FolderKanban, ListChecks, CheckCircle2, TrendingUp } from "lucide-react";

export function SummaryCards({ stats }) {
    const items = [
        {
            label: "Total Projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            gradient: "from-blue-500 to-indigo-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            valueColor: "text-blue-700 dark:text-blue-300",
            subtext: "Active across the platform"
        },
        {
            label: "Active Tasks",
            value: stats.activeTasks,
            icon: ListChecks,
            gradient: "from-amber-500 to-orange-600",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            iconColor: "text-amber-600 dark:text-amber-400",
            valueColor: "text-amber-700 dark:text-amber-300",
            subtext: "Currently in progress"
        },
        {
            label: "Completed Tasks",
            value: stats.completedTasks,
            icon: CheckCircle2,
            gradient: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            valueColor: "text-emerald-700 dark:text-emerald-300",
            subtext: "Successfully delivered"
        },
    ];

    const total = stats.activeTasks + stats.completedTasks;
    const completionRate = total > 0 ? Math.round((stats.completedTasks / total) * 100) : 0;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <div
                    key={item.label}
                    className={`relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 ${item.bg} p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {item.label}
                        </p>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-sm`}>
                            <item.icon className="h-4 w-4 text-white" />
                        </div>
                    </div>
                    <p className={`text-3xl font-bold ${item.valueColor}`}>{item.value}</p>
                    <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{item.subtext}</p>
                    <div className={`absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br ${item.gradient} opacity-5`} />
                </div>
            ))}

            {/* Overall Completion Rate card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Completion Rate
                    </p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-sm">
                        <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                </div>
                <p className="text-3xl font-bold text-violet-700 dark:text-violet-300">{completionRate}%</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-violet-100 dark:bg-violet-900/40 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
                        style={{ width: `${completionRate}%` }}
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-5" />
            </div>
        </div>
    );
}
