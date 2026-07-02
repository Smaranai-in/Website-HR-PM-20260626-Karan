import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { logout } from "../../lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ListTodo, 
  FileText, 
  TrendingUp, 
  FolderOpen, 
  Settings, 
  LogOut 
} from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/dashboard" },
  { icon: Users, label: "Attendance", path: "/dashboard/attendance" },
  { icon: ListTodo, label: "My Tasks", path: "/dashboard/my-tasks" },
  { icon: FileText, label: "Daily Report", path: "/dashboard/daily-report" },
  { icon: TrendingUp, label: "Performance", path: "/dashboard/performance" },
  { icon: FolderOpen, label: "Documents", path: "/dashboard/documents" },
  { icon: FileText, label: "My Page", path: "/mypage" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

interface DashboardSidebarProps {
  activeItem?: string;
}

const DashboardSidebar = ({ activeItem }: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (item: typeof menuItems[0]) => {
    if (activeItem) return item.label === activeItem;
    return location.pathname === item.path;
  };

  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col">
      <div className="p-4 flex justify-center">
        <Logo />
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
              isActive(item)
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-3 border-t border-border">
        <button onClick={() => logout()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
