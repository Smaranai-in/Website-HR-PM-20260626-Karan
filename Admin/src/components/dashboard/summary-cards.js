import React from "react";
import { ClipboardList, FolderKanban, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function SummaryCards({ stats }) {
    const items = [
        {
            label: "Total projects",
            value: stats.totalProjects,
            icon: FolderKanban,
            accent: "bg-blue-50 text-blue-700"
        },
        {
            label: "Active tasks",
            value: stats.activeTasks,
            icon: ClipboardList,
            accent: "bg-amber-50 text-amber-700"
        },
        {
            label: "Completed tasks",
            value: stats.completedTasks,
            icon: CheckCircle2,
            accent: "bg-emerald-50 text-emerald-700"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {items.map((item) => (
                <Card key={item.label} className="border-dashed">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
                        <CardTitle className="text-xs font-medium text-muted-foreground">
                            {item.label}
                        </CardTitle>
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${item.accent}`}
                        >
                            <item.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold">{item.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
