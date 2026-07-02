import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../../ui/button";
import { Download } from "lucide-react";

const data = [
  { day: "DAY 1", value: 22 },
  { day: "DAY 2", value: 18 },
  { day: "DAY 3", value: 62 },
  { day: "DAY 4", value: 35 },
  { day: "DAY 5", value: 72 },
  { day: "DAY 6", value: 68 },
  { day: "DAY 7", value: 58 },
];

export function TaskProgressChart() {
  return (
    <div className="bg-card rounded-xl p-6 card-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Task Progress Graph (Weekly)</h3>
          <p className="text-sm text-muted-foreground">Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--smaran-blue))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--smaran-blue))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--smaran-blue))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
