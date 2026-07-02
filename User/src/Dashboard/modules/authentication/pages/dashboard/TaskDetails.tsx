import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Textarea } from "../../../../components/ui/textarea";
import { Input } from "../../../../components/ui/input";
import { Calendar, User, Upload, FileText, Sheet, Download } from "lucide-react";
import ChatbotButton from "../../../../components/ChatbotButton";
import { useNavigate } from "react-router-dom";

const TaskDetails = () => {
  const navigate = useNavigate();

  const subTasks = [
    { id: 1, label: "Finalize high-fidelity mockups", completed: true },
    { id: 2, label: "Updated Design System", completed: true },
    { id: 3, label: "Supervise Dashboard design", completed: false },
    { id: 4, label: "Drafted Linkedin Post Frames", completed: false },
  ];

  const attachments = [
    { name: "Report.pdf", type: "pdf" },
    { name: "Sheets_File.sxl", type: "excel" },
  ];

  return (
    <div className="min-h-screen bg-purple-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Task Details" />
        
        <main className="flex-1 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <span 
              className="cursor-pointer hover:text-primary"
              onClick={() => navigate('/my-tasks')}
            >
              My Tasks
            </span>
            <span>{">"}</span>
            <span>Tasks Logs</span>
            <span>{">"}</span>
            <span className="text-foreground font-medium">Create Login Page</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Task Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-2xl font-bold text-foreground">
                      Create Login page for Project 2
                    </h1>
                    <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                      High Priority
                    </span>
                  </div>

                  {/* Task Meta */}
                  <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-primary font-medium">Due: 5 Nov, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Assigned by: <strong>Musfiq (Supervisor)</strong></span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-primary mb-3">Description</h3>
                    <p className="text-muted-foreground mb-4">
                      This task involves creating a responsive login page for the new project dashboard. Please ensure you follow the design system provided in the attachments.
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Implement OAuth integration (Google & GitHub).</li>
                      <li>Ensure mobile responsiveness (Flexbox/Grid).</li>
                      <li>Add form validation for email and password fields.</li>
                    </ul>
                  </div>

                  {/* Sub-Tasks */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-primary mb-3">Sub-Tasks (Progress Checklist)</h3>
                    <div className="space-y-3">
                      {subTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3">
                          <Checkbox 
                            checked={task.completed} 
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <span className={task.completed ? "line-through text-muted-foreground" : "text-foreground"}>
                            {task.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-3">Attachments</h3>
                    <div className="space-y-3">
                      {attachments.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between bg-slate-100 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            {file.type === 'pdf' ? (
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-red-500" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Sheet className="w-5 h-5 text-green-500" />
                              </div>
                            )}
                            <span className="font-medium">{file.name}</span>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="w-5 h-5 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Work Panel */}
            <div className="lg:col-span-1">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Upload className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Submit Work</h2>
                  </div>

                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div>
                      <label className="text-foreground font-medium text-sm mb-2 block">Upload Files</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                        <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-foreground font-medium">Click to upload or drag & drop</p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or PDF (Max 10MB)</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-foreground font-medium text-sm mb-2 block">Submission Link (GitHub / Figma)</label>
                      <Input 
                        placeholder="https://github.com/johndoe/project-repo"
                        className="bg-slate-50"
                      />
                    </div>

                    <div>
                      <label className="text-foreground font-medium text-sm mb-2 block">Notes for Supervisor</label>
                      <Textarea 
                        placeholder="Mention any blockers or specific details about the project implementation"
                        className="bg-slate-50 min-h-[100px]"
                      />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Mark completed & Submitted
                    </Button>
                    
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default TaskDetails;
