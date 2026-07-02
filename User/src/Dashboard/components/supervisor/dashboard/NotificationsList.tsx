import { Button } from "../../ui/button";
import { AlertTriangle, FileText, MessageCircle, File } from "lucide-react";

const notifications = [
  { icon: AlertTriangle, title: "Task Over Due Alerts", date: "4 November 2025", time: "05:30 PM", id: "304WEB", type: "warning" },
  { icon: FileText, title: "Report Submitted by John Doe", date: "4 November 2025", time: "05:30 PM", id: "304WEB", type: "info" },
  { icon: MessageCircle, title: "Message from Ravi Kumar (AI Intern)", date: "4 November 2025", time: "05:30 PM", id: "304WEB", type: "message", badge: "(1)" },
  { icon: File, title: "Documentation by Ravi Kumar (AI Intern)", date: "4 November 2025", time: "05:30 PM", id: "304WEB", type: "info" },
  { icon: MessageCircle, title: "Message from Priya Verma (Web Intern)", date: "4 November 2025", time: "05:30 PM", id: "304WEB", type: "message", badge: "(1)" },
  { icon: FileText, title: "Leave requested by Ravi Kumar (AI Intern)", date: "4 November 2025", time: "05:30 PM", id: "304WEB", type: "info" },
];

const iconColors = {
  warning: "bg-status-warning/10 text-status-warning",
  info: "bg-smaran-blue/10 text-smaran-blue",
  message: "bg-smaran-purple/10 text-smaran-purple",
};

export function NotificationsList() {
  return (
    <div className="bg-card rounded-xl p-5 card-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {notifications.map((notif, index) => (
          <div key={index} className="flex items-center gap-3 p-2.5 hover:bg-muted/50 rounded-lg transition-colors">
            <div className={`h-8 w-8 rounded-lg ${iconColors[notif.type as keyof typeof iconColors]} flex items-center justify-center shrink-0`}>
              <notif.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {notif.title} {notif.badge && <span className="text-status-error">{notif.badge}</span>}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{notif.date}</span>
                <span>{notif.time}</span>
                <span>ID: {notif.id}</span>
              </div>
            </div>
            <Button size="sm" className="gradient-primary text-primary-foreground shrink-0 text-xs px-3">
              View
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
