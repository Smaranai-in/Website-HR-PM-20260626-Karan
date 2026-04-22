import React, { useEffect, useState } from "react";
import { DeveloperCard } from "../../components/developer-card";
import { getDevelopers, getDevelopersProgress } from "../../lib/data";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Users, ArrowLeft } from "lucide-react";

export default function DevelopersListPage() {
    const [developers, setDevelopers] = useState([]);
    const [progressMap, setProgressMap] = useState(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [devs, progressData] = await Promise.all([
                    getDevelopers(),
                    getDevelopersProgress()
                ]);
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

    if (loading) return <div className="p-8 text-center pt-40">Loading developers...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-10 px-6 transition-colors duration-300 text-slate-800 dark:text-slate-200">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                            <Users className="h-6 w-6" /> Team Members
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage and view analytics for all developers on the team.
                        </p>
                    </div>
                    <Link to="/projects">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {developers.map((dev) => (
                        <DeveloperCard
                            key={dev.id}
                            developer={dev}
                            progress={progressMap.get(dev.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
