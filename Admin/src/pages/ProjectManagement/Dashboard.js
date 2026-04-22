import React, { useEffect, useState } from "react";
import { DashboardHeader } from "../../components/dashboard/dashboard-header";
import { ProjectCard } from "../../components/dashboard/project-card";
import { SummaryCards } from "../../components/dashboard/summary-cards";
import { AnalyticsCharts } from "../../components/dashboard/analytics-charts";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { getProjects, getSummaryStats, getTaskCountsByDay, getCompletedTasksByDay, getDevelopersProgress, getDevelopers, getTasksByDeveloper } from "../../lib/data";

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
                const [projects, stats, createdCounts, completedCounts, devProgress, developers, tasksByDev] = await Promise.all([
                    getProjects(),
                    getSummaryStats(),
                    getTaskCountsByDay(14),
                    getCompletedTasksByDay(14),
                    getDevelopersProgress(),
                    getDevelopers(),
                    getTasksByDeveloper()
                ]);

                setData({
                    projects: projects || [],
                    stats: stats || {},
                    createdCounts: createdCounts || [],
                    completedCounts: completedCounts || [],
                    devProgress: devProgress || [],
                    developers: developers || [],
                    tasksByDev: tasksByDev || {}
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center pt-40">Loading dashboard...</div>;
    }

    const { projects, stats, createdCounts, completedCounts, devProgress } = data;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-10 px-6 transition-colors duration-300 text-slate-800 dark:text-slate-200">
            <div className="flex h-full flex-col gap-6">
                <div className="flex items-center justify-between">
                    <DashboardHeader />
                    <Link to="/projects/developers">
                        <Button>View Developers</Button>
                    </Link>
                </div>

                <SummaryCards stats={stats} />

                <section className="mt-6">
                    <h2 className="mb-4 text-sm font-medium">Project analytics</h2>
                    <AnalyticsCharts created={createdCounts} completed={completedCounts} developers={devProgress} />
                </section>

                <section className="mt-2 space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="font-medium text-foreground">
                                Active projects
                            </span>
                            <span className="text-muted-foreground">
                                {projects.length} total
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
