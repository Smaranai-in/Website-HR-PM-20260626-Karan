import { Button } from "../ui/button";

const meetings = [
  { title: "Daily Standup", date: "4 November 2025", time: "05:30 PM - 06:30 PM" },
  { title: "Daily Standup", date: "4 November 2025", time: "05:30 PM - 06:30 PM" },
];

const ScheduledMeeting = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-3">Scheduled Meeting</h3>
      
      <div className="space-y-3">
        {meetings.map((meeting, index) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{meeting.title}</p>
              <p className="text-xs text-muted-foreground">{meeting.date} {meeting.time}</p>
            </div>
            <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground">
              Attend
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduledMeeting;
