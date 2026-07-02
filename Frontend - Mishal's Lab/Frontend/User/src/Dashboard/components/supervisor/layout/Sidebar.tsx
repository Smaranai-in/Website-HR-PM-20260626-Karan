import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ListTodo,
  FileText,
  TrendingUp,
  Settings,
  LogOut
} from "lucide-react";
import smaranLogo from "../../../assets/smaran-logo.png";
import { logout } from "../../../lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/supervisor" },
  { icon: Users, label: "Interns", path: "/dashboard/supervisor/interns" },
  { icon: ListTodo, label: "Tasks", path: "/dashboard/supervisor/tasks" },
  { icon: FileText, label: "Reports", path: "/dashboard/supervisor/reports" },
  { icon: TrendingUp, label: "Performance", path: "/dashboard/supervisor/performance" },
  { icon: Settings, label: "Settings", path: "/dashboard/supervisor/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center justify-center py-6 px-4 hover:opacity-80 transition-opacity">
        <img src={smaranLogo} alt="SmaranAI" className="h-20 w-auto" />
      </Link>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/dashboard/supervisor"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                    ? "bg-[#6FA0D1] text-white shadow-sm"
                    : "text-sidebar-foreground hover:bg-[#6FA0D1]/20"
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-border">
        <button onClick={() => logout()} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 w-full">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
