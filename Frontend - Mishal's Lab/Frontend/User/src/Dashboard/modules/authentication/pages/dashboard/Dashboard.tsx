import DashboardSidebar from "Dashboard/components/dashboard/DashboardSidebar";
import DashboardHeader from "Dashboard/components/dashboard/DashboardHeader";
import QuickStats from "Dashboard/components/dashboard/QuickStats";
import AttendanceBanner from "Dashboard/components/dashboard/AttendanceBanner";
import TodaysPriorityTask from "Dashboard/components/dashboard/TodaysPriorityTask";
import TodaysAttendance from "Dashboard/components/dashboard/TodaysAttendance";
import TodaysSummary from "Dashboard/components/dashboard/TodaysSummary";
import QuickLinks from "Dashboard/components/dashboard/QuickLinks";
import LatestFeedback from "Dashboard/components/dashboard/LatestFeedback";
import ChatWithSupervisor from "Dashboard/components/dashboard/ChatWithSupervisor";
import LeaveStatus from "Dashboard/components/dashboard/LeaveStatus";
import ScheduledMeeting from "Dashboard/components/dashboard/ScheduledMeeting";
import { Notifications } from "Dashboard/components/dashboard/Notifications";
import ChatbotButton from "Dashboard/components/ChatbotButton";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-purple-50 flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <QuickStats />
          <AttendanceBanner />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <TodaysPriorityTask />
              <TodaysSummary />
              <LatestFeedback />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChatWithSupervisor />
                <div className="space-y-6">
                  <LeaveStatus />
                  <ScheduledMeeting />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <TodaysAttendance />
              <QuickLinks />
              <Notifications />
            </div>
          </div>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default Dashboard;
