import { useState } from "react";
import { DashboardLayout } from "../../../../components/supervisor/layout/DashboardLayout";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { ChevronLeft, ChevronRight, Star, Download } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const topPerformers = [
  { id: "1", name: "Priya Verma", role: "Web Intern", rating: 5, avatar: "" },
  { id: "2", name: "John Doe", role: "Web Intern", rating: 4.5, avatar: "" },
  { id: "3", name: "Shantanu Sharma", role: "AI Intern", rating: 4.5, avatar: "" },
  { id: "4", name: "Ravi Kumar", role: "Design Intern", rating: 4, avatar: "" },
  { id: "5", name: "Tejas Joshi", role: "Web Intern", rating: 4, avatar: "" },
  { id: "6", name: "Ravi Kumar", role: "Design Intern", rating: 4, avatar: "" },
  { id: "7", name: "Ravi Kumar", role: "Design Intern", rating: 4, avatar: "" },
];

const deadlinesData = [
  { name: "Hit", value: 75, color: "#86EFAC" },
  { name: "Missed", value: 25, color: "#FCA5A5" },
];

const productivityData = [
  { day: "DAY 1", value: 45 },
  { day: "DAY 2", value: 52 },
  { day: "DAY 3", value: 38 },
  { day: "DAY 4", value: 70 },
  { day: "DAY 5", value: 65 },
  { day: "DAY 6", value: 75 },
  { day: "DAY 7", value: 48 },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
};

const ConsistencyGauge = ({ score }: { score: number }) => {
  const rotation = (score / 100) * 180 - 90;
  
  return (
    <div className="relative w-48 h-28 mx-auto">
      <svg viewBox="0 0 200 120" className="w-full h-full">
        {/* Background arc segments */}
        <path
          d="M 20 100 A 80 80 0 0 1 60 35"
          fill="none"
          stroke="#EF4444"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 65 30 A 80 80 0 0 1 135 30"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M 140 35 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#22C55E"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Needle */}
        <g transform={`rotate(${rotation}, 100, 100)`}>
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="35"
            stroke="#6B7280"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="8" fill="#6B7280" />
        </g>
      </svg>
      {/* Circle outline */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="w-40 h-40 border-4 border-blue-200 rounded-full absolute -bottom-12 opacity-50" />
      </div>
    </div>
  );
};

export default function PerformancePage() {
  const [currentDate, setCurrentDate] = useState("5 Nov, 2025");

  return (
    <DashboardLayout title="Performance">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Performance Overview</h1>
          <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipisci</p>
          
          {/* Date Picker */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5">
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-sm font-medium">{currentDate}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performers */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
              <Button variant="outline" size="sm" className="text-xs">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
              {topPerformers.map((performer) => (
                <div key={performer.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={performer.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                        {performer.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{performer.name}</p>
                      <p className="text-xs text-muted-foreground">{performer.role}</p>
                    </div>
                  </div>
                  <StarRating rating={performer.rating} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Deadlines */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deadlinesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {deadlinesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-300" />
                  <span className="text-sm">Hit (75%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-300" />
                  <span className="text-sm">Missed(25%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productivity Graph & Consistency Score */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Productivity Graph</CardTitle>
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Download className="h-3 w-3" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productivityData}>
                      <XAxis 
                        dataKey="day" 
                        tick={{ fontSize: 10 }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }} 
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 80]}
                        ticks={[10, 20, 30, 40, 50, 60, 70, 80]}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="#60A5FA" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Consistency Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ConsistencyGauge score={70} />
                <p className="text-center text-sm text-muted-foreground mt-2">Score</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Task Completion Rate */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Task Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full relative"
                    style={{ width: '75%' }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow" />
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold">75%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
