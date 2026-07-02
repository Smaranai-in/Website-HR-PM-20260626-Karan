import React, { useState, useEffect, useRef } from "react";
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Calendar, Clock, Coffee, Upload, FileDown, Monitor, AlertTriangle, WifiOff, LogIn, Play, Loader2 } from "lucide-react";
import ChatbotButton from "../../../../components/ChatbotButton";
import { supabase } from "../../../../../supabaseClient";
import { useAuthModal } from "../../../../../context/AuthModalContext";
import { toast } from "react-toastify";

const summaryStats = [
  { 
    icon: Monitor, 
    value: "18", 
    label: "Days Present", 
    sublabel: "78% Attendance",
    change: "+5% from Last Month", 
    bgColor: "bg-primary/10",
    iconBg: "bg-primary",
    changeColor: "text-primary"
  },
  { 
    icon: Clock, 
    value: "7.2 H", 
    label: "Avg Net Hours", 
    sublabel: "(Stable)",
    change: "", 
    bgColor: "bg-cyan-50",
    iconBg: "bg-cyan-500",
    changeColor: "text-cyan-600"
  },
  { 
    icon: Coffee, 
    value: "10", 
    label: "Total Breaks", 
    sublabel: "",
    change: "+5% from Last Month", 
    bgColor: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    changeColor: "text-emerald-600"
  },
  { 
    icon: AlertTriangle, 
    value: "2", 
    label: "Late Arrival", 
    sublabel: "",
    change: "-1% from Last Month", 
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-500",
    changeColor: "text-amber-600"
  },
  { 
    icon: WifiOff, 
    value: "4", 
    label: "Offline Days", 
    sublabel: "",
    change: "+2% from Last Week", 
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-500",
    changeColor: "text-rose-600"
  },
];

const attendanceData = [
  { date: "5 Nov, 2025", checkIn: "09:30 AM", breakDuration: "1h 15m (3 Breaks)", checkOut: "--:--", netHours: "8h", status: "Online" },
  { date: "5 Nov, 2025", checkIn: "09:30 AM", breakDuration: "1h 15m (3 Breaks)", checkOut: "05:30 PM", netHours: "8h", status: "Completed" },
  { date: "5 Nov, 2025", checkIn: "09:30 AM", breakDuration: "1h 15m (3 Breaks)", checkOut: "05:30 PM", netHours: "8h", status: "Completed" },
  { date: "5 Nov, 2025", checkIn: "09:30 AM", breakDuration: "1h 15m (3 Breaks)", checkOut: "05:30 PM", netHours: "8h", status: "Late" },
  { date: "5 Nov, 2025", checkIn: "09:30 AM", breakDuration: "1h 15m (3 Breaks)", checkOut: "05:30 PM", netHours: "8h", status: "Completed" },
  { date: "5 Nov, 2025", checkIn: "09:30 AM", breakDuration: "1h 15m (3 Breaks)", checkOut: "05:30 PM", netHours: "8h", status: "Completed" },
];

