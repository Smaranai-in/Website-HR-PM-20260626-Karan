import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "JAN", value: 40 },
  { month: "FEB", value: 45 },
  { month: "MAR", value: 55 },
  { month: "APR", value: 60 },
  { month: "MAY", value: 48 },
  { month: "JUN", value: 52 },
  { month: "JUL", value: 65 },
  { month: "AUG", value: 70 },
  { month: "SEP", value: 85 },
  { month: "OCT", value: 78 },
  { month: "NOV", value: 90 },
  { month: "DEC", value: 95 },
];

export function AttendanceChart() {
  return (
    <Card className="shadow-card border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">ATTENDANCE OVERVIEW</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">— LOREM</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(215, 16%, 47%)" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={2}
                fill="url(#attendanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
