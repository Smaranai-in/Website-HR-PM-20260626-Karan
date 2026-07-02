import { useState } from "react";
import { DashboardLayout } from "../../../../components/supervisor/layout/DashboardLayout";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
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
import { Search } from "lucide-react";
import { ReportDetailsDialog } from "../../../../components/supervisor/reports/ReportDetailsDialog";

export type Report = {
  id: string;
  intern: string;
  role: string;
  avatar: string;
  date: string;
  summary: string;
  hoursWorked: string;
  pendingOverdue: string;
  status: string;
};

export const reports: Report[] = [
  {
    id: "1",
    intern: "Priya Verma",
    role: "Web Intern",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Fixed the responsive layout issues on the Supervisor Dashboard and integrated the..",
    hoursWorked: "8 hrs",
    pendingOverdue: "3/3",
    status: "Received",
  },
  {
    id: "2",
    intern: "Shantanu Sharma",
    role: "Figma Design Interview",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Finalized the high-fidelity mockups for the Profile page and updated the design sys...",
    hoursWorked: "7 hrs",
    pendingOverdue: "2/3",
    status: "Pending",
  },
  {
    id: "3",
    intern: "Tejas Joshi",
    role: "Web Intern",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Drafted 5 LinkedIn posts for the upcoming product launch and analyzed last week's...",
    hoursWorked: "13 hrs",
    pendingOverdue: "4/5",
    status: "Pending",
  },
  {
    id: "4",
    intern: "Ravi Kumar",
    role: "AI, Intern",
    avatar: "",
    date: "3 Nov, 2025",
    summary: "Fixed the responsive layout issues on the Supervisor Dashboard and integrated the..",
    hoursWorked: "5 hrs",
    pendingOverdue: "4/4",
    status: "Received",
  },
  {
    id: "5",
    intern: "John Doe",
    role: "Design Intern",
    avatar: "",
    date: "3 Nov, 2025",
    summary: "Finalized the high-fidelity mockups for the Profile page and updated the design sys...",
    hoursWorked: "7 hrs",
    pendingOverdue: "3/4",
    status: "Received",
  },
  {
    id: "6",
    intern: "John Doe",
    role: "Web Intern",
    avatar: "",
    date: "3 Nov, 2025",
    summary: "Drafted 5 LinkedIn posts for the upcoming product launch and analyzed last week's...",
    hoursWorked: "8 hrs",
    pendingOverdue: "5/5",
    status: "Received",
  },
  {
    id: "7",
    intern: "Tejas Joshi",
    role: "Web Intern",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Drafted 5 LinkedIn posts for the upcoming product launch and analyzed last week's...",
    hoursWorked: "13 hrs",
    pendingOverdue: "4/5",
    status: "Pending",
  },
  {
    id: "8",
    intern: "Priya Verma",
    role: "Web Intern",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Fixed the responsive layout issues on the Supervisor Dashboard and integrated the..",
    hoursWorked: "8 hrs",
    pendingOverdue: "3/3",
    status: "Received",
  },
  {
    id: "9",
    intern: "Ravi Kumar",
    role: "AI, Intern",
    avatar: "",
    date: "3 Nov, 2025",
    summary: "Fixed the responsive layout issues on the Supervisor Dashboard and integrated the..",
    hoursWorked: "5 hrs",
    pendingOverdue: "4/4",
    status: "Received",
  },
  {
    id: "10",
    intern: "Shantanu Sharma",
    role: "Figma Design Interview",
    avatar: "",
    date: "4 Nov, 2025",
    summary: "Finalized the high-fidelity mockups for the Profile page and updated the design sys...",
    hoursWorked: "7 hrs",
    pendingOverdue: "2/4",
    status: "Pending",
  },
];

export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const handleViewDetails = (report: typeof reports[0]) => {
    setSelectedReport(report);
    setDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <DashboardLayout title="Reports Review">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Daily Reports Review</h1>
          <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={activeFilter === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("all")}
              className={activeFilter === "all" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "received" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("received")}
            >
              Received
            </Button>
            <Button
              variant={activeFilter === "pending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter("pending")}
            >
              Pending
            </Button>
          </div>

          <Select>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Profile" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="priya">Priya Verma</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="ravi">Ravi Kumar</SelectItem>
              <SelectItem value="tejas">Tejas Joshi</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 w-[150px]" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#c7e3ff] hover:bg-[#c7e3ff]">
                <TableHead className="text-center font-semibold">Intern</TableHead>
                <TableHead className="text-center font-semibold">Date</TableHead>
                <TableHead className="text-center font-semibold">Report Summary</TableHead>
                <TableHead className="text-center font-semibold">Hours Worked</TableHead>
                <TableHead className="text-center font-semibold">Pending/ Overdue</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports
                .filter((report) => {
                  if (activeFilter === "all") return true;
                  return report.status.toLowerCase() === activeFilter;
                })
                .map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={report.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {report.intern.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{report.intern}</p>
                          <p className="text-xs text-muted-foreground">{report.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-sm">{report.date}</TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-muted-foreground truncate">{report.summary}</p>
                    </TableCell>
                    <TableCell className="text-center text-sm">{report.hoursWorked}</TableCell>
                    <TableCell className="text-center text-sm">{report.pendingOverdue}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(report)}
                      >
                        View Detailed Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <ReportDetailsDialog
          isOpen={detailsOpen}
          onOpenChange={setDetailsOpen}
          reportDate={selectedReport?.date}
          internName={selectedReport?.intern}
        />
      </div>
    </DashboardLayout>
  );
}
