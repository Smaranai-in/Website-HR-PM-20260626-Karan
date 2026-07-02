import { AlertTriangle, User, Bell, Calendar, Mail } from "lucide-react";
import { Button } from "../ui/button";

const notifications = [
  { 
    icon: AlertTriangle, 
    title: "Task Over Due Alerts", 
    time: "4 November 2025 05:30 PM", 
    id: "ID: 304WEB",
    iconColor: "text-destructive"
  },
  { 
    icon: User, 
    title: "Ravi Kumar assigned you a new task", 
    time: "4 November 2025 05:30 PM", 
    id: "ID: 304WEB",
    iconColor: "text-primary"
  },
  { 
    icon: Bell, 
    title: "Reminder: \"Fix responsive layout for Dashboard\"", 
    time: "4 November 2025 05:30 PM", 
    id: "ID: 304WEB",
    iconColor: "text-warning"
  },
  { 
    icon: Calendar, 
    title: "Your project review call is scheduled tomorrow.", 
    time: "4 November 2025 05:30 PM", 
    id: "ID: 304WEB",
    iconColor: "text-primary"
  },
  { 
    icon: Mail, 
    title: "HR sent an important update regarding mid-cycle.", 
    time: "4 November 2025 05:30 PM", 
    id: "ID: 304WEB",
    iconColor: "text-success"
  },
];

export function Notifications() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`p-2 rounded-full bg-muted ${notification.iconColor}`}>
              <notification.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground line-clamp-1">{notification.title}</p>
              <p className="text-xs text-muted-foreground">{notification.time} {notification.id}</p>
            </div>
            <Button size="sm" className="shrink-0">View</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
