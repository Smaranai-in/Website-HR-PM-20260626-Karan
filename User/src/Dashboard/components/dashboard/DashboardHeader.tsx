import { Search, Bell, ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface DashboardHeaderProps {
  title?: string;
  userName?: string;
  roleLabel?: string;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "U";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + second).toUpperCase();
}

const DashboardHeader = ({
  title = "Dashboard",
  userName = "John Doe",
  roleLabel = "Web Intern",
}: DashboardHeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search here..." 
              className="pl-10 w-64 bg-muted border-0"
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Eng (US)</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          
          <button className="relative p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
          
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                {userName}
                <ChevronDown className="w-4 h-4" />
              </p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
