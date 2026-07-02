import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { FileDown, Search, Users, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import ChatbotButton from "../../../../components/ChatbotButton";

const quickStats = [
  { 
    icon: Users, 
    value: "15", 
    label: "Total Task Assigned", 
    change: "+2 new this week", 
    bgColor: "bg-primary/10",
    iconBg: "bg-primary",
    changeColor: "text-primary"
  },
  { 
    icon: TrendingUp, 
    value: "78%", 
    label: "Progress", 
    change: "+5% from Last Week", 
    bgColor: "bg-cyan-50",
    iconBg: "bg-cyan-500",
    changeColor: "text-cyan-600"
  },
  { 
    icon: CheckCircle, 
    value: "8", 
    label: "Task completed", 
    change: "67% Completed", 
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    changeColor: "text-emerald-600"
  },
  { 
    icon: AlertTriangle, 
    value: "12", 
    label: "Over Due Tasks", 
    change: "0.5% from Last Week", 
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-500",
    changeColor: "text-rose-600"
  },
];

const tasks = [
  { title: "Create login page for Project 2", priority: "Low", deadline: "2 Nov, 2025", status: "In Progress", progress: 80 },
  { title: "Fix responsive layout in Dashboard", priority: "High", deadline: "1 Nov, 2025", status: "Completed", progress: 100 },
  { title: "Update component documentation", priority: "Medium", deadline: "5 Nov, 2025", status: "Not Started", progress: 5 },
  { title: "Fix responsive layout in Dashboard", priority: "High", deadline: "3 Nov, 2025", status: "Needs Improvement", progress: 100 },
  { title: "Create login page for Project 2", priority: "Low", deadline: "2 Nov, 2025", status: "In Progress", progress: 80 },
  { title: "Update component documentation", priority: "Medium", deadline: "5 Nov, 2025", status: "Rejected", progress: 5 },
  { title: "Update component documentation", priority: "Medium", deadline: "5 Nov, 2025", status: "Completed", progress: 5 },
];

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "High":
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">High</Badge>;
    case "Medium":
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Medium</Badge>;
    case "Low":
      return <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "In Progress":
      return <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">● In Progress</Badge>;
    case "Completed":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">● Completed</Badge>;
    case "Not Started":
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">● Not Started</Badge>;
    case "Needs Improvement":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">● Needs Improvement</Badge>;
    case "Rejected":
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">● Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return "bg-emerald-500";
  if (progress >= 50) return "bg-primary";
  return "bg-cyan-500";
};

const MyTasks = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-purple-50 flex">
      <DashboardSidebar activeItem="My Tasks" />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="My Tasks" />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Quick Stats Header */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                  <p className="text-sm text-muted-foreground">This Week's summary</p>
                </div>
                <Button variant="outline" size="sm">
                  <FileDown className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className={`${stat.bgColor} rounded-xl p-4`}>
                    <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-xs ${stat.changeColor} mt-1`}>{stat.change}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Tasks Section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
            <p className="text-muted-foreground">View all tasks assigned to you, update their status, and submit work.</p>
          </div>

          {/* Filters */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button variant="default" size="sm" className="rounded-md">All</Button>
              <Button variant="ghost" size="sm" className="rounded-md">High</Button>
              <Button variant="ghost" size="sm" className="rounded-md">Medium</Button>
              <Button variant="ghost" size="sm" className="rounded-md">Low</Button>
            </div>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Deadline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Earliest First</SelectItem>
                <SelectItem value="desc">Latest First</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="notstarted">Not Started</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Input placeholder="Search..." className="w-40 pr-8" />
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Tasks Table */}
          <Card>
            <CardHeader className="pb-2">
              <div>
                <CardTitle>All Tasks</CardTitle>
                <p className="text-sm text-muted-foreground">You currently have 8 active tasks assigned by your supervisor.</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-foreground">Task Title</th>
                    <th className="text-center p-4 text-sm font-medium text-foreground">Priority</th>
                    <th className="text-center p-4 text-sm font-medium text-foreground">Deadline</th>
                    <th className="text-center p-4 text-sm font-medium text-foreground">Status</th>
                    <th className="text-center p-4 text-sm font-medium text-foreground">Progress</th>
                    <th className="text-center p-4 text-sm font-medium text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-4 text-sm">{task.title}</td>
                      <td className="p-4 text-center">{getPriorityBadge(task.priority)}</td>
                      <td className="p-4 text-sm text-center">{task.deadline}</td>
                      <td className="p-4 text-center">{getStatusBadge(task.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getProgressColor(task.progress)} rounded-full`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{task.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-7 px-2 bg-cyan-50 text-cyan-700 border-cyan-200"
                            onClick={() => navigate('/task-details')}
                          >
                            View Task
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-primary/10 text-primary border-primary/20">
                            Mark Complete
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs h-7 px-2 bg-rose-50 text-rose-700 border-rose-200">
                            Submit Task
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default MyTasks;
