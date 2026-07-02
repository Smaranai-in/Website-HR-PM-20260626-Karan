import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface Interview {
  id: string;
  time: string;
  name: string;
  role: string;
  isToday: boolean;
}

const interviews: Interview[] = [
  { id: "1", time: "11:00 AM", name: "John Doe", role: "Web Intern", isToday: true },
  { id: "2", time: "2:30 PM", name: "Priya Verma", role: "AI Intern", isToday: true },
  { id: "3", time: "Tomorrow | 11:00 AM", name: "Joey tro", role: "UI/UX Intern", isToday: false },
];

export function UpcomingInterviews() {
  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Upcoming Interviews</CardTitle>
        <p className="text-sm text-muted-foreground">(2 Interviews Scheduled Today)</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="flex items-center justify-between py-2"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {interview.time} | {interview.name} | {interview.role}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs h-7 px-3">
                Join Now
              </Button>
              <Button size="sm" variant="outline" className="border-warning text-warning hover:bg-warning/10 text-xs h-7 px-3">
                Reschedule
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
