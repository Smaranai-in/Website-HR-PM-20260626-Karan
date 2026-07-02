import { Link } from "react-router-dom";
import { ChevronRight, Plus, Star, TrendingUp, Clock, CheckCircle, MoreHorizontal, Paperclip, Send, ChevronDown } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { DashboardLayout } from "../../../../components/supervisor/layout/DashboardLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Textarea } from "../../../../components/ui/textarea";
import { AttendanceTab } from "../../../../components/supervisor/intern-details/AttendanceTab";

// Mock intern data - in real app this would come from API/database
const internData = {
  id: "1",
  name: "John Doe",
  role: "Web Intern",
  status: "Active",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  dateOfBirth: "28 Apr, 2006",
  joiningDate: "1 Nov, 2025",
  department: "Engineering",
  supervisor: "Musfiq",
  email: "johndoe003@gmail.com",
  phone: "+91 12345-12447",
  address: "Mumbai, India",
  skills: ["Figma", "Html", "CSS", "React Js", "CSS", "Javascript", "Node Js"],
  education: {
    university: "XYZ University, 2024",
    degree: "B.Tech in Computer Science & engineering"
  }
};

const statusConfig = {
  "Active": { bg: "bg-status-success/10", text: "text-status-success", dot: "bg-status-success" },
  "On Leave": { bg: "bg-status-warning/10", text: "text-status-warning", dot: "bg-status-warning" },
  "InActive": { bg: "bg-status-error/10", text: "text-status-error", dot: "bg-status-error" },
};