const todaysAttendance = [
  { time: "09:30 AM", action: "Check-in", icon: LogIn, color: "bg-primary" },
  { time: "11:00 AM", action: "On Break", icon: Coffee, color: "bg-amber-500" },
  { time: "11:30 AM", action: "Resume Work", icon: Play, color: "bg-rose-500" },
  { time: "--:-- PM", action: "Check-out Pending", icon: Clock, color: "bg-muted" },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Online":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">● Online</Badge>;
    case "Completed":
      return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>;
    case "Late":
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Late</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getLeaveStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
    case "Approved":
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Approved</Badge>;
    case "Rejected":
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const Attendance = () => {
  const { user, profile, loadingUser } = useAuthModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [leavesList, setLeavesList] = useState<any[]>([]);
  const [leaveType, setLeaveType] = useState<string>("Sick");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingLeaves, setLoadingLeaves] = useState<boolean>(true);

  const fetchLeaves = async () => {
    const uid = user?.id || profile?.id;
    if (!uid) return;
    setLoadingLeaves(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action: "get_my_leaves" })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setLeavesList(result.leaves || []);
      }
    } catch (e) {
      console.error("Error fetching leaves:", e);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && (user?.id || profile?.id)) {
      fetchLeaves();
    }
  }, [user?.id, profile?.id, loadingUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uid = user?.id || profile?.id;
    if (!uid) {
      toast.error("Please login first.");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `leaves/${uid}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("Interview_Resumes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("Interview_Resumes")
        .getPublicUrl(filePath);

      setAttachmentUrl(data.publicUrl);
      toast.success("Attachment uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyLeave = async () => {
    if (!fromDate || !toDate || !reason.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const uid = user?.id || profile?.id;
    if (!uid) return;

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Please log in again.");

      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          action: "apply_leave",
          leave_type: leaveType,
          start_date: fromDate,
          end_date: toDate,
          reason,
          attachment_url: attachmentUrl || null
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit leave request.");
      }

      toast.success("Leave request submitted successfully!");
      setLeaveType("Sick");
      setFromDate("");
      setToDate("");
      setReason("");
      setAttachmentUrl("");
      fetchLeaves();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex">
      <DashboardSidebar activeItem="Attendance" />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Attendance" />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Summary Section */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-primary">Summary</h2>
              <p className="text-sm text-muted-foreground">This Month's summary</p>
            </div>
            <Button variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {summaryStats.map((stat, index) => (
              <Card key={index} className={`${stat.bgColor} border-0`}>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {stat.sublabel && <p className="text-xs text-muted-foreground">{stat.sublabel}</p>}
                  {stat.change && <p className={`text-xs ${stat.changeColor} mt-1`}>{stat.change}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Attendance Table */}
            <div className="col-span-2">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check-in</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Break Duration</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check-out</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Net Hours</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((row, index) => (
                        <tr key={index} className="border-b border-border last:border-0">
                          <td className="p-4 text-sm">{row.date}</td>
                          <td className="p-4 text-sm">{row.checkIn}</td>
                          <td className="p-4 text-sm">{row.breakDuration}</td>
                          <td className="p-4 text-sm">{row.checkOut}</td>
                          <td className="p-4 text-sm">{row.netHours}</td>
                          <td className="p-4">{getStatusBadge(row.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Today's Attendance */}
            <div>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Today's Attendance</CardTitle>
                      <p className="text-sm text-muted-foreground">Focus on high priority task to stay on track</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">● Online</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">4 Nov, 2025</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {todaysAttendance.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground w-16">{item.time}</span>
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <Badge variant="outline" className="flex items-center gap-1">
                          <item.icon className="w-3 h-3" />
                          {item.action}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                      <LogIn className="w-4 h-4 mr-2" />
                      Check-in
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100">
                        <Coffee className="w-4 h-4 mr-2" />
                        Break
                      </Button>
                      <Button variant="outline">
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100">
                      <Clock className="w-4 h-4 mr-2" />
                      Check-out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leave Management */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center gap-2">
                <FileDown className="w-5 h-5" />
                Leave Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                {/* Apply for Leave */}
                <div>
                  <h3 className="font-semibold mb-1">Apply for Leave</h3>
                  <p className="text-sm text-muted-foreground mb-4">Submit Leave Request for Approval</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Leave Type</label>
                      <Select value={leaveType} onValueChange={setLeaveType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sick Leave" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sick">Sick Leave</SelectItem>
                          <SelectItem value="Casual">Casual Leave</SelectItem>
                          <SelectItem value="Vacation">Vacation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">From Date</label>
                        <div className="relative">
                          <Input 
                            type="date" 
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">To Date</label>
                        <div className="relative">
                          <Input 
                            type="date" 
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Reason for Leave</label>
                      <Textarea 
                        placeholder="I am feeling not well. doctor suggested rest for some days." 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        style={{ display: "none" }} 
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-cyan-50 text-cyan-700"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {attachmentUrl ? "Change Attachment" : "Upload Attachments"}
                      </Button>
                      {attachmentUrl && (
                        <span className="text-xs text-emerald-600 font-semibold truncate max-w-[150px]">
                          ✓ File uploaded
                        </span>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                      onClick={handleApplyLeave}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Submit Leave Request
                    </Button>
                  </div>
                </div>

                {/* Leave History */}
                <div>
                  <h3 className="font-semibold mb-1">Leave History</h3>
                  <p className="text-sm text-muted-foreground mb-4">Track Previously submitted Leave requests</p>
                  
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">From</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">To</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingLeaves ? (
                        <tr>
                          <td colSpan={5} className="text-center p-4 text-sm text-muted-foreground">
                            Loading leaves...
                          </td>
                        </tr>
                      ) : leavesList.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-4 text-sm text-muted-foreground">
                            No leaves found.
                          </td>
                        </tr>
                      ) : (
                        leavesList.map((row, index) => (
                          <tr key={index} className="border-b border-border last:border-0">
                            <td className="p-3 text-sm">{row.start_date}</td>
                            <td className="p-3 text-sm">{row.end_date}</td>
                            <td className="p-3 text-sm">{row.leave_type}</td>
                            <td className="p-3">{getLeaveStatusBadge(row.status)}</td>
                            <td className="p-3 text-sm text-muted-foreground">
                              <div className="flex flex-col gap-1">
                                <span>{row.remarks || "—"}</span>
                                {row.attachment_url && (
                                  <a 
                                    href={row.attachment_url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-cyan-600 hover:underline flex items-center gap-1 text-xs font-semibold"
                                  >
                                    <FileDown className="w-3.5 h-3.5" /> View Attachment
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default Attendance;
