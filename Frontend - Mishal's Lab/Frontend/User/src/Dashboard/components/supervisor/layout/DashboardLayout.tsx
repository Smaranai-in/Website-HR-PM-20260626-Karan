import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Chatbot } from "../chatbot/Chatbot";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-purple-50">
      <Sidebar />
      <div className="ml-[220px]">
        <Header title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
