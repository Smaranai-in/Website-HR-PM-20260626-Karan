import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown, Menu } from "lucide-react";
const musfiq = "/avatars/musfiq.jpg";

type NavbarProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
};

export default function Navbar({ setIsOpen, title }: NavbarProps) {
  const location = useLocation();

  const deriveTitle = (pathname: string) => {
    if (!pathname || pathname === "/" || pathname === "/program-manager") {
      return "Dashboard";
    }

    const parts = pathname.split("/").filter(Boolean);
    const section = parts[1] || parts[0] || "";

    const map: Record<string, string> = {
      dashboard: "Dashboard",
      supervisors: "Supervisors",
      interns: "Interns",
      escalations: "Escalations",
      performance: "Performance",
      reports: "Reports",
      "ai-config": "AI Config",
      settings: "Settings",
    };

    if (map[section]) return map[section];

    return section
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const displayedTitle = title || deriveTitle(location.pathname);

  return (
    <header className="w-full bg-white border-b border-[#E5E7EB] px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between gap-4">

      <div className="flex items-center gap-4 min-w-0">
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-[#0F172A] truncate">
          {displayedTitle}
        </h1>
      </div>

      <div className="hidden md:block flex-1 max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6366F1]"
          />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full h-10 pl-11 pr-4 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#74B1E9]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden lg:flex items-center gap-2 text-sm cursor-pointer">
          <img
            src="https://flagcdn.com/w20/us.png"
            alt="US"
            className="w-5 h-5 rounded-full"
          />
          <span className="font-medium">Eng (US)</span>
          <ChevronDown size={14} />
        </div>

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-[#FCA5A5] flex items-center justify-center hover:bg-gray-50 transition cursor-pointer">
          <Bell size={18} className="text-[#F97316]" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <img
            src={musfiq}
            alt="Profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover"
          />
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold">Musfiq V</p>
            <p className="text-xs text-gray-500">Program Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}