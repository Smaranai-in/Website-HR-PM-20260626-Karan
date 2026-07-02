import React, { useEffect, useState } from "react";
import { DeveloperCard } from "../../components/developer-card";
import { fetchAllProjectData, getDevelopers, getDevelopersProgress, getProjects } from "../../lib/data";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Loader2, Search } from "lucide-react";

export default function DevelopersListPage() {
    const [developers, setDevelopers] = useState([]);
    const [progressMap, setProgressMap] = useState(new Map());
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const rawData = await fetchAllProjectData();
                const devs = getDevelopers(rawData);
                const projects = getProjects(rawData);
                const progressData = getDevelopersProgress(projects, devs);
                setDevelopers(devs || []);
                setProgressMap(new Map((progressData || []).map(p => [p.developerId, p])));
            } catch (error) {
                console.error("Error fetching developers:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filtered = developers.filter(d =>
        !search || d.name?.toLowerCase().includes(search.toLowerCase()) || d.role?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-sm font-medium">Loading team...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-12 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/projects"
                            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Projects
                        </Link>
                        <span className="text-slate-300 dark:text-slate-600">/</span>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-500" />
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Team Members</h1>
                            <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2.5 py-0.5 text-[12px] font-bold text-indigo-600 dark:text-indigo-400">
                                {developers.length}
                            </span>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-4 text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm w-48 md:w-64"
                            placeholder="Search developers..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Sub-heading */}
                <div className="-mt-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage and view analytics for all developers on the team.
                    </p>
                </div>

                {/* Developers grid */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-16 gap-3 bg-white dark:bg-slate-900/60">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                            <Users className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">
                            {search ? "No developers match your search" : "No developers found"}
                        </p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            {search ? "Try a different search term" : "Add developers to the p_developers table in Supabase"}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map(dev => (
                            <DeveloperCard
                                key={dev.id}
                                developer={dev}
                                progress={progressMap.get(dev.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
