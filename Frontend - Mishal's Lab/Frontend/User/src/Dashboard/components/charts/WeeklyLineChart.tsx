import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type WeeklyLineChartProps = {
  data: { day: string; value: number }[];
};

export default function WeeklyLineChart({ data }: WeeklyLineChartProps) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">

        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A]">
            Supervising Progress Graph (Weekly)
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Performance trend over the last 7 days
          </p>
        </div>

        <button className="w-full sm:w-auto border border-gray-200 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          Export
        </button>
      </div>

      {/* CHART */}
      <div className="w-full h-[240px] sm:h-[280px] md:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              width={35}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "13px",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#4F46E5"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}