import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

const tasks = [
  { title: "Create login page for Project 2", priority: "High", deadline: "2 Nov, 2025", progress: 80 },
  { title: "Fix responsive layout in Dashboard", priority: "Medium", deadline: "3 Nov, 2025", progress: 50 },
  { title: "Update component documentation", priority: "Low", deadline: "1 Nov, 2025", progress: 20 },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-destructive text-destructive-foreground";
    case "Medium": return "bg-warning text-warning-foreground";
    case "Low": return "bg-primary text-primary-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const TodaysPriorityTask = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Today's Priority Task</h3>
          <p className="text-sm text-muted-foreground">Focus on high priority task to stay on track</p>
        </div>
        <Button variant="outline" size="sm">View All Task</Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Task Title</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Priority</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Deadline</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Progress</th>
              <th className="text-left py-3 text-sm font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="py-4 text-sm text-foreground">{task.title}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 text-sm text-muted-foreground">{task.deadline}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">{task.progress}%</span>
                  </div>
                </td>
                <td className="py-4">
                  <Button variant="outline" size="sm">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodaysPriorityTask;
