import { Toaster } from "Dashboard/components/ui/toaster";
import { Toaster as Sonner } from "Dashboard/components/ui/sonner";
import { TooltipProvider } from "Dashboard/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "Dashboard/components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import Attendance from "./pages/dashboard/Attendance";
import MyTasks from "./pages/dashboard/MyTasks";
import TaskDetails from "./pages/dashboard/TaskDetails";
import DailyReport from "./pages/dashboard/DailyReport";
import Performance from "./pages/dashboard/Performance";
import Documents from "./pages/dashboard/Documents";
import Settings from "./pages/dashboard/Settings";
// HR Pages
import HRDashboard from "./pages/hr/Dashboard";
import HRApplicants from "./pages/hr/Applicants";
import HRUsers from "./pages/hr/Users";
import HRAttendance from "./pages/hr/Attendance";
import InternDetails from "./pages/hr/InternDetails";
import HRCertificates from "./pages/hr/Certificates";
import HRReports from "./pages/hr/Reports";
import AIConfig from "./pages/hr/AIConfig";
import { DashboardLayout } from "Dashboard/components/layout/DashboardLayout";
// Supervisor Pages
import SupervisorDashboard from "./pages/supervisor/Index";
import SupervisorInterns from "./pages/supervisor/Interns";
import SupervisorInternDetails from "./pages/supervisor/InternDetails";
import SupervisorAttendance from "./pages/supervisor/InternsAttendance";
import SupervisorTasks from "./pages/supervisor/Tasks";
import SupervisorReports from "./pages/supervisor/Reports";
import SupervisorPerformance from "./pages/supervisor/Performance";
import SupervisorSettings from "./pages/supervisor/Settings";
// AI Interview Pages
import AIInterviewPage from "./pages/ai-interview/Index";
// Certificates Pages
import CertificatesPage from "./pages/certificates/Index";
// Program Manager nested app
import PMDashboard from "./pages/program-manager/Dashboard";
import PMSupervisors from "./pages/program-manager/Supervisors";
import PMInterns from "./pages/program-manager/Interns";
import PMEscalations from "./pages/program-manager/Escalations";
import PMPerformance from "./pages/program-manager/Performance";
import PMReports from "./pages/program-manager/Reports";
import PMAIConfig from "./pages/program-manager/AIConfig";
import PMSupervisorProfile from "./pages/program-manager/SupervisorProfile";
import ProgramManagerLayout from "Dashboard/components/program-manager/ProgramManagerLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<Verify />} />

        {/* Intern Dashboard Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <Attendance />
          </ProtectedRoute>
        } />
        <Route path="/my-tasks" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <MyTasks />
          </ProtectedRoute>
        } />
        <Route path="/task-details" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <TaskDetails />
          </ProtectedRoute>
        } />
        <Route path="/daily-report" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <DailyReport />
          </ProtectedRoute>
        } />
        <Route path="/performance" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <Performance />
          </ProtectedRoute>
        } />
        <Route path="/documents" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <Documents />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={["intern"]}>
            <Settings />
          </ProtectedRoute>
        } />

        {/* HR Dashboard Routes */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HRDashboard />} />
          <Route path="applicants" element={<HRApplicants />} />
          <Route path="users" element={<HRUsers />} />
          <Route path="attendance" element={<HRAttendance />} />
          <Route path="attendance/:id" element={<InternDetails />} />
          <Route path="certificates" element={<HRCertificates />} />
          <Route path="reports" element={<HRReports />} />
          <Route path="ai-config" element={<AIConfig />} />
        </Route>


        {/* Supervisor Dashboard Routes */}
        <Route path="/supervisor" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/interns" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorInterns />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/interns/:id" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorInternDetails />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/attendance" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorAttendance />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/tasks" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorTasks />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/reports" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorReports />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/performance" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorPerformance />
          </ProtectedRoute>
        } />
        <Route path="/supervisor/settings" element={
          <ProtectedRoute allowedRoles={["supervisor"]}>
            <SupervisorSettings />
          </ProtectedRoute>
        } />

        {/* AI Interview Page */}
        <Route path="/ai-interview" element={
          <ProtectedRoute allowedRoles={["ai-interview"]}>
            <AIInterviewPage />
          </ProtectedRoute>
        } />

        {/* Certificates Page */}
        <Route path="/certificates" element={
          <ProtectedRoute allowedRoles={["certificates"]}>
            <CertificatesPage />
          </ProtectedRoute>
        } />

        {/* Program Manager nested app */}
        <Route
          path="/program-manager"
          element={
            <ProtectedRoute allowedRoles={["program-manager"]}>
              <ProgramManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PMDashboard />} />
          <Route path="supervisors" element={<PMSupervisors />} />
          <Route path="interns" element={<PMInterns />} />
          <Route path="escalations" element={<PMEscalations />} />
          <Route path="performance" element={<PMPerformance />} />
          <Route path="reports" element={<PMReports />} />
          <Route path="ai-config" element={<PMAIConfig />} />
          <Route path="supervisor/:id" element={<PMSupervisorProfile />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
