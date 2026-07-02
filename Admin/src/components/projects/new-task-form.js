import React, { useState } from "react";
import { Plus, User, Calendar } from "lucide-react";
import { Button } from "../ui/button";

export function NewTaskForm({ developers, onCreate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [assigneeId, setAssigneeId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [deadline, setDeadline] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;

        onCreate({
            title: title.trim(),
            description: "",
            status: "todo",
            assigneeId: assigneeId || undefined,
            createdAt: new Date().toISOString(),
            startDate: startDate ? new Date(startDate).toISOString() : undefined,
            deadline: deadline ? new Date(deadline).toISOString() : undefined,
        });

        setTitle("");
        setAssigneeId("");
        setStartDate("");
        setDeadline("");
        setIsOpen(false);
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-3 text-sm text-slate-400 dark:text-slate-500 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200 group bg-white dark:bg-slate-900/60"
            >
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                Add new task
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 shadow-sm space-y-3"
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Task
                </span>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    Cancel
                </button>
            </div>

            {/* Title */}
            <input
                autoFocus
                className="w-full rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                placeholder="What needs to be done?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Assignee */}
                <div className="relative sm:col-span-1">
                    <User className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <select
                        className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-7 pr-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        value={assigneeId}
                        onChange={e => setAssigneeId(e.target.value)}
                    >
                        <option value="">Unassigned</option>
                        {developers.map(dev => (
                            <option key={dev.id} value={dev.id}>{dev.name}</option>
                        ))}
                    </select>
                </div>

                {/* Start date */}
                <div className="relative">
                    <Calendar className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                        type="date"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-7 pr-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        title="Start date"
                    />
                </div>

                {/* Deadline */}
                <div className="relative">
                    <Calendar className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-rose-400" />
                    <input
                        type="date"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-7 pr-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        title="Deadline"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-xs"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-sm"
                    disabled={!title.trim()}
                >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Task
                </Button>
            </div>
        </form>
    );
}
