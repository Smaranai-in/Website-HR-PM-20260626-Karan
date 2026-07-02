import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Users, BarChart2, Loader2 } from "lucide-react";
import { ProjectCard } from "../../components/dashboard/project-card";
import { SummaryCards } from "../../components/dashboard/summary-cards";
import { AnalyticsCharts } from "../../components/dashboard/analytics-charts";
import {
    fetchAllProjectData,
    getSummaryStats,
    getTaskCountsByDay,
    getCompletedTasksByDay,
    getDevelopersProgress,
    getDevelopers,
    getTasksByDeveloper,
    getProjects,
} from "../../lib/data";

export default function DashboardPage() {
    const [data, setData] = useState({
        projects: [],
        stats: { totalProjects: 0, activeTasks: 0, completedTasks: 0 },
        createdCounts: [],
        completedCounts: [],
        devProgress: [],
        developers: [],
        tasksByDev: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const rawData = await fetchAllProjectData();
                const projects = getProjects(rawData);
                const developers = getDevelopers(rawData);
                const stats = getSummaryStats(projects);
                const createdCounts = getTaskCountsByDay(projects, 14);
                const completedCounts = getCompletedTasksByDay(projects, 14);
                const devProgress = getDevelopersProgress(projects, developers);
                const tasksByDev = getTasksByDeveloper(projects, developers);
                setData({ projects, stats, createdCounts, completedCounts, devProgress, developers, tasksByDev });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-sm font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const { projects, stats, createdCounts, completedCounts, devProgress } = data;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-12 px-4 sm:px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Project Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Track progress, manage tasks, and monitor your team.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
                        <Link
                            to="/projects/developers"
                            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 shadow-sm transition-all duration-150"
                        >
                            <Users className="h-4 w-4 text-indigo-500" />
                            Team
                        </Link>
                        <Link
                            to="/projects/new"
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150"
                        >
                            <Plus className="h-4 w-4" />
                            New Project
                        </Link>
                    </div>
                </div>

                {/* Summary stats */}
                <SummaryCards stats={stats} />

                {/* Analytics */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart2 className="h-4 w-4 text-indigo-500" />
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Analytics
                        </h2>
                    </div>
                    <AnalyticsCharts created={createdCounts} completed={completedCounts} developers={devProgress} />
                </section>

                {/* Projects grid */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                Active Projects
                            </h2>
                            <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                {projects.length}
                            </span>
                        </div>
                    </div>

                    {projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-16 gap-4 bg-white dark:bg-slate-900/60">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30">
                                <Plus className="h-7 w-7 text-indigo-400" />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">No projects yet</p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Create your first project to get started</p>
                            </div>
                            <Link
                                to="/projects/new"
                                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all"
                            >
                                <Plus className="h-4 w-4" />
                                Create Project
                            </Link>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
