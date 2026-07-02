import { Users, Calendar, CheckCircle, FileText, AlertTriangle, TrendingUp, Download } from "lucide-react";
import { Button } from "../ui/button";

const stats = [
  { 
    icon: Users, 
    value: "15", 
    label: "Total Task Assigned", 
    change: "+2 new this week", 
    changeColor: "text-primary",
    bgColor: "bg-blue-50",
    iconColor: "text-primary"
  },
  { 
    icon: Calendar, 
    value: "92%", 
    label: "Attendance (This Month)", 
    change: "+5% from Last Week", 
    changeColor: "text-primary",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500"
  },
  { 
    icon: CheckCircle, 
    value: "8", 
    label: "Task completed", 
    change: "67% Completed", 
    changeColor: "text-success",
    bgColor: "bg-green-50",
    iconColor: "text-success"
  },
  { 
    icon: FileText, 
    value: "4", 
    label: "Daily Report Submitted", 
    change: "+5% from Last Week", 
    changeColor: "text-primary",
    bgColor: "bg-blue-50",
    iconColor: "text-primary"
  },
  { 
    icon: AlertTriangle, 
    value: "12", 
    label: "Over Due Tasks", 
    change: "0.5% from Last Week", 
    changeColor: "text-destructive",
    bgColor: "bg-red-50",
    iconColor: "text-destructive"
  },
  { 
    icon: TrendingUp, 
    value: "82%", 
    label: "Avg. Productivity Score", 
    change: "-2% from Last Week", 
    changeColor: "text-destructive",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-500"
  },
];

const QuickStats = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quick Stats</h2>
          <p className="text-sm text-muted-foreground">This Week's summary</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-4`}>
            <stat.icon className={`w-6 h-6 ${stat.iconColor} mb-2`} />
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-xs ${stat.changeColor} mt-1`}>{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
