import React, { useMemo, useState } from "react";
import { ArrowLeft, Sparkles, Save, TrendingUp, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { TaskList } from "./task-list";
import { TeamPanel } from "./team-panel";
import { NewTaskForm } from "./new-task-form";
import { updateProjectTasks } from "../../lib/actions";

const statusConfig = {
    on_track: { label: "On Track", bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
    at_risk: { label: "At Risk", bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
    off_track: { label: "Off Track", bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400", dot: "bg-rose-500" },
};

export function ProjectClient({ project, allDevelopers }) {
    const [tasks, setTasks] = useState(project.tasks || []);
    const [team, setTeam] = useState(project.team || []);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const completion = useMemo(() => {
        if (!tasks.length) return 0;
        const done = tasks.filter(t => t.status === "done").length;
        return Math.round((done / tasks.length) * 100);
    }, [tasks]);

    const todoCount = tasks.filter(t => t.status === "todo").length;
    const inProgressCount = tasks.filter(t => t.status === "in_progress").length;
    const doneCount = tasks.filter(t => t.status === "done").length;

    function handleStatusChange(taskId, status) {
        setIsDirty(true);
        setTasks(prev => prev.map(t => {
            if (t.id !== taskId) return t;
            const updates = { status };
            const now = new Date().toISOString();
            if (status === "done" && !t.completedAt) updates.completedAt = now;
            else if (status === "in_progress" && !t.startDate) updates.startDate = now;
            return { ...t, ...updates };
        }));
    }

    function handleCreate(task) {
        setIsDirty(true);
        const newId = crypto.randomUUID ? crypto.randomUUID() : `10000000-1000-4000-8000-${Date.now().toString(16).padStart(12, "0")}`;
        setTasks(prev => [...prev, { ...task, id: newId }]);
    }

    async function handleSave() {
        setIsSaving(true);
        try {
            const result = await updateProjectTasks(project.id, tasks);
            if (result.success) {
                setIsDirty(false);
            } else {
                alert(`Failed to save: ${result.error}`);
            }
        } catch (err) {
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    }

    const projectDevelopers = useMemo(() => {
        const all = allDevelopers || [];
        if (team.length === 0) return all;
        const filtered = all.filter(d => team.some(t => t.id === d.id));
        return filtered.length > 0 ? filtered : all;
    }, [allDevelopers, team]);

    const cfg = statusConfig[project.status] || statusConfig.on_track;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-10 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Top nav bar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/projects"
                            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Projects</span>
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">/</span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">
                            {project.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            >
                                <Save className="h-3.5 w-3.5" />
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        )}
                        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-500 hover:text-slate-700">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            AI Sprint Plan
                        </Button>
                    </div>
                </div>

                {/* Project header card */}
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
                    <div className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            {/* Left: title + description */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                                        {cfg.label}
                                    </span>
                                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                        ID: {project.id}
                                    </span>
                                </div>
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">
                                    {project.name}
                                </h1>
                                {project.description && (
                                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                                        {project.description}
                                    </p>
                                )}
                                {/* Dates */}
                                <div className="flex items-center gap-5 mt-3">
                                    {project.startDate && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>Start: <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(project.startDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span></span>
                                        </div>
                                    )}
                                    {project.deadline && (
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <Calendar className="h-3.5 w-3.5 text-rose-400" />
                                            <span>Due: <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(project.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: completion ring + task stats */}
                            <div className="flex items-center gap-6">
                                {/* Mini task counters */}
                                <div className="hidden sm:flex flex-col gap-1 text-right">
                                    <div className="text-xs text-slate-400 dark:text-slate-500">Backlog: <span className="font-bold text-slate-600 dark:text-slate-300">{todoCount}</span></div>
                                    <div className="text-xs text-slate-400 dark:text-slate-500">In Progress: <span className="font-bold text-blue-600 dark:text-blue-400">{inProgressCount}</span></div>
                                    <div className="text-xs text-slate-400 dark:text-slate-500">Done: <span className="font-bold text-emerald-600 dark:text-emerald-400">{doneCount}</span></div>
                                </div>

                                {/* Circular progress */}
                                <div className="relative flex h-20 w-20 items-center justify-center">
                                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="3" />
                                        <circle
                                            cx="18" cy="18" r="15.9" fill="none"
                                            stroke="url(#progressGrad)"
                                            strokeWidth="3"
                                            strokeDasharray={`${completion} ${100 - completion}`}
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#8b5cf6" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="flex flex-col items-center">
                                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{completion}%</span>
                                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">Done</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
                    <div className="space-y-4">
                        {/* New task form */}
                        <NewTaskForm developers={projectDevelopers} onCreate={handleCreate} />
                        {/* Kanban task board */}
                        <TaskList
                            tasks={tasks}
                            developers={projectDevelopers}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                    {/* Team sidebar */}
                    <div>
                        <TeamPanel team={team} onTeamUpdate={setTeam} projectId={project.id} allDevelopers={allDevelopers} />
                    </div>
                </div>
            </div>
        </div>
    );
}
