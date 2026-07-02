import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Calendar, FileEdit, Upload, Plus, Star } from "lucide-react";
import ChatbotButton from "../../../../components/ChatbotButton";

const DailyReport = () => {
  const submissionHistory = [
    {
      date: "3 Nov, 2025",
      summary: "Fixed the responsive layout issues on the Supervisor Dashboard and integrated the...",
      hours: "8 hrs",
      issues: "1 Blocker",
      status: "Pending",
      score: null,
      feedback: "No feedback yet",
    },
    {
      date: "2 Nov, 2025",
      summary: "Drafted 5 LinkedIn posts for the upcoming product launch and analyzed last week's...",
      hours: "7 hrs",
      issues: "None",
      status: "Received",
      score: 4,
      feedback: "View Details",
    },
    {
      date: "2 Nov, 2025",
      summary: "Drafted 5 LinkedIn posts for the upcoming product launch and analyzed last week's...",
      hours: "7 hrs",
      issues: "None",
      status: "Received",
      score: 4,
      feedback: "View Details",
    },
  ];

  const renderStars = (score: number | null) => {
    if (!score) return "-";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-purple-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Daily Report" />
        
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Daily Report Submission</h1>
            <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
          </div>

          {/* New Report Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileEdit className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">New Report</h2>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Calendar className="w-4 h-4" />
                <span>Today: 5 Nov, 2025</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Task Completed Today */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3">Task Completed Today</h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Select>
                          <SelectTrigger className="flex-1 bg-slate-50">
                            <SelectValue placeholder="Select Assigned Task" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="task1">Create Login Page</SelectItem>
                            <SelectItem value="task2">Dashboard Design</SelectItem>
                            <SelectItem value="task3">API Integration</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="7 hrs" className="w-24 bg-slate-50" />
                      </div>
                      <div className="flex gap-3">
                        <Select>
                          <SelectTrigger className="flex-1 bg-slate-50">
                            <SelectValue placeholder="Select Assigned Task" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="task1">Create Login Page</SelectItem>
                            <SelectItem value="task2">Dashboard Design</SelectItem>
                            <SelectItem value="task3">API Integration</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="7 hrs" className="w-24 bg-slate-50" />
                      </div>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                        <Plus className="w-4 h-4 mr-2" />
                        Add another Task
                      </Button>
                    </div>
                  </div>

                  {/* Total Hours Worked */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3">Total Hours Worked</h3>
                    <Input placeholder="7 Hours" className="bg-slate-50" />
                  </div>

                  {/* Attach Work Samples */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3">Attach Work Samples / Screenshots</h3>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-foreground font-medium">Click to upload or drag & drop</p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or PDF (Max 10MB)</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Report Summary */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3">Report Summary/ Description</h3>
                    <Textarea 
                      placeholder="Fixed the responsive layout issues on the Supervisor Dashboard and integrated the new login API."
                      className="bg-slate-50 min-h-[100px]"
                    />
                  </div>

                  {/* Issue / Blockers */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3">Issue / Blockers</h3>
                    <Textarea 
                      placeholder="Waiting for confirmation on typography style for mobile view on the login page."
                      className="bg-slate-50 min-h-[80px]"
                    />
                  </div>

                  {/* Plan For Tomorrow */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3">Plan For Tomorrow</h3>
                    <Textarea 
                      placeholder="Finalize the Profile page high-fidelity mockups."
                      className="bg-slate-50 min-h-[80px]"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                      Submit Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission History */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Submission History</h2>
              
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground font-semibold">Date</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Report summary</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Hours</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Issues</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Score</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionHistory.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{row.summary}</TableCell>
                      <TableCell>{row.hours}</TableCell>
                      <TableCell className={row.issues !== "None" ? "text-primary font-medium" : ""}>
                        {row.issues}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          row.status === "Pending" 
                            ? "bg-yellow-100 text-yellow-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell>{renderStars(row.score)}</TableCell>
                      <TableCell>
                        {row.feedback === "View Details" ? (
                          <span className="text-primary cursor-pointer hover:underline">{row.feedback}</span>
                        ) : (
                          <span className="text-muted-foreground">{row.feedback}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default DailyReport;
