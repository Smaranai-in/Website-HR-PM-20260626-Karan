import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Progress } from "./ui/progress";
import { ArrowRight, CheckCircle2, ListTodo } from "lucide-react";

export function DeveloperCard({ developer, progress }) {
    // Get initials for avatar fallback
    const initials = developer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar
                    initials={initials}
                    colorClass={developer.avatarColor}
                    className="h-12 w-12 border-2 border-white shadow-sm"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold text-lg leading-none">{developer.name}</h3>
                    <span className="text-sm text-muted-foreground">{developer.role}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                {developer.employeeId && (
                    <div className="text-xs text-muted-foreground mb-4">
                        ID: {developer.employeeId}
                    </div>
                )}

                {progress && (
                    <div className="space-y-3 mt-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Task Completion</span>
                            <span className="font-medium">{progress.progress}%</span>
                        </div>
                        <Progress value={progress.progress} className="h-2" />

                        <div className="grid grid-cols-2 gap-2 mt-4">
                            <div className="flex flex-col bg-muted/30 p-2 rounded-md">
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <ListTodo className="h-3 w-3" /> Assigned
                                </span>
                                <span className="text-lg font-bold">{progress.total}</span>
                            </div>
                            <div className="flex flex-col bg-muted/30 p-2 rounded-md">
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <CheckCircle2 className="h-3 w-3" /> Done
                                </span>
                                <span className="text-lg font-bold text-emerald-600">{progress.completed}</span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-0">
                <Link
                    to={`/projects/developers/${developer.id}`}
                    className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    View Profile <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </CardFooter>
        </Card>
    );
}
