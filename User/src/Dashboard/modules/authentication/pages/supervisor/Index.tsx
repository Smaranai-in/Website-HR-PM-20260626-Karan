import { DashboardLayout } from "Dashboard/components/supervisor/layout/DashboardLayout";
import { StatCard } from "Dashboard/components/supervisor/dashboard/StatCard";
import { TaskProgressChart } from "Dashboard/components/supervisor/dashboard/TaskProgressChart";
import { AttendanceStatus } from "Dashboard/components/supervisor/dashboard/AttendanceStatus";
import { ActivityLog } from "Dashboard/components/supervisor/dashboard/ActivityLog";
import { DailyReportChart } from "Dashboard/components/supervisor/dashboard/DailyReportChart";
import { NotificationsList } from "Dashboard/components/supervisor/dashboard/NotificationsList";
import { Button } from "Dashboard/components/ui/button";
import { Download, Users, ClipboardList, CheckCircle, FileText, AlertTriangle, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout title="Dashboard">
      {/* Quick Stats Section */}
      <section className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Quick Stats
              </h2>
              <p className="text-sm text-gray-500">
                Today's summary
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl border-gray-200"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <StatCard
              icon={Users}
              value={53}
              label="Total Intern Assigned"
              change="+8% from yesterday"
              changeType="positive"
              variant="purple"
            />
            <StatCard
              icon={ClipboardList}
              value={26}
              label="Task Assigned"
              change="0.5% from yesterday"
              variant="blue"
            />
            <StatCard
              icon={CheckCircle}
              value={8}
              label="Task completed"
              change="0.5% from yesterday"
              variant="green"
            />
            <StatCard
              icon={FileText}
              value={8}
              label="Daily Report Submitted"
              change="0.5% from yesterday"
              variant="purple"
            />
            <StatCard
              icon={AlertTriangle}
              value={12}
              label="Over Due Tasks"
              change="0.5% from yesterday"
              changeType="negative"
              variant="red"
            />
            <StatCard
              icon={TrendingUp}
              value="82%"
              label="Avg. Productivity Score"
              change="0.5% from yesterday"
              changeType="positive"
              variant="teal"
            />
          </div>

        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Activity */}
        <div className="lg:col-span-2 space-y-6">
          <TaskProgressChart />
          <ActivityLog />
        </div>

        {/* Right Column - Attendance, Daily Report, Notifications */}
        <div className="space-y-6">
          <AttendanceStatus />
          <DailyReportChart />
          <NotificationsList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
