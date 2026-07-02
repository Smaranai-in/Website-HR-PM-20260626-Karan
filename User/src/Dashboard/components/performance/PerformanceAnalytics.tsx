import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Download, Star, AlertTriangle } from "lucide-react";

import {
  dailyReportsData,
  internOutcomesData,
  reviewEfficiencyData,
  heatmapCells,
  supervisorBenchmark,
} from "../../modules/authentication/pages/program-manager/data/mockData";

export default function PerformanceAnalytics() {
  return (
    <div className="space-y-6">
      {/* ================= TOP ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAILY REPORTS */}
        <Card title="DAILY REPORTS REVIEWED">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={dailyReportsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="musfiq" stroke="#22C55E" strokeWidth={2} />
              <Line dataKey="ravi" stroke="#F97316" strokeWidth={2} />
              <Line dataKey="rahul" stroke="#3B82F6" strokeWidth={2} />
              <Line dataKey="kisan" stroke="#EC4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* INTERN OUTCOMES */}
        <Card title="Intern Outcomes Analysis" exportable>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={internOutcomesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#60A5FA" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ================= MIDDLE ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* REVIEW EFFICIENCY */}
        <Card title="Review Efficiency" exportable>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={reviewEfficiencyData}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="value" fill="#A78BFA" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* HEATMAP */}
        <Card title="Risk & Escalation Heatmap" exportable>
          <div className="grid grid-cols-7 gap-2">
            {heatmapCells.map((_, i) => (
              <div
                key={i}
                className={`h-[28px] rounded-md ${i % 5 === 0
                  ? "bg-red-600"
                  : i % 4 === 0
                    ? "bg-red-400"
                    : i % 3 === 0
                      ? "bg-red-300"
                      : "bg-red-200"
                  }`}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* SUPERVISOR BENCHMARK TABLE */}
        <div className="bg-white rounded-[18px] shadow-figma p-6">
          <h3 className="text-[24px] font-semibold mb-4">
            Supervisor Benchmark Table
          </h3>

          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-[#D9ECFF] px-5 py-3 rounded-[10px] text-[20px] font-medium">
            <span>Supervisor</span>
            <span>Rating</span>
            <span>Completion</span>
            <span>Dropout</span>
          </div>

          <div className="mt-4 space-y-3">
            {supervisorBenchmark.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-5 py-4 rounded-[14px] border border-[#EEF2F7] shadow-sm text-[15px]"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-medium">{s.name}</span>
                </div>

                <div className="flex items-center gap-1">
                  {s.rating}
                  <Star size={14} className="text-[#F59E0B]" fill="#F59E0B" />
                </div>

                <span>{s.completion}</span>

                <div className="flex items-center gap-2">
                  {s.dropout}
                  {s.warning && (
                    <AlertTriangle size={14} className="text-[#F59E0B]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSISTENCY SCORE */}
        <div className="bg-white rounded-[18px] shadow-figma p-8 flex flex-col items-center justify-center">
          <h3 className="text-[22px] font-semibold text-[#0F172A] mb-6">
            Consistency Score
          </h3>

          <div className="relative">
            <svg width="240" height="140" viewBox="0 0 240 140">

              {/* Background Arc */}
              <path
                d="M20 120 A100 100 0 0 1 220 120"
                stroke="#E5E7EB"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
              />

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#22C55E" />
                </linearGradient>
              </defs>

              {/* Colored Arc */}
              <path
                d="M20 120 A100 100 0 0 1 220 120"
                stroke="url(#gaugeGradient)"
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
              />

              {/* Needle (static for now) */}
              <line
                x1="120"
                y1="120"
                x2="170"
                y2="60"
                stroke="#111827"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="120" cy="120" r="8" fill="#111827" />
            </svg>

            {/* Center Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
              <p className="text-[28px] font-semibold text-[#0F172A]">
                72%
              </p>
              <p className="text-[14px] text-[#6B7280]">
                Performance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE CARD ================= */

type CardProps = {
  title: string;
  children: React.ReactNode;
  exportable?: boolean;
};

function Card({ title, children, exportable }: CardProps) {
  return (
    <div className="bg-white rounded-[20px] shadow-figma p-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-[24px] font-semibold text-[#0F172A]">{title}</h3>
          <p className="text-[16px] text-[#9CA3AF]">
            Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.
          </p>
        </div>

        {exportable && (
          <button className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-[16px] text-[#2563EB]">
            <Download size={16} />
            Export
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
