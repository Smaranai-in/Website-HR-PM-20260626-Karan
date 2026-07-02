import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../../../../components/supervisor/layout/DashboardLayout";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Download, Video, CalendarPlus, Search } from "lucide-react";
import { StartMeetingDialog } from "../../../../components/supervisor/meetings/StartMeetingDialog";
import { ScheduleMeetingDialog } from "../../../../components/supervisor/meetings/ScheduleMeetingDialog";

const filters = ["All", "Web", "UI/UX Design", "AI"];

const internsData = [
  { id: "1", name: "Priya Verma", role: "Web Intern", taskAssigned: 7, taskCompleted: 5, pending: 3, lastReport: "4 Nov, 2025", status: "Active" },
  { id: "2", name: "Shantanu Sharma", role: "Figma Design Interview", taskAssigned: 19, taskCompleted: 10, pending: 7, lastReport: "4 Nov, 2025", status: "On Leave" },
  { id: "3", name: "Tejas Joshi", role: "Web Intern", taskAssigned: 25, taskCompleted: 12, pending: 13, lastReport: "4 Nov, 2025", status: "InActive" },
  { id: "4", name: "Ravi Kumar", role: "AI Intern", taskAssigned: 8, taskCompleted: 3, pending: 5, lastReport: "3 Nov, 2025", status: "Active" },
  { id: "5", name: "John Doe", role: "Design Intern", taskAssigned: 5, taskCompleted: 2, pending: 4, lastReport: "3 Nov, 2025", status: "On Leave" },
  { id: "6", name: "John Doe", role: "Web Intern", taskAssigned: 15, taskCompleted: 13, pending: 2, lastReport: "3 Nov, 2025", status: "Active" },
  { id: "7", name: "John Doe", role: "Web Intern", taskAssigned: 15, taskCompleted: 13, pending: 2, lastReport: "3 Nov, 2025", status: "Active" },
  { id: "8", name: "John Doe", role: "Web Intern", taskAssigned: 15, taskCompleted: 13, pending: 2, lastReport: "3 Nov, 2025", status: "On Leave" },
];

const statusConfig = {
  "Active": {
    bg: "bg-[#a6f9c3]",
    text: "text-[#15803D]",
    dot: "bg-[#15803D]"
  },
  "On Leave": {
    bg: "bg-[#FECACA]",
    text: "text-[#B91C1C]",
    dot: "bg-[#B91C1C]"
  },
  "InActive": {
    bg: "bg-[#FDE68A]",
    text: "text-[#B45309]",
    dot: "bg-[#B45309]"
  },
};

export default function InternsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [startMeetingOpen, setStartMeetingOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Interns List">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="text-center flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-2">Intern List Log</h2>
            <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="gradient-primary text-primary-foreground">
              <Link to="/supervisor/attendance">Interns Attendance</Link>
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setStartMeetingOpen(true)}
            >
              <Video className="h-4 w-4" />
              Start Meeting
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setScheduleMeetingOpen(true)}
            >
              <CalendarPlus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeFilter === filter
                  ? "bg-smaran-blue text-primary-foreground"
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
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
          <div className="relative flex-1 max-w-[200px]">
            <Input placeholder="Search..." className="pr-10" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            {/* HEADER */}
            <thead>
              <tr className="bg-[#c7e3ff] text-gray-800 rounded-xl">
                <th className="px-6 py-4 text-left text-sm font-semibold rounded-l-xl">
                  Intern Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Task Assigned
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Task Completed
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Pending/ Overdue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Last Report
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold rounded-r-xl">
                  Action
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {internsData.map((intern, index) => {
                const config =
                  statusConfig[intern.status as keyof typeof statusConfig];

                return (
                  <tr
                    key={index}
                    className="bg-gray-50 shadow-sm rounded-xl hover:bg-gray-100 transition"
                  >
                    {/* NAME */}
                    <td className="px-6 py-4 rounded-l-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden shadow-sm">
                          <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              intern.name
                            )}&background=8FB2D0&color=fff`}
                            alt={intern.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {intern.name}
                        </span>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {intern.role}
                    </td>

                    {/* NUMBERS */}
                    <td className="px-6 py-4 text-center text-sm text-gray-800">
                      {intern.taskAssigned}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">
                      {intern.taskCompleted}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">
                      {intern.pending}
                    </td>

                    {/* LAST REPORT */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {intern.lastReport}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 text-center">
                      <Badge
                        className={`rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
                      >
                        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${config.dot}`} />
                        {intern.status}
                      </Badge>
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4 text-center rounded-r-xl">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg bg-white hover:bg-gray-100 shadow-sm"
                        onClick={() => navigate(`/supervisor/interns/${intern.id}`)}                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            className="rounded-lg bg-white shadow-sm gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <StartMeetingDialog
        open={startMeetingOpen}
        onOpenChange={setStartMeetingOpen}
      />
      <ScheduleMeetingDialog
        open={scheduleMeetingOpen}
        onOpenChange={setScheduleMeetingOpen}
      />
    </DashboardLayout>
  );
}
