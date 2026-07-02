import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FileText, CheckCircle, Award, Calendar, ChevronDown } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "offer" | "approval" | "certificate" | "leave";
  title: string;
  name: string;
  date: string;
  time: string;
  refId: string;
}

const activities: ActivityItem[] = [
  { id: "1", type: "offer", title: "Offer Letter sent to", name: "Priya Verma (Web Intern)", date: "4 November 2025", time: "05:30 PM", refId: "304WEB" },
  { id: "2", type: "offer", title: "Offer Letter sent to", name: "Shantanu Sharma (Design Intern)", date: "3 November 2025", time: "12:30 PM", refId: "304DES" },
  { id: "3", type: "offer", title: "Offer Letter sent to", name: "Tejas Joshi (Web Intern)", date: "3 November 2025", time: "8:30 PM", refId: "350WEB" },
];

const approvals: ActivityItem[] = [
  { id: "1", type: "approval", title: "Timesheet Approved by", name: "Priya Verma (Manager)", date: "4 November 2025", time: "05:30 PM", refId: "304WEB" },
  { id: "2", type: "approval", title: "Timesheet Approved by", name: "Shantanu Sharma (Manager)", date: "3 November 2025", time: "12:30 PM", refId: "304WEB" },
  { id: "3", type: "approval", title: "Timesheet Approved by", name: "Tejas Joshi (Manager)", date: "3 November 2025", time: "8:30 PM", refId: "304WEB" },
];

const certificates: ActivityItem[] = [
  { id: "1", type: "certificate", title: "Certificate generated for", name: "Priya Verma (Intern)", date: "4 November 2025", time: "05:30 PM", refId: "304WEB" },
  { id: "2", type: "certificate", title: "Certificate generated for", name: "Shantanu Sharma (Manager)", date: "3 November 2025", time: "12:30 PM", refId: "304WEB" },
  { id: "3", type: "certificate", title: "Certificate generated for", name: "Tejas Joshi (Intern)", date: "3 November 2025", time: "8:30 PM", refId: "304WEB" },
];

const leaves: ActivityItem[] = [
  { id: "1", type: "leave", title: "Leave Request from", name: "Priya Verma (Intern)", date: "4 November 2025", time: "05:30 PM", refId: "304WEB" },
  { id: "2", type: "leave", title: "Leave Request from", name: "Shantanu Sharma (Manager)", date: "3 November 2025", time: "12:30 PM", refId: "304WEB" },
  { id: "3", type: "leave", title: "Leave Request Approved for", name: "Tejas Joshi (Intern)", date: "3 November 2025", time: "8:30 PM", refId: "304WEB" },
];

const getIcon = (type: string) => {
  switch (type) {
    case "offer": return FileText;
    case "approval": return CheckCircle;
    case "certificate": return Award;
    case "leave": return Calendar;
    default: return FileText;
  }
};

function ActivitySection({ title, items }: { title: string; items: ActivityItem[] }) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-foreground">{title}</h4>
      {items.map((item) => {
        const Icon = getIcon(item.type);
        return (
          <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stat-blue flex items-center justify-center">
              <Icon className="h-4 w-4 text-stat-icon-blue" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="text-muted-foreground">{item.title}</span>{" "}
                <span className="font-medium text-foreground">{item.name}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {item.date} &nbsp;&nbsp; {item.time} &nbsp;&nbsp; ID: {item.refId}
              </p>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs px-3 py-1 h-7">
              View
            </Button>
          </div>
        );
      })}
      <Button variant="ghost" size="sm" className="w-full text-muted-foreground text-xs">
        See All <ChevronDown className="h-3 w-3 ml-1" />
      </Button>
    </div>
  );
}

export function RecentActivity() {
  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[600px] overflow-y-auto scrollbar-thin">
        <ActivitySection title="Offers Sent" items={activities} />
        <ActivitySection title="Latest Approvals" items={approvals} />
        <ActivitySection title="Certificates Generated" items={certificates} />
        <ActivitySection title="Leave Requests" items={leaves} />
      </CardContent>
    </Card>
  );
}
