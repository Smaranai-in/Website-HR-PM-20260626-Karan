import type { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../hr/layout/Sidebar";
import { Header } from "../hr/layout/Header";

interface DashboardLayoutProps {
  children?: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname === "/hr") return "HR Dashboard";
    if (location.pathname.includes("applicants")) return "Applicants";
    if (location.pathname.includes("users")) return "Users";
    if (location.pathname.includes("attendance")) return "Attendance";
    if (location.pathname.includes("certificates")) return "Certificates";
    if (location.pathname.includes("reports")) return "Reports";
    if (location.pathname.includes("ai-config")) return "AI Config";
    return "HR Panel";
  };

  return (
    <div className="flex min-h-screen bg-purple-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header title={getTitle()} />

        <main className="flex-1 overflow-auto p-6">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};