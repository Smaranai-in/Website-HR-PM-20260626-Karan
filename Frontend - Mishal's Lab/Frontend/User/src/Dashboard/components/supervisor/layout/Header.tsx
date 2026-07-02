import { useState } from "react";
import { Search, Bell, ChevronDown, Video, CalendarPlus } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { StartMeetingDialog } from "../meetings/StartMeetingDialog";
import { ScheduleMeetingDialog } from "../meetings/ScheduleMeetingDialog";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [startMeetingOpen, setStartMeetingOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  return (
    <>
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-background border-b border-border">
      {/* Title */}
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search here..."
            className="pl-10 w-[280px] bg-card border-border rounded-full"
          />
        </div>

        {/* Language */}
        <Button variant="ghost" className="flex items-center gap-2 text-sm">
          <span className="text-lg">🇺🇸</span>
          <span>Eng (US)</span>
          <ChevronDown className="h-4 w-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-status-error rounded-full" />
        </Button>

        {/* Quick Meeting Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setStartMeetingOpen(true)}>
            <Video className="h-4 w-4" />
            Start
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setScheduleMeetingOpen(true)}>
            <CalendarPlus className="h-4 w-4" />
            Schedule
          </Button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="h-10 w-10 rounded-full bg-smaran-blue overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
              alt="User" 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-sm">
            <div className="flex items-center gap-1 font-medium">
              Musfiq <ChevronDown className="h-3 w-3" />
            </div>
            <div className="text-muted-foreground text-xs">Supervisor</div>
          </div>
        </div>
      </div>
    </header>
    <StartMeetingDialog open={startMeetingOpen} onOpenChange={setStartMeetingOpen} />
    <ScheduleMeetingDialog open={scheduleMeetingOpen} onOpenChange={setScheduleMeetingOpen} />
    </>
  );
}
