import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Users, ListChecks } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";

const statusConfig = {
    on_track: { label: "On track", variant: "success" },
    at_risk: { label: "At risk", variant: "warning" },
    off_track: { label: "Off track", variant: "danger" }
};

export function ProjectCard({ project }) {
    // FIXED: Handle missing tasks safely to prevent "filter of undefined" error
    // project.tasks might be undefined if not joined in query
    const tasks = project.tasks || [];
    const completedTasks = tasks.filter((t) => t.status === "done").length;

    return (
        <Link to={`/projects/${project.id}`} className="block group">
            <Card className="relative h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-70" />
                <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5">
                            <CardTitle className="text-sm font-semibold group-hover:text-blue-700">
                                {project.name}
                            </CardTitle>
                            <CardDescription>{project.description}</CardDescription>
                        </div>
                        {/* FIXED: Handle unknown/invalid status values safely */}
                        <Badge variant={statusConfig[project.status]?.variant || "default"}>
                            {statusConfig[project.status]?.label || "Unknown"}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium text-foreground">
                            {project.progress.toFixed(0)}%
                        </span>
                    </div>
                    <Progress value={project.progress} />

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <ListChecks className="h-3.5 w-3.5 text-blue-500" />
                            <span>
                                {completedTasks}/{tasks.length} tasks done
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-indigo-500" />
                            <span>{project.team?.length || 0} devs</span>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                        {/* FIXED: Handle missing tags safely */}
                        {(project.tags || []).map((tag) => (
                            <span
                                key={tag}
                                className={cn(
                                    "rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                                )}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-end text-xs font-medium text-blue-600">
                        View details
                        <ChevronRight className="ml-0.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
