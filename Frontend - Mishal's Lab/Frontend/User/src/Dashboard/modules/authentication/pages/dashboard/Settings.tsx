import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import ChatbotButton from "../../../../components/ChatbotButton";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../components/ui/dialog";
import { Textarea } from "../../../../components/ui/textarea";
import { Input } from "../../../../components/ui/input";
import { Progress } from "../../../../components/ui/progress";
import { Separator } from "../../../../components/ui/separator";
import { Calendar } from "../../../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../components/ui/popover";
import { User, Bell, Shield, LogOut, UserMinus, Upload, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "../../../../lib/utils";

const Settings = () => {
  const [resignDialogOpen, setResignDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex min-h-screen bg-purple-50">
      <DashboardSidebar activeItem="Settings" />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <Input defaultValue="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <Input defaultValue="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <Input defaultValue="" className="mt-1" />
                </div>
                <Button className="w-full">Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Task Reminders</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Reports</span>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">New Password</label>
                  <Input type="password" placeholder="••••••••" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" className="mt-1" />
                </div>
                <Button className="w-full">Update Password</Button>
              </CardContent>
            </Card>

            {/* Resign Internship */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <UserMinus className="w-5 h-5 text-destructive" />
                </div>
                <CardTitle className="text-lg">Resign Internship</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you wish to end your internship, please submit a resignation request. This action requires approval from your supervisor.
                </p>
                <Dialog open={resignDialogOpen} onOpenChange={setResignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <LogOut className="w-4 h-4 mr-2" />
                      Submit Resignation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <UserMinus className="w-5 h-5" />
                        Resign Internship
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium">Reason for Resignation</label>
                        <Textarea 
                          placeholder="Reason" 
                          className="mt-1 min-h-[80px]"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Last Working Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal mt-1",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Select Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">Final Submission (Required)</h3>
                        <Separator className="my-2" />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-3">Task Status Summary</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Completed : 8</span>
                              <span className="text-muted-foreground">80%</span>
                            </div>
                            <Progress value={80} className="h-1" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>In Progress : 5</span>
                              <span className="text-muted-foreground">100%</span>
                            </div>
                            <Progress value={100} className="h-1" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>Pending : 2</span>
                              <span className="text-muted-foreground">80%</span>
                            </div>
                            <Progress value={80} className="h-1" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Upload Final Internship Report</label>
                        <Button variant="default" size="sm" className="mt-2 bg-primary">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Additional Notes/ Handover Info</label>
                        <Textarea 
                          placeholder="Notes..." 
                          className="mt-1 min-h-[80px]"
                        />
                      </div>

                      <div className="flex justify-center gap-3 pt-4">
                        <Button className="bg-primary hover:bg-primary/90">
                          Submit Resignation
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setResignDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <ChatbotButton />
    </div>
  );
};

export default Settings;
