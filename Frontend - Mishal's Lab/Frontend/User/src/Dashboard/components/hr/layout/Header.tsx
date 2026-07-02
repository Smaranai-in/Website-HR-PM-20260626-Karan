import { Search, Bell, ChevronDown, Globe } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Title */}
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search here..."
            className="w-64 pl-10 bg-secondary border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Language Selector */}
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
          <Globe className="h-4 w-4" />
          <span className="text-sm">Eng (US)</span>
          <ChevronDown className="h-3 w-3" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-primary bg-stat-blue rounded-lg">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
            <AvatarFallback>MF</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground flex items-center gap-1">
              Musfiq
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </span>
            <span className="text-xs text-muted-foreground">HR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
