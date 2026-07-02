import { useState, useEffect } from "react";
import { AttendanceChart } from "../../../../components/dashboard/AttendanceChart";
import { WeeklyAISummary } from "../../../../components/dashboard/WeeklyAISummary";
import { RecentActivity } from "../../../../components/dashboard/RecentActivity";
import { UpcomingInterviews } from "../../../../components/dashboard/UpcomingInterviews";
import { OnboardingProgress } from "../../../../components/dashboard/OnboardingProgress";
import { Notifications } from "../../../../components/dashboard/Notifications";
import { LeaveRequestDialog } from "../../../../components/dashboard/LeaveRequestDialog";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Users, UserCheck, Briefcase, Award, Clock, Upload, Calendar } from "lucide-react";
import { supabase } from "../../../../../supabaseClient";

const HRStatCard = ({
  icon: Icon,
  label,
  value,
  change,
  variant,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  variant: "blue" | "cyan" | "teal" | "gray" | "red" | "orange" | "pink";
}) => {
  const variants = {
    blue: "bg-gradient-to-br from-blue-400 to-blue-500",
    cyan: "bg-gradient-to-br from-cyan-400 to-cyan-500",
    teal: "bg-gradient-to-br from-teal-400 to-teal-500",
    gray: "bg-gradient-to-br from-slate-300 to-slate-400",
    red: "bg-gradient-to-br from-red-400 to-red-500",
    orange: "bg-gradient-to-br from-orange-400 to-orange-500",
    pink: "bg-gradient-to-br from-pink-400 to-pink-500",
  };

  return (
    <div className={`${variants[variant]} rounded-xl p-4 text-white`}>
      <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
        <Icon className="h-4 w-4" />
      </div>

      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>

      <div
        className={`text-xs mt-1 ${change.includes("-") ? "text-red-200" : "text-green-200"
          }`}
      >
        {change}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<any>(null);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const fetchLeaveRequests = async () => {
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
        body: JSON.stringify({ action: "get_all_leaves" })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        // filter for pending requests only
        const pending = (result.leaves || []).filter((l: any) => l.status === "Pending");
        setLeaveRequests(pending);
      }
    } catch (e) {
      console.error("Error fetching leave requests:", e);
    } finally {
      setLoadingLeaves(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleViewLeaveRequest = (request: any) => {
    setSelectedLeaveRequest(request);
    setLeaveDialogOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        {/* Quick Stats Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick Stats</h2>
            <p className="text-sm text-muted-foreground">Today's summary</p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl border-gray-200">
            <Upload className="h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
          <HRStatCard
            icon={Users}
            value="53"
            label="Total Hired Interns"
            change="+5% from yesterday"
            variant="blue"
          />
          <HRStatCard
            icon={Users}
            value="26"
            label="Active Interns"
            change="0.5% from yesterday"
            variant="cyan"
          />
          <HRStatCard
            icon={UserCheck}
            value="8"
            label="Managers"
            change="0.5% from yesterday"
            variant="teal"
          />
          <HRStatCard
            icon={Briefcase}
            value="8"
            label="Projects"
            change="0.5% from yesterday"
            variant="orange"
          />
          <HRStatCard
            icon={Award}
            value="12"
            label="Pending Certificates"
            change="0.5% from yesterday"
            variant="gray"
          />
          <HRStatCard
            icon={Clock}
            value="82%"
            label="Avg. Attendance"
            change="0.5% from yesterday"
            variant="pink"
          />
        </div>
      </div>
      {/* end of stat grid */}


      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Charts & Activity */}
        <div className="xl:col-span-2 space-y-7">
          <AttendanceChart />
          <RecentActivity />

          {/* Leave Applications Section */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Leave Applications</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingLeaves ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  Loading leaves...
                </div>
              ) : leaveRequests.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  No pending leave requests.
                </div>
              ) : (
                leaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => handleViewLeaveRequest(request)}
                  >
                    <div>
                      <p className="font-medium text-foreground">{request.w_users?.name || "Intern"}</p>
                      <p className="text-sm text-muted-foreground">{request.leave_type} • {request.start_date} - {request.end_date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-primary">Review</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summaries & Progress */}
        <div className="space-y-7">
          <WeeklyAISummary />
          <UpcomingInterviews />
          <OnboardingProgress />
          <Notifications />
        </div>
      </div>

      {/* Leave Request Dialog */}
      <LeaveRequestDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        request={selectedLeaveRequest}
        onSuccess={fetchLeaveRequests}
      />
    </>
  );
}
