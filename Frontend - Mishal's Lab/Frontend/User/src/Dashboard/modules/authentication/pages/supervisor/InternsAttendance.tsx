import { useState } from "react";
import { DashboardLayout } from "../../../../components/supervisor/layout/DashboardLayout";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Download, Search, Users, UserCheck, Coffee, Clock, WifiOff, ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const filters = ["All", "Web", "UI/UX Design", "AI"];

const summaryStats = [
  { icon: Users, value: 53, label: "Present Today", change: "+5% from yesterday", changeType: "positive", variant: "blue" },
  { icon: UserCheck, value: 42, label: "Active Now", change: "(Stable)", changeType: "neutral", variant: "teal" },
  { icon: Coffee, value: 5, label: "On Break", change: "+5% from yesterday", changeType: "positive", variant: "green" },
  { icon: Clock, value: 2, label: "Late Arrival", change: "-1% from yesterday", changeType: "negative", variant: "orange" },
  { icon: WifiOff, value: 4, label: "Offline", change: "+2% from yesterday", changeType: "positive", variant: "red" },
];

const attendanceData = [
  { id: "1", name: "Priya Verma", role: "Web Intern", date: "5 Nov, 2025", checkIn: "09:30 AM", checkOut: "05:30 PM", breakDuration: "1h 15m (3 Breaks)", netHours: "8h", status: "Active" },
  { id: "2", name: "Shantanu Sharma", role: "Figma Design Intern", date: "5 Nov, 2025", checkIn: "--:--", checkOut: "--:--", breakDuration: "--:--", netHours: "--", status: "On Leave" },
  { id: "3", name: "Tejas Joshi", role: "Web Intern", date: "5 Nov, 2025", checkIn: "09:30 AM", checkOut: "05:30 PM", breakDuration: "1h 15m (3 Breaks)", netHours: "8h", status: "On Break" },
  { id: "4", name: "Ravi Kumar", role: "AI Intern", date: "5 Nov, 2025", checkIn: "09:30 AM", checkOut: "05:30 PM", breakDuration: "1h 15m (3 Breaks)", netHours: "8h", status: "Active" },
  { id: "5", name: "John Doe", role: "Design Intern", date: "5 Nov, 2025", checkIn: "09:30 AM", checkOut: "--:--", breakDuration: "1h 15m (3 Breaks)", netHours: "--", status: "InActive" },
  { id: "6", name: "John Doe", role: "Web Intern", date: "5 Nov, 2025", checkIn: "09:30 AM", checkOut: "05:30 PM", breakDuration: "1h 15m (3 Breaks)", netHours: "8h", status: "Active" },
];

const statusConfig = {
  "Active": { bg: "bg-status-success/10", text: "text-status-success", dot: "bg-status-success" },
  "On Leave": { bg: "bg-status-warning/10", text: "text-status-warning", dot: "bg-status-warning" },
  "On Break": { bg: "bg-status-warning/10", text: "text-status-warning", dot: "bg-status-warning" },
  "InActive": { bg: "bg-status-error/10", text: "text-status-error", dot: "bg-status-error" },
};

const variantClasses = {
  blue: "stat-card-blue",
  green: "stat-card-green",
  orange: "stat-card-orange",
  red: "stat-card-red",
  teal: "stat-card-teal",
};

const iconBgClasses = {
  blue: "bg-smaran-blue/20 text-smaran-blue",
  green: "bg-status-success/20 text-status-success",
  orange: "bg-status-warning/20 text-status-warning",
  red: "bg-status-error/20 text-status-error",
  teal: "bg-smaran-teal/20 text-smaran-teal",
};

export default function InternsAttendancePage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <DashboardLayout title="Interns Attendance">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link to="/supervisor/interns" className="text-muted-foreground hover:text-foreground transition-colors">Interns</Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <Link to="/supervisor/interns" className="text-muted-foreground hover:text-foreground transition-colors">Intern List Log</Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">Intern Attendance</span>
      </div>

      {/* Summary Section */}
      <section className="bg-card rounded-xl p-6 card-shadow mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Summary</h2>
            <p className="text-sm text-muted-foreground">Today's summary</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Today: 5 Nov, 2025
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summaryStats.map((stat, index) => (
            <div key={index} className={`rounded-xl p-4 ${variantClasses[stat.variant as keyof typeof variantClasses]}`}>
              <div className={`h-10 w-10 rounded-lg ${iconBgClasses[stat.variant as keyof typeof iconBgClasses]} flex items-center justify-center mb-3`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className={`text-xs mt-1 ${
                stat.changeType === "positive" ? "text-status-success" : 
                stat.changeType === "negative" ? "text-status-error" : 
                "text-muted-foreground"
              }`}>
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attendance Table Section */}
      <section>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Intern Attendance</h2>
          <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap mb-6">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  activeFilter === filter
                    ? "bg-smaran-blue text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="on-break">On Break</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-[200px]">
            <Input placeholder="Search..." className="pr-10" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-smaran-blue/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Intern Profile</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Check-In</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Check-Out</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Break Duration</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Net Hours</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((intern, index) => {
                  const config = statusConfig[intern.status as keyof typeof statusConfig];
                  return (
                    <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-smaran-blue/20 overflow-hidden">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(intern.name)}&background=0ea5e9&color=fff`}
                              alt={intern.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground block">{intern.name}</span>
                            <span className="text-xs text-muted-foreground">{intern.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{intern.date}</td>
                      <td className="px-6 py-4 text-center text-sm text-foreground">{intern.checkIn}</td>
                      <td className="px-6 py-4 text-center text-sm text-foreground">{intern.checkOut}</td>
                      <td className="px-6 py-4 text-center text-sm text-foreground">{intern.breakDuration}</td>
                      <td className="px-6 py-4 text-center text-sm text-foreground">{intern.netHours}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="secondary" className={`${config.bg} ${config.text} gap-1.5`}>
                          <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                          {intern.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/supervisor/interns/${intern.id}`}>View Details</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
