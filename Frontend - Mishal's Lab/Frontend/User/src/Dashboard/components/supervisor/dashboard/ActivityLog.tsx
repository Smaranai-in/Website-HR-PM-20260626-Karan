import { Button } from "../../ui/button";
import { ChevronDown } from "lucide-react";

const activities = [
  { action: "Reviewed daily report submitted by", user: "John Doe", date: "4 November 2025", time: "05:30 PM", id: "304WEB" },
  { action: "Assigned new task \"UI Components for Dashboard\" to", user: "Ayesha Khan", date: "4 November 2025", time: "05:30 PM", id: "304WEB" },
  { action: "Added performance feedback for", user: "John Doe", date: "4 November 2025", time: "05:30 PM", id: "304WEB" },
  { action: "Checked overdue tasks list (2 pending items)", user: "", date: "4 November 2025", time: "05:30 PM", id: "304WEB" },
  { action: "Approved task deadline extension requested by", user: "Ayesha Khan", date: "4 November 2025", time: "05:30 PM", id: "304WEB" },
  { action: "Viewed attendance timeline of", user: "John Doe", date: "4 November 2025", time: "05:30 PM", id: "304WEB" },
];

export function ActivityLog() {
  return (
    <div className="bg-card rounded-xl p-6 card-shadow">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity Log</h3>
        <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-smaran-blue/10 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 text-smaran-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">
                {activity.action} {activity.user && <span className="font-semibold">{activity.user}</span>}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <span>{activity.date}</span>
                <span>{activity.time}</span>
                <span>ID: {activity.id}</span>
              </div>
            </div>
            <Button size="sm" className="gradient-primary text-primary-foreground shrink-0">
              View
            </Button>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="w-full mt-4 gap-1">
        See All <ChevronDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