export default function InternDetails() {
  const { id } = internData;
  const intern = internData; // In real app, fetch by id

  const statusStyle = statusConfig[intern.status as keyof typeof statusConfig] || statusConfig["Active"];

  return (
    <DashboardLayout title="Interns Details">
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/supervisor/interns" className="text-muted-foreground hover:text-foreground transition-colors">Interns</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to="/supervisor/interns" className="text-muted-foreground hover:text-foreground transition-colors">Intern List Log</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link to="/supervisor/attendance" className="text-muted-foreground hover:text-foreground transition-colors">Intern Details</Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Profile</span>
        </div>

        {/* Header Card */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={intern.avatar}
                alt={intern.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-border"
              />
              <div>
                <h2 className="text-2xl font-bold text-primary">{intern.name}</h2>
                <p className="text-muted-foreground">{intern.role}</p>
              </div>
              <Badge className={`${statusStyle.bg} ${statusStyle.text} border-0 ml-4`}>
                <span className={`h-2 w-2 rounded-full ${statusStyle.dot} mr-2`}></span>
                {intern.status}
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button className="bg-primary/20 text-primary hover:bg-primary/30">
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
              <Button className="gradient-primary text-primary-foreground">
                <Star className="h-4 w-4 mr-2" />
                Add Feedback / Rating
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-card border border-border w-full justify-start gap-0 p-0 h-auto rounded-xl overflow-hidden">
            <TabsTrigger value="profile" className="data-[state=active]:bg-muted rounded-none px-8 py-3 border-b-2 border-transparent data-[state=active]:border-primary">
              Profile
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-muted rounded-none px-8 py-3 border-b-2 border-transparent data-[state=active]:border-primary">
              Performance
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-muted rounded-none px-8 py-3 border-b-2 border-transparent data-[state=active]:border-primary">
              Attendance
            </TabsTrigger>
            <TabsTrigger value="task" className="data-[state=active]:bg-muted rounded-none px-8 py-3 border-b-2 border-transparent data-[state=active]:border-primary">
              Task
            </TabsTrigger>
            <TabsTrigger value="daily-report" className="data-[state=active]:bg-muted rounded-none px-8 py-3 border-b-2 border-transparent data-[state=active]:border-primary">
              Daily Report
            </TabsTrigger>
            <TabsTrigger value="communication" className="data-[state=active]:bg-muted rounded-none px-8 py-3 border-b-2 border-transparent data-[state=active]:border-primary">
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Profile Card */}
              <div className="space-y-6">
                {/* Profile Photo Card */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/20 relative">
                    <img
                      src={intern.avatar}
                      alt={intern.name}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 h-40 w-40 rounded-full object-cover border-4 border-card shadow-lg"
                    />
                  </div>
                  <div className="pt-12 pb-6 px-6 text-center">
                    <h3 className="text-xl font-bold text-primary">{intern.name}</h3>
                    <p className="text-muted-foreground">{intern.role}</p>
                    <Button className="gradient-primary text-primary-foreground mt-4">
                      Send Message
                    </Button>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground min-w-[80px]">Email :</span>
                      <span className="text-foreground">{intern.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground min-w-[80px]">Phone no :</span>
                      <span className="text-foreground">{intern.phone}</span>
                    </div>
                  </div>
                  <div className="border-t border-border mt-4 pt-4">
                    <h4 className="text-lg font-bold text-primary mb-2">Address</h4>
                    <p className="text-foreground">{intern.address}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground min-w-[120px]">Date of Birth :</span>
                      <span className="text-foreground font-medium">{intern.dateOfBirth}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground min-w-[120px]">Joining Date :</span>
                      <span className="text-foreground font-medium">{intern.joiningDate}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground min-w-[120px]">Department :</span>
                      <span className="text-foreground font-medium">{intern.department}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground min-w-[120px]">Supervisor :</span>
                      <span className="text-foreground font-medium">{intern.supervisor}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {intern.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-muted px-4 py-1.5 text-foreground border-border">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">Education</h3>
                  <div>
                    <p className="text-foreground font-medium">{intern.education.university}</p>
                    <p className="text-muted-foreground">{intern.education.degree}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-2xl font-bold text-foreground mb-4">Overall Score</h3>
                <div className="flex items-center gap-3">
                  <Star className="h-16 w-16 text-amber-400 fill-amber-400" />
                  <span className="text-6xl font-bold text-foreground">4.5</span>
                  <span className="text-4xl text-muted-foreground font-light">/ 5</span>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Productivity Card */}
                  <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-900/30 dark:to-cyan-800/20 rounded-xl p-6">
                    <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 w-fit mb-4">
                      <TrendingUp className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">88%</p>
                    <p className="text-muted-foreground">Productivity</p>
                  </div>

                  {/* Punctuality Card */}
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-800/20 rounded-xl p-6">
                    <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 w-fit mb-4">
                      <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">95%</p>
                    <p className="text-muted-foreground">Punctuality</p>
                  </div>

                  {/* Task Completion Rate Card */}
                  <div className="bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/30 dark:to-green-800/20 rounded-xl p-6">
                    <div className="bg-white/60 dark:bg-white/10 rounded-xl p-3 w-fit mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">92%</p>
                    <p className="text-muted-foreground">Task Completion Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="mt-6">
            <AttendanceTab />
          </TabsContent>

          <TabsContent value="task" className="mt-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#c7e3ff] hover:bg-[#c7e3ff]">
                    <TableHead className="text-foreground font-semibold">Task Name</TableHead>
                    <TableHead className="text-foreground font-semibold">Deadline</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Create Login page for Project 2", deadline: "5 Nov, 2025", status: "Completed" },
                    { name: "Create Login page for Project 2", deadline: "5 Nov, 2025", status: "In Progress" },
                    { name: "Create Login page for Project 2", deadline: "5 Nov, 2025", status: "Completed" },
                    { name: "Create Login page for Project 2", deadline: "5 Nov, 2025", status: "Completed" },
                    { name: "Create Login page for Project 2", deadline: "5 Nov, 2025", status: "In Progress" },
                    { name: "Create Login page for Project 2", deadline: "5 Nov, 2025", status: "Overdue" },
                  ].map((task, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{task.name}</TableCell>
                      <TableCell>{task.deadline}</TableCell>
                      <TableCell>
                        <Badge className={`border-0 ${task.status === "Completed" ? "bg-status-success/20 text-status-success" :
                          task.status === "In Progress" ? "bg-status-info/20 text-status-info" :
                            "bg-status-error/20 text-status-error"
                          }`}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className={`${task.status === "Completed" ? "text-muted-foreground" : "bg-primary/10 text-primary border-primary/20"
                            }`}>
                            {task.status === "Completed" ? "Add Feedback" : "Mark Complete"}
                          </Button>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="daily-report" className="mt-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#c7e3ff] hover:bg-[#c7e3ff]">
                    <TableHead className="text-foreground font-semibold">Report Summary</TableHead>
                    <TableHead className="text-foreground font-semibold">Date</TableHead>
                    <TableHead className="text-foreground font-semibold">Hour</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { summary: "All daily Key tasks completed", date: "5 Nov, 2025", hours: 2, status: "Received" },
                    { summary: "2 task remaining to complete", date: "4 Nov, 2025", hours: 5, status: "Pending" },
                    { summary: "Documentation of project done", date: "3 Nov, 2025", hours: 4, status: "Received" },
                    { summary: "Create Login page for Project 2", date: "2 Nov, 2025", hours: 2, status: "Pending" },
                    { summary: "Create Login page for Project 2", date: "1 Nov, 2025", hours: 3, status: "Overdue" },
                  ].map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.summary}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>{report.hours}</TableCell>
                      <TableCell>
                        <Badge className={`border-0 ${report.status === "Received" ? "bg-status-success/20 text-status-success" :
                          report.status === "Pending" ? "bg-status-warning/20 text-status-warning" :
                            "bg-status-error/20 text-status-error"
                          }`}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                            View
                          </Button>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Conversation Section */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
                <h3 className="text-xl font-bold text-foreground mb-6">Conversation</h3>
                <div className="space-y-4 mb-6">
                  {/* Supervisor Message */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary/10 rounded-xl p-4 max-w-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-primary">Musfiq</span>
                        <span className="text-xs text-muted-foreground">10:31 AM</span>
                      </div>
                      <p className="text-foreground">Hey John, today focus on task 2. Deadline is EOD</p>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                      alt="Musfiq"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>

                  {/* Intern Message */}
                  <div className="flex items-start gap-3">
                    <img
                      src={intern.avatar}
                      alt={intern.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="bg-accent/50 rounded-xl p-4 max-w-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-primary">John Doe</span>
                        <span className="text-xs text-muted-foreground">10:40 AM</span>
                      </div>
                      <p className="text-foreground">Sure, will update the task as completed when done.</p>
                    </div>
                  </div>

                  {/* Supervisor Message */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary/10 rounded-xl p-4 max-w-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-primary">Musfiq</span>
                        <span className="text-xs text-muted-foreground">10:54 AM</span>
                      </div>
                      <p className="text-foreground">Submit daily report too.</p>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                      alt="Musfiq"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Write a message to this Intern..."
                    className="min-h-[100px] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach
                      </Button>
                      <Button variant="outline" size="sm">
                        Task Link
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                    <Button className="gradient-primary text-primary-foreground">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>

              {/* Conversation Context */}
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4">Conversation Context</h3>

                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Pinned Messages</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Focus on task of login page UI.</li>
                        <li>Need help with APIs</li>
                        <li>Add form validation for email and password fields.</li>
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-2">Linked Items</h4>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                        <li>Task 12 - Landing Page fixes</li>
                        <li>Leave 5 Nov, 2025 - 8, Nov, 2025 Approved</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
