import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Textarea } from "../../../../components/ui/textarea";
import { Search, FileText, FileSpreadsheet, Check } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const reportsData = [
  {
    id: 1,
    name: "Priya Verma",
    role: "Web Intern",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Fixed the responsive layout issues on the Supervisor Dashboard and integrated the..",
    hoursWorked: "8 hrs",
    pendingOverdue: "3/3",
    status: "Received",
    tasks: [
      { name: "Finalize high-fidelity mockups", completed: true },
      { name: "Updated Design System", completed: true },
      { name: "Supervise Dashboard design", completed: false },
      { name: "Drafted Linkedin Post Frames", completed: false },
    ],
    timeAllocation: [
      { name: "Design", value: 5, color: "#4CC9F0" },
      { name: "Development", value: 2, color: "#F4B740" },
      { name: "Meeting", value: 1, color: "#7209B7" },
    ],
    totalHours: "8 Hrs",
    blockers: "Waiting for confirmation on typography style for mobile view on the login page and attendance page",
    attachments: [
      { name: "Report.pdf", type: "pdf" },
      { name: "Sheets_File.sxl", type: "excel" },
    ],
  },
  {
    id: 2,
    name: "Shantanu Sharma",
    role: "Figma Design Interview",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Finalized the high-fidelity mockups for the Profile page and updated the design sys...",
    hoursWorked: "7 hrs",
    pendingOverdue: "2/3",
    status: "Pending",
    tasks: [
      { name: "Finalize high-fidelity mockups", completed: true },
      { name: "Updated Design System", completed: true },
      { name: "Supervise Dashboard design", completed: false },
      { name: "Drafted Linkedin Post Frames", completed: false },
    ],
    timeAllocation: [
      { name: "Design", value: 5, color: "#4CC9F0" },
      { name: "Development", value: 1, color: "#F4B740" },
      { name: "Meeting", value: 1, color: "#7209B7" },
    ],
    totalHours: "7 Hrs",
    blockers: "Waiting for confirmation on typography style for mobile view on the login page and attendance page",
    attachments: [
      { name: "Report.pdf", type: "pdf" },
      { name: "Sheets_File.sxl", type: "excel" },
    ],
  },
];

export default function Reports() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState<typeof reportsData[0] | null>(null);
  const [feedback, setFeedback] = useState("");

  const filteredReports = reportsData.filter((report) => {
    if (activeFilter === "All") return true;
    return report.status === activeFilter;
  });

  return (
    <>
      <div className="space-y-6">
        {/* Subtitle */}
        <p className="text-center text-muted-foreground italic">
          Lorem ipsum dolor sit amet, consectetur adipisci
        </p>

        {/* Filters */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex bg-muted rounded-lg p-1">
            {["All", "Received", "Pending"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeFilter === filter
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="web">Web Intern</SelectItem>
              <SelectItem value="design">Design Intern</SelectItem>
              <SelectItem value="ai">AI Intern</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 w-[150px]" />
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary/5">
                <TableHead className="font-semibold">Intern</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Report Summary</TableHead>
                <TableHead className="font-semibold text-center">Hours Worked</TableHead>
                <TableHead className="font-semibold text-center">Pending/Overdue</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={report.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {report.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-primary">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{report.date}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                    {report.summary}
                  </TableCell>
                  <TableCell className="text-center text-sm">{report.hoursWorked}</TableCell>
                  <TableCell className="text-center text-sm">{report.pendingOverdue}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`${
                        report.status === "Received"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedReport(report)}
                    >
                      View Detailed Report
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Detailed Report Dialog */}
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">
                Detailed Report - {selectedReport?.name}
              </DialogTitle>
              <p className="text-primary text-sm">{selectedReport?.date}</p>
            </DialogHeader>

            {selectedReport && (
              <div className="space-y-5">
                {/* Task Done Today & Time Allocation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Task Done Today</h4>
                    <div className="space-y-2">
                      {selectedReport.tasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className={`h-5 w-5 rounded flex items-center justify-center ${
                              task.completed
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {task.completed && <Check className="h-3 w-3" />}
                          </div>
                          <span className="text-sm">{task.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3">Time Allocation</h4>
                    <div className="relative h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={selectedReport.timeAllocation}
                            innerRadius={35}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {selectedReport.timeAllocation.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute top-0 right-0 text-xs space-y-1">
                        {selectedReport.timeAllocation.map((item, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <span>{item.value} hrs</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Hours Worked */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Total hours Worked</h4>
                  <Badge variant="outline" className="bg-muted">
                    {selectedReport.totalHours}
                  </Badge>
                </div>

                {/* Issue/Blockers & Work Samples */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Issue / Blockers</h4>
                    <div className="p-3 bg-muted/50 rounded-lg border text-sm text-muted-foreground">
                      {selectedReport.blockers}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Work Samples / Attachments</h4>
                    <div className="space-y-2">
                      {selectedReport.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                        >
                          {file.type === "pdf" ? (
                            <FileText className="h-5 w-5 text-red-500" />
                          ) : (
                            <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          )}
                          <span className="text-sm">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Supervisor Feedback */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Supervisor Feedback box</h4>
                  <Textarea
                    placeholder="Enter your feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                    Submit Feedback
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
