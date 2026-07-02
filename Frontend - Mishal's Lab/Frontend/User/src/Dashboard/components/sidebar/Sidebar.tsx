import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  User,
  AlertTriangle,
  LineChart,
  FileText,
  Bot,
  Settings,
  LogOut,
  X,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navItems = [
    { to: "/program-manager", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/program-manager/supervisors", icon: Users, label: "Supervisors" },
    { to: "/program-manager/interns", icon: User, label: "Interns" },
    { to: "/program-manager/escalations", icon: AlertTriangle, label: "Escalations" },
    { to: "/program-manager/performance", icon: LineChart, label: "Performance" },
    { to: "/program-manager/reports", icon: FileText, label: "Reports" },
    { to: "/program-manager/ai-config", icon: Bot, label: "AI Config" },
    { to: "/program-manager/settings", icon: Settings, label: "Settings" },
    { to: "/program-manager/logout", icon: LogOut, label: "Logout" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 min-h-screen bg-white border-r flex-col p-6">
        <Logo />

        <nav className="mt-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Panel */}
        <div className="relative w-72 bg-white min-h-screen border-r p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <Logo />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavItemMobile
                key={item.to}
                {...item}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

function Logo() {
  return (
    <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-9 h-9 mr-3 object-contain"
      />
      <h1 className="text-xl font-bold text-primary">SmaranAI</h1>
    </Link>
  );
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  const isDashboard = to === "/program-manager";

  return (
    <NavLink
      to={to}
      end={isDashboard}   // 🔥 THIS FIXES IT
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition
        ${isActive
          ? "bg-[#74B1E9] text-white"
          : "text-[#667085] hover:bg-gray-100"
        }`
      }
    >
      <Icon size={18} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function NavItemMobile({ to, icon: Icon, label, onClick }: NavItemProps & { onClick: () => void }) {
  const isDashboard = to === "/program-manager";

  return (
    <NavLink
      to={to}
      onClick={onClick}
      end={isDashboard}   // 🔥 add this
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition w-full
        ${isActive
          ? "bg-[#74B1E9] text-white"
          : "text-[#334155] hover:bg-gray-100"
        }`
      }
    >
      <Icon size={16} />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}