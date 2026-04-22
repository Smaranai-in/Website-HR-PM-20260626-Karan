import React, { useState } from "react";
import { Button } from "../ui/button";

export function NewTaskForm({ developers, onCreate }) {
    const [title, setTitle] = useState("");
    const [assigneeId, setAssigneeId] = useState(undefined);
    const [startDate, setStartDate] = useState(undefined);
    const [deadline, setDeadline] = useState(undefined);

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;

        onCreate({
            title: title.trim(),
            description: "",
            status: "todo",
            assigneeId,
            createdAt: new Date().toISOString(),
            startDate: startDate ? new Date(startDate).toISOString() : undefined,
            deadline: deadline ? new Date(deadline).toISOString() : undefined
        });

        setTitle("");
        setStartDate(undefined);
        setDeadline(undefined);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-background/60 p-3 text-xs text-foreground"
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                    Quick add task
                </span>
            </div>
            <input
                className="h-7 rounded-md border border-input bg-background px-2 text-[11px] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="What needs to get done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="grid w-full grid-cols-3 gap-2">
                <select
                    className="col-span-2 h-7 w-full rounded-md border border-input bg-background px-2 text-[11px] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={assigneeId ?? ""}
                    onChange={(e) => setAssigneeId(e.target.value || undefined)}
                >
                    <option value="">Unassigned</option>
                    {developers.map((dev) => (
                        <option key={dev.id} value={dev.id}>
                            {dev.name}
                        </option>
                    ))}
                </select>

                <div className="col-span-1 flex items-center gap-2">
                    <input
                        type="date"
                        className="h-7 rounded-md border border-input bg-background px-2 text-[11px] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={startDate ?? ""}
                        onChange={(e) => setStartDate(e.target.value || undefined)}
                        title="Start date"
                    />
                </div>

                <div className="col-span-2 mt-1 flex items-center gap-2">
                    <input
                        type="date"
                        className="h-7 w-full rounded-md border border-input bg-background px-2 text-[11px] shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={deadline ?? ""}
                        onChange={(e) => setDeadline(e.target.value || undefined)}
                        title="Deadline"
                    />
                    <Button type="submit" size="sm" className="text-[11px]">
                        Add
                    </Button>
                </div>
            </div>
        </form>
    );
}
