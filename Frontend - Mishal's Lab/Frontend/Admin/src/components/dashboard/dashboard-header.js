import React, { useCallback } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function DashboardHeader() {
    const navigate = useNavigate();

    const handleNewProject = useCallback(() => {
        navigate("/projects/new");
    }, [navigate]);

    const handleGenkitAI = useCallback(() => {
        alert(" Genkit AI Assistant\n\nThis feature will help you:\n Suggest project structures\n Generate task summaries\n Optimize sprint planning\n\nComing soon!");
    }, []);

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Live workspace  TaskZenith
                </div>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl text-foreground">
                    Project overview
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Track progress across projects, tasks, and development teams in one
                    place.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleGenkitAI}>
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Genkit AI assistant
                </Button>
                <Button size="sm" onClick={handleNewProject}>New project</Button>
            </div>
        </div>
    );
}
