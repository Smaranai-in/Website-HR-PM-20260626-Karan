import { User, Coffee, Play, LogOut } from "lucide-react";
import { Button } from "../ui/button";

const attendanceLog = [
  { time: "09:30 AM", action: "Check-in", icon: User },
  { time: "11:00 AM", action: "On Break", icon: Coffee },
  { time: "11:30 AM", action: "Resume Work", icon: Play },
  { time: "--:-- PM", action: "Check-out Pending", icon: LogOut },
];

const TodaysAttendance = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">Today's Attendance</h3>
          <p className="text-sm text-muted-foreground">Focus on high priority task to stay on track</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full" />
          <span className="text-sm text-success">Online</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">4 Nov, 2025</p>
      
      <div className="space-y-3">
        {attendanceLog.map((log, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground w-20">{log.time}</span>
            <div className={`w-2 h-2 rounded-full ${index === attendanceLog.length - 1 ? 'bg-muted' : 'bg-primary'}`} />
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
              <log.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{log.action}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2 mt-6">
        <Button variant="outline" className="flex-1 gap-2">
          <Coffee className="w-4 h-4" />
          Break
        </Button>
        <Button className="flex-1 gap-2">
          <LogOut className="w-4 h-4" />
          Check-Out
        </Button>
      </div>
    </div>
  );
};

export default TodaysAttendance;
