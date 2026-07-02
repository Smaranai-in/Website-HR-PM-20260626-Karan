import React from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

interface Task {
  id: number;
  title: string;
  status: "verified" | "pending" | "action";
  actionLabel?: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function TaskList({ tasks, onTaskClick }: TaskListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Onboarding Tasks</h3>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-colors cursor-pointer"
            onClick={() => onTaskClick(task)}
          >
            <div className="flex items-center gap-3">
              {task.status === "verified" ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <Circle className="text-gray-300 w-5 h-5" />
              )}
              <span className={cn("text-sm", task.status === "verified" && "text-gray-400 line-through")}>
                {task.title}
              </span>
            </div>
            {task.actionLabel && (
              <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                {task.actionLabel}
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
