import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Clock,
  Award,
  BarChart3,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../../../assets/smaran-logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/hr" },
  { icon: Users, label: "Applicants", path: "/dashboard/hr/applicants" },
  { icon: UserCog, label: "Users", path: "/dashboard/hr/users" },
  { icon: Clock, label: "Attendance", path: "/dashboard/hr/attendance" },
  { icon: Award, label: "Certificates", path: "/dashboard/hr/certificates" },
  { icon: BarChart3, label: "Reports", path: "/dashboard/hr/reports" },
  { icon: Bot, label: "AI Config", path: "/dashboard/hr/ai-config" },
];

const bottomNavItems = [
  { icon: Settings, label: "Settings", path: "/dashboard/hr/settings" },
  { icon: LogOut, label: "Logout", path: "/dashboard/logout" },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard/hr") return location.pathname === "/dashboard/hr";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    window.location.href = "/dashboard/login";
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col p-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8 hover:opacity-80 transition-opacity w-fit">
        <img src={logo} alt="SmaranAI" className="h-10 w-auto" />
        <span className="text-xl font-bold text-primary">SmaranAI</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard/hr"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
              ${isActive
                ? "bg-[#74B1E9] text-white"
                : "text-[#667085] hover:bg-gray-100"
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="pt-6 border-t space-y-2">
        {bottomNavItems.map((item) =>
          item.path === "/logout" ? (
            <button
              key={item.path}
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#667085] hover:bg-gray-100 transition w-full text-left"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#667085] hover:bg-gray-100 transition"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </div>
    </aside>
  );
}