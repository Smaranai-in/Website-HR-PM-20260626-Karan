import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import { Button } from "../../../../components/ui/button";
import { FileText, TrendingUp, MessageSquare, Lightbulb, Star, Upload } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import ChatbotButton from "../../../../components/ChatbotButton";

const weeklyData = [
  { day: "DAY 1", value: 20 },
  { day: "DAY 2", value: 10 },
  { day: "DAY 3", value: 65 },
  { day: "DAY 4", value: 45 },
  { day: "DAY 5", value: 80 },
  { day: "DAY 6", value: 70 },
  { day: "DAY 7", value: 78 },
];

const dailyReportData = [
  { day: "DAY 1", value: 50 },
  { day: "DAY 2", value: 35 },
  { day: "DAY 3", value: 20 },
  { day: "DAY 4", value: 75 },
  { day: "DAY 5", value: 45 },
  { day: "DAY 6", value: 55 },
  { day: "DAY 7", value: 70 },
];

const feedbackHistory = [
  { month: "Nov, 2025", summary: "Fixed the responsive layout issues on the Supervisor Dashboard and integrated the.." },
  { month: "Oct, 2025", summary: "Drafted 5 LinkedIn posts for the upcoming product launch and analyzed last week's..." },
];

const Performance = () => {
  return (
    <div className="flex h-screen bg-purple-50">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Performance" />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Summary Section */}
          <div className="bg-card rounded-xl p-6 border border-border mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-primary font-semibold text-lg">Summary</h2>
                <p className="text-sm text-muted-foreground">This Month's summary</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="w-4 h-4" />
                Export
              </Button>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-slate-100 rounded-xl p-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">Task Completion</p>
                <p className="text-xs text-primary">+5% from Last Month</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold">7.2 H</p>
                <p className="text-sm text-muted-foreground">Productivity Score</p>
                <p className="text-xs text-green-600">(Stable)</p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold">4.5</p>
                <div className="flex gap-0.5 my-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />
                </div>
                <p className="text-sm text-muted-foreground">Communication</p>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl font-bold">4.2</p>
                <div className="flex gap-0.5 my-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-3 h-3 text-yellow-400" />
                </div>
                <p className="text-sm text-muted-foreground">Learning & Initiative</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold">4.5</p>
                <div className="flex gap-0.5 my-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />
                </div>
                <p className="text-sm text-primary">Overall Score</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Productivity Trends */}
            <div className="col-span-2 bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Productivity Trends (Weekly)</h3>
                  <p className="text-sm text-muted-foreground">Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</p>
                </div>
                <Button variant="outline" size="sm">This week ▼</Button>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Completion Rates */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Completion Rates</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On-Time Delivery</span>
                    <span>80%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "80%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality (Bug Free)</span>
                    <span>50%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "50%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Documentation</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs">
                  <span className="font-semibold">Supervisor Note: </span>
                  "Great Consistency This Week, Try To Improve Documentation Detail For Next Sprint."
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Task Completion Rate */}
            <div className="col-span-2 bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Task Completion Rate</h3>
                <span className="font-semibold">75%</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full">
                <div className="absolute h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full" style={{ width: "75%" }} />
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white top-1/2 -translate-y-1/2" style={{ left: "73%" }} />
              </div>
            </div>
            
            {/* Daily Report Chart */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Daily Report</h3>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Export
                </Button>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyReportData}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} />
                    <YAxis axisLine={false} tickLine={false} fontSize={10} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Monthly Feedback History */}
            <div className="col-span-2 bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Monthly Feedback History</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="pb-3">Month</th>
                    <th className="pb-3">Feedback summary</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackHistory.map((item, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="py-3 text-sm">{item.month}</td>
                      <td className="py-3 text-sm text-muted-foreground">{item.summary}</td>
                      <td className="py-3">
                        <Button variant="ghost" size="sm" className="text-red-500 gap-1">
                          <FileText className="w-4 h-4" />
                          Download PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Consistency Score */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Consistency Score</h3>
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-24">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="50"
                      y1="50"
                      x2="70"
                      y2="25"
                      stroke="#1e3a5f"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="4" fill="#1e3a5f" />
                  </svg>
                </div>
                <p className="text-muted-foreground mt-2">Score</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <ChatbotButton />
    </div>
  );
};

export default Performance;
