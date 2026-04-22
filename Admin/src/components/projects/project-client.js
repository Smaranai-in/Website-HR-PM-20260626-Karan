import React, { useMemo, useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { TaskList } from "./task-list";
import { TeamPanel } from "./team-panel";
import { NewTaskForm } from "./new-task-form";
import { updateProjectTasks } from "../../lib/actions";

export function ProjectClient({ project, allDevelopers }) {
    // FIXED: Handle undefined tasks initially
    const [tasks, setTasks] = useState(project.tasks || []);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const completion = useMemo(() => {
        if (!tasks.length) return 0;
        const done = tasks.filter((t) => t.status === "done").length;
        return (done / tasks.length) * 100;
    }, [tasks]);

    function handleStatusChange(taskId, status) {
        setIsDirty(true);
        setTasks((prev) =>
            prev.map((t) => {
                if (t.id !== taskId) return t;

                // logic for auto-updating dates
                const updates = { status };
                const now = new Date().toISOString();

                if (status === "done" && !t.completedAt) {
                    updates.completedAt = now;
                } else if (status === "in_progress" && !t.startDate) {
                    updates.startDate = now;
                }

                return { ...t, ...updates };
            })
        );
    }

    function handleCreate(task) {
        setIsDirty(true);
        // Use crypto.randomUUID() if available, or a simple fallback
        const newId = crypto.randomUUID ? crypto.randomUUID() : `10000000-1000-4000-8000-${Date.now().toString(16).padStart(12, '0')}`;

        setTasks((prev) => [
            ...prev,
            {
                ...task,
                id: newId
            }
        ]);
    }

    async function handleSave() {
        setIsSaving(true);

        try {
            const result = await updateProjectTasks(project.id, tasks);
            if (result.success) {
                setIsDirty(false);
                console.log("Saved successfully");
            } else {
                console.error("Failed to save:", result.error, result.details);
                alert(`Failed to save: ${result.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    }

    const projectDevelopers = useMemo(() => {
        const all = allDevelopers || [];
        const team = project.team || [];

        if (team.length === 0) return all;

        const filtered = all.filter((d) =>
            team.some((t) => t.id === d.id)
        );

        return filtered.length > 0 ? filtered : all;
    }, [allDevelopers, project.team]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-10 px-6 transition-colors duration-300 text-slate-800 dark:text-slate-200">
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="px-2 text-xs"
                        >
                            <Link to="/projects">
                                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                                Back to dashboard
                            </Link>
                        </Button>
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                            Project ID: {project.id}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-muted-foreground"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            Ask Genkit to plan sprint
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="text-xs font-medium uppercase tracking-wide text-blue-600">
                                    Project
                                </div>
                                <div className="mt-1 text-lg font-semibold">
                                    {project.name}
                                </div>
                            </div>
                            <div className="w-full max-w-xs space-y-1 text-xs">
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span>Completion</span>
                                    <span className="font-medium text-foreground">
                                        {completion.toFixed(0)}%
                                    </span>
                                </div>
                                <Progress value={completion} />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {project.description}
                        </p>
                        <div className="flex gap-6 mt-4 pt-4 border-t text-sm">
                            <div>
                                <span className="text-muted-foreground block text-xs mb-1">Start Date</span>
                                <span className="font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block text-xs mb-1">Deadline</span>
                                <span className="font-medium">{project.deadline ? new Date(project.deadline).toLocaleDateString() : "—"}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
                    <div className="space-y-3">
                        <NewTaskForm
                            developers={projectDevelopers}
                            onCreate={handleCreate}
                        />
                        <TaskList
                            tasks={tasks}
                            developers={projectDevelopers}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                    <div className="space-y-3">
                        <TeamPanel team={project.team} />
                    </div>
                </div>
            </div>
        </div>
    );
}
