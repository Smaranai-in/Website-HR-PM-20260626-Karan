import { useState } from "react";
import { DashboardLayout } from "../../../../components/supervisor/layout/DashboardLayout";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { Progress } from "../../../../components/ui/progress";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Phone, Calendar, Download, MoreHorizontal, Eye, MessageSquare, AlertCircle, RefreshCw, XCircle, Search } from "lucide-react";
import { TaskDetailsDialog } from "../../../../components/supervisor/tasks/TaskDetailsDialog";
import { AssignTaskDialog } from "../../../../components/supervisor/tasks/AssignTaskDialog";

const mockTasks = [
  {
    id: "1",
    name: "Create Login page for Project 2",
    assignedTo: "Priya Verma",
    role: "Web Intern",
    avatar: "",
    priority: "High",
    deadline: "4 Nov, 2025",
    status: "In Progress",
    progress: 50,
    description: "Create responsive login UI with validation.",
    subTasks: [
      { id: "1", text: "Finalize high-fidelity mockups", completed: true },
      { id: "2", text: "Updated Design System", completed: true },
      { id: "3", text: "Supervise Dashboard design", completed: false },
      { id: "4", text: "Drafted LinkedIn Post Frames", completed: false },
    ],
    internNote: "I completed the UI and connected the API.",
    attachments: [
      { name: "Report.pdf", type: "pdf" as const },
      { name: "Sheets_File.sxl", type: "excel" as const },
    ],
  },
  {
    id: "2",
    name: "Create Login page for Project 2",
    assignedTo: "John Doe",
    role: "Web Intern",
    avatar: "",
    priority: "Low",
    deadline: "4 Nov, 2025",
    status: "Completed",
    progress: 100,
    description: "Create responsive login UI with validation.",
    subTasks: [
      { id: "1", text: "Finalize high-fidelity mockups", completed: true },
      { id: "2", text: "Updated Design System", completed: true },
    ],
    internNote: "All tasks completed successfully.",
    attachments: [{ name: "Report.pdf", type: "pdf" as const }],
  },
  {
    id: "3",
    name: "Create Login page for Project 2",
    assignedTo: "Ravi Kumar",
    role: "Web Intern",
    avatar: "",
    priority: "High",
    deadline: "4 Nov, 2025",
    status: "Pending (On Leave)",
    progress: 30,
    description: "Create responsive login UI with validation.",
    subTasks: [
      { id: "1", text: "Finalize high-fidelity mockups", completed: true },
    ],
    internNote: "Will continue after leave.",
    attachments: [],
  },
  {
    id: "4",
    name: "Create Login page for Project 2",
    assignedTo: "Tejas Joshi",
    role: "Web Intern",
    avatar: "",
    priority: "Medium",
    deadline: "3 Nov, 2025",
    status: "Overdue",
    progress: 20,
    description: "Create responsive login UI with validation.",
    subTasks: [],
    internNote: "Working on it.",
    attachments: [],
  },
  {
    id: "5",
    name: "Create Login page for Project 2",
    assignedTo: "John Doe",
    role: "Web Intern",
    avatar: "",
    priority: "Low",
    deadline: "4 Nov, 2025",
    status: "Completed",
    progress: 100,
    description: "Create responsive login UI with validation.",
    subTasks: [],
    internNote: "Done.",
    attachments: [],
  },
  {
    id: "6",
    name: "Create Login page for Project 2",
    assignedTo: "Tejas Joshi",
    role: "Web Intern",
    avatar: "",
    priority: "Medium",
    deadline: "3 Nov, 2025",
    status: "In Progress",
    progress: 40,
    description: "Create responsive login UI with validation.",
    subTasks: [],
    internNote: "In progress.",
    attachments: [],
  },
  {
    id: "7",
    name: "Create Login page for Project 2",
    assignedTo: "John Doe",
    role: "Web Intern",
    avatar: "",
    priority: "Low",
    deadline: "4 Nov, 2025",
    status: "Completed",
    progress: 100,
    description: "Create responsive login UI with validation.",
    subTasks: [],
    internNote: "Completed.",
    attachments: [],
  },
  {
    id: "8",
    name: "Create Login page for Project 2",
    assignedTo: "Ravi Kumar",
    role: "Web Intern",
    avatar: "",
    priority: "High",
    deadline: "4 Nov, 2025",
    status: "In Progress",
    progress: 80,
    description: "Create responsive login UI with validation.",
    subTasks: [],
    internNote: "Almost done.",
    attachments: [],
  },
  {
    id: "9",
    name: "Create Login page for Project 2",
    assignedTo: "Tejas Joshi",
    role: "Web Intern",
    avatar: "",
    priority: "Medium",
    deadline: "3 Nov, 2025",
    status: "Pending (Inactive)",
    progress: 20,
    description: "Create responsive login UI with validation.",
    subTasks: [],
    internNote: "Pending.",
    attachments: [],
  },
  {
    id: "10",
    name: "Create Login page for Project 2",
    assignedTo: "John Doe",
    role: "Web Intern",
    avatar: "",
    priority: "Low",
    deadline: "4 Nov, 2025",
    status: "Completed",
    progress: 100,
    description: "Create responsive login UI with validation.",
    subTasks: [],
    internNote: "Done.",
    attachments: [],
  },
];

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<typeof mockTasks[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-blue-100 text-blue-700";
      case "pending (on leave)":
        return "bg-yellow-100 text-yellow-700";
      case "pending (inactive)":
        return "bg-orange-100 text-orange-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleViewDetails = (task: typeof mockTasks[0]) => {
    setSelectedTask(task);
    setDetailsDialogOpen(true);
  };

  return (
    <DashboardLayout title="Tasks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
            <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Phone className="h-4 w-4" />
              Start Meeting
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Select>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Deadline" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Assigned Intern" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Interns</SelectItem>
              <SelectItem value="priya">Priya Verma</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="ravi">Ravi Kumar</SelectItem>
              <SelectItem value="tejas">Tejas Joshi</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 w-[150px]" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className={activeFilter === "all" ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}
          >
            All Interns
          </Button>
          <Button
            variant={activeFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("active")}
          >
            Active Interns
          </Button>
          <Button
            variant={activeFilter === "onleave" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("onleave")}
          >
            OnLeave Interns
          </Button>
          <Button
            variant={activeFilter === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("inactive")}
          >
            InActive Interns
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button
            className="bg-primary text-primary-foreground gap-2"
            onClick={() => setAssignDialogOpen(true)}
          >
            Add New Task
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#c7e3ff] hover:bg-[#c7e3ff]">
                <TableHead className="text-center font-semibold">Task</TableHead>
                <TableHead className="text-center font-semibold">Assigned To</TableHead>
                <TableHead className="text-center font-semibold">Priority</TableHead>
                <TableHead className="text-center font-semibold">Deadline</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold">Progress</TableHead>
                <TableHead className="text-center font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {task.assignedTo.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{task.assignedTo}</p>
                        <p className="text-xs text-muted-foreground">{task.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">{task.deadline}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={task.progress} className="h-2 w-20" />
                      <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white z-50">
                        <DropdownMenuItem onClick={() => handleViewDetails(task)} className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View Task Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <MessageSquare className="h-4 w-4" />
                          Add Feedback
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <AlertCircle className="h-4 w-4" />
                          Needs Improvement
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <RefreshCw className="h-4 w-4" />
                          Request more Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer text-red-600">
                          <XCircle className="h-4 w-4" />
                          Reject Completion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TaskDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        task={selectedTask}
      />

      <AssignTaskDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </DashboardLayout>
  );
}
