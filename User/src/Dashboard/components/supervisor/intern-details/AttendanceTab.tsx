import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

interface AttendanceRecord {
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: "present" | "late" | "absent" | "half-day";
  notes?: string;
  meetingLogs?: string[];
}

export function AttendanceTab() {
  const [expandedDates, setExpandedDates] = useState<string[]>([]);

  const attendanceData: AttendanceRecord[] = [
    {
      date: "2024-01-15",
      checkInTime: "09:30",
      checkOutTime: "18:00",
      status: "present",
      meetingLogs: ["Team Standup 10:00", "Project Review 14:30"],
    },
    {
      date: "2024-01-14",
      checkInTime: "09:15",
      checkOutTime: "17:45",
      status: "present",
      meetingLogs: ["1:1 Sync 15:00"],
    },
    {
      date: "2024-01-13",
      checkInTime: "10:00",
      checkOutTime: "18:30",
      status: "late",
      notes: "Traffic congestion",
      meetingLogs: ["Client Call 13:00"],
    },
    {
      date: "2024-01-12",
      checkInTime: "09:00",
      checkOutTime: "13:30",
      status: "half-day",
      notes: "Medical appointment",
    },
    {
      date: "2024-01-11",
      checkInTime: "-",
      checkOutTime: "-",
      status: "absent",
      notes: "Sick leave",
    },
    {
      date: "2024-01-10",
      checkInTime: "09:15",
      checkOutTime: "18:15",
      status: "present",
      meetingLogs: ["Team Standup 10:00", "Product Demo 16:00"],
    },
  ];

  const toggleExpand = (date: string) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const getStatusConfig = (status: string) => {
    const config: Record<
      string,
      { color: "default" | "secondary" | "destructive" | "outline"; label: string }
    > = {
      present: { color: "default", label: "Present" },
      late: { color: "secondary", label: "Late" },
      absent: { color: "destructive", label: "Absent" },
      "half-day": { color: "outline", label: "Half Day" },
    };
    return config[status];
  };

  const statusConfig = getStatusConfig("present");

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-2xl font-bold text-foreground">18</p>
          <p className="text-xs text-muted-foreground">Present Days</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-2xl font-bold text-yellow-600">2</p>
          <p className="text-xs text-muted-foreground">Late Days</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-2xl font-bold text-red-600">1</p>
          <p className="text-xs text-muted-foreground">Absent Days</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">1</p>
          <p className="text-xs text-muted-foreground">Half Days</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-2xl font-bold text-green-600">95%</p>
          <p className="text-xs text-muted-foreground">Attendance %</p>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="rounded-lg border border-border overflow-hidden">
        {attendanceData.map((record) => (
          <div key={record.date} className="border-b border-border last:border-b-0">
            {/* Main Row */}
            <button
              onClick={() => toggleExpand(record.date)}
              className="w-full px-4 py-3 hover:bg-muted/50 transition-colors flex items-center justify-between"
            >
              <div className="flex-1 text-left">
                <p className="font-medium text-foreground">{record.date}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {record.checkInTime} - {record.checkOutTime}
                  </span>
                  <Badge variant={getStatusConfig(record.status).color}>
                    {getStatusConfig(record.status).label}
                  </Badge>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  expandedDates.includes(record.date) ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Expanded Details */}
            {expandedDates.includes(record.date) && (
              <div className="border-t border-border bg-muted/30 px-4 py-3 space-y-3">
                {record.notes && (
                  <div>
                    <p className="text-sm font-medium text-foreground">Notes</p>
                    <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                  </div>
                )}

                {record.meetingLogs && record.meetingLogs.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Meetings</p>
                    <ul className="space-y-1">
                      {record.meetingLogs.map((meeting, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                          {meeting}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Mark Correction
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
