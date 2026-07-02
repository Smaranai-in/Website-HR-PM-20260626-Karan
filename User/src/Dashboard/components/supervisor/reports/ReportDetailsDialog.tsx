import { CheckCircle2 } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ReportDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reportDate?: string;
  internName?: string;
}

export function ReportDetailsDialog({
  isOpen,
  onOpenChange,
  reportDate = "2024-01-15",
  internName = "John Doe",
}: ReportDetailsDialogProps) {
  const taskData = [
    { name: "Task 1: API Integration", completed: true },
    { name: "Task 2: UI Component Fix", completed: true },
    { name: "Task 3: Database Optimization", completed: false },
    { name: "Task 4: Testing & QA", completed: false },
    { name: "Task 5: Documentation", completed: true },
  ];

  const timeAllocationData = [
    { name: "Development", value: 6, fill: "#8b5cf6" },
    { name: "Meetings", value: 1.5, fill: "#3b82f6" },
    { name: "Research", value: 0.5, fill: "#10b981" },
  ];

  const completedTasks = taskData.filter((t) => t.completed).length;
  const totalHours = 8;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{internName}'s Daily Report - {reportDate}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-700">
                {completedTasks}/{taskData.length}
              </p>
              <p className="text-xs text-green-600 mt-1">Tasks Completed</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{totalHours}h</p>
              <p className="text-xs text-blue-600 mt-1">Total Hours</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-700">
                {Math.round((completedTasks / taskData.length) * 100)}%
              </p>
              <p className="text-xs text-purple-600 mt-1">Completion Rate</p>
            </div>
          </div>

          {/* Tasks Checklist */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Daily Tasks</h3>
            <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
              {taskData.map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      task.completed
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      task.completed
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }`}
                  >
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Allocation Chart */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Time Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}h`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {timeAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}h`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Blockers */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Blockers & Challenges</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              <p>
                Waiting for API documentation from the backend team. This might impact
                the completion of Task 4.
              </p>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Attachments</h3>
            <div className="space-y-2">
              {["daily-report.pdf", "progress-screenshot.png"].map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted rounded border border-border"
                >
                  <span className="text-sm text-foreground">{file}</span>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Supervisor Feedback</h3>
            <textarea
              placeholder="Add feedback or notes..."
              className="w-full p-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-smaran-purple focus:ring-offset-background focus:border-transparent resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="gradient-primary text-primary-foreground border-0">
            Save Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
