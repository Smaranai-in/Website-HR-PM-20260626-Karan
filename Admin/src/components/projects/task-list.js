import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";

const statusLabel = {
    todo: "To do",
    in_progress: "In progress",
    done: "Done"
};

export function TaskList({ tasks, developers, onStatusChange }) {
    const tasksByStatus = useMemo(
        () => ({
            todo: tasks.filter((t) => t.status === "todo"),
            in_progress: tasks.filter((t) => t.status === "in_progress"),
            done: tasks.filter((t) => t.status === "done")
        }),
        [tasks]
    );

    const columns = [
        { key: "todo", title: "Backlog" },
        { key: "in_progress", title: "In progress" },
        { key: "done", title: "Completed" }
    ];

    const getDeveloper = (id) =>
        developers.find((d) => d.id === id);

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {columns.map((col) => (
                <div
                    key={col.key}
                    className="flex flex-col rounded-lg border border-dashed border-border bg-background/60"
                >
                    <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            {col.title}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                            {tasksByStatus[col.key].length} task
                            {tasksByStatus[col.key].length === 1 ? "" : "s"}
                        </span>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-3">
                        {tasksByStatus[col.key].map((task) => {
                            const dev = getDeveloper(task.assigneeId);
                            return (
                                <div
                                    key={task.id}
                                    className="rounded-md border border-border bg-card/80 p-3 text-xs shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="font-medium text-[13px]">
                                                {task.title}
                                            </div>
                                            {task.description && (
                                                <p className="mt-1 text-[11px] text-muted-foreground">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                        <Badge variant="outline" className="px-1.5 py-0">
                                            {statusLabel[task.status]}
                                        </Badge>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                <div
                                                    className={cn(
                                                        "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                                                        dev?.avatarColor ?? "bg-slate-500"
                                                    )}
                                                >
                                                    {dev
                                                        ? dev.name
                                                            .split(" ")
                                                            .map((p) => p[0])
                                                            .join("")
                                                        : "?"}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{dev ? dev.name : "Unassigned"}</div>
                                                    <div className="text-[10px] text-muted-foreground">{dev?.employeeId ?? "—"}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-[11px] text-muted-foreground">
                                                <div>Start: {task.startDate ? new Date(task.startDate).toLocaleDateString() : '—'}</div>
                                                <div>Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</div>
                                            </div>

                                            <StatusSelect
                                                current={task.status}
                                                onChange={(status) => onStatusChange(task.id, status)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {tasksByStatus[col.key].length === 0 && (
                            <p className="py-6 text-center text-[11px] text-muted-foreground">
                                No tasks in this column yet.
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function StatusSelect({ current, onChange }) {
    return (
        <div className="relative">
            <select
                className="flex h-7 items-center rounded-md border border-input bg-background px-2 pr-6 text-[11px] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={current}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 text-muted-foreground" />
        </div>
    );
}
