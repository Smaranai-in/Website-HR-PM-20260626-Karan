import { useState } from "react";
import { Download, CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any | null;
  assignedIntern?: string;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskDetailsDialog({
  open,
  onOpenChange,
  task = "API Integration for Dashboard",
  assignedIntern = "John Doe",
}: TaskDetailsDialogProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([
    { id: "1", title: "Design API endpoints", completed: true },
    { id: "2", title: "Implement authentication", completed: true },
    { id: "3", title: "Test API endpoints", completed: false },
    { id: "4", title: "Write documentation", completed: false },
  ]);

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const completedSubtasks = subtasks.filter((st) => st.completed).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task?.name}</DialogTitle>
          <DialogDescription>
            View complete task details and progress information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
          {/* Task Header Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Assigned To</p>
              <p className="font-medium text-foreground mt-1">{assignedIntern}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Priority</p>
              <Badge className="mt-1">High</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant="secondary" className="mt-1">
                In Progress
              </Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="font-medium text-foreground mt-1">2024-01-20</p>
            </div>
          </div>

          {/* Task Description */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">
              Integrate the dashboard API with authentication, data fetching, and real-time
              updates. This task includes designing endpoints, implementing auth mechanisms,
              and comprehensive testing to ensure reliability and security.
            </p>
          </div>

          {/* Subtasks */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">
              Subtasks ({completedSubtasks}/{subtasks.length})
            </h3>
            <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
              {subtasks.map((subtask) => (
                <label
                  key={subtask.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(subtask.id)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span
                    className={`text-sm ${subtask.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                      }`}
                  >
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Intern's Note */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Intern's Notes</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
              <p>
                Currently working on the API endpoint design. Will start with authentication module
                first. Need clarification on the exact response format expected for user data.
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Attachments</h3>
            <div className="space-y-2">
              {[
                "API-specification.pdf",
                "task-progress-screenshot.png",
                "Implementation-plan.docx",
              ].map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded border border-border"
                >
                  <span className="text-sm text-foreground">{file}</span>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Overall Progress</h3>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((completedSubtasks / subtasks.length) * 100)}% Complete
            </p>
          </div>

          {/* Action Section */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-3">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                Approve
              </Button>
              <Button variant="outline" size="sm">
                Needs Improvement
              </Button>
              <Button variant="outline" size="sm">
                Request Progress
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                Reject
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="gradient-primary text-primary-foreground border-0">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
