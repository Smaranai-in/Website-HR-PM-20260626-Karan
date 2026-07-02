import React from "react";
import SummaryCard from "../../../../components/cards/SummaryCard";
import {
  AlertTriangle,
  TrendingDown,
  Mail,
  LogOut,
  FileText,
} from "lucide-react";

import {
  aiQuickStats,
  aiGovernanceSummary,
  aiDecisionLog,
} from "./data/mockData";

export default function AIConfig() {
  return (
    <div className="space-y-8 bg-[#f5f0fe] p-4 sm:p-6 lg:p-8">

      {/* QUICK STATS */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A]">
              Quick Stats
            </h2>
            <p className="text-sm sm:text-base text-[#64748B]">
              Today’s summary
            </p>
          </div>

          <button className="h-9 px-4 text-sm border rounded-lg hover:bg-gray-50 transition">
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
          {aiQuickStats.map((item, i) => (
            <SummaryCard key={i} {...item} />
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* WEEKLY SUMMARY */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[#0F172A]">
              Weekly AI Governance Summary
            </h3>

            <p className="text-sm text-[#9CA3AF] mt-2 mb-4">
              Generated on {aiGovernanceSummary.generatedOn}
            </p>

            <div className="bg-[#D9ECFF] rounded-xl p-4 mb-4">
              <ul className="space-y-2 text-sm sm:text-base font-medium">
                {aiGovernanceSummary.points.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center mb-4">
              <div className="bg-[#F3E8FF] px-4 py-2 rounded-full text-xs sm:text-sm text-center">
                Confidence Level:{" "}
                <span className="text-[#22C55E] font-semibold">
                  {aiGovernanceSummary.confidence}
                </span>{" "}
                | AI Confidence Score:{" "}
                <span className="text-[#22C55E] font-semibold">92%</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 transition">
                ⬆ Export
              </button>

              <button className="bg-[#93C5FD] px-6 py-2 rounded-lg text-sm font-medium shadow hover:opacity-90 transition">
                View Supporting Data
              </button>
            </div>
          </div>

          {/* ALERTS */}
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold">
                Alerts & Notifications
              </h3>

              <button className="bg-[#E5E7EB] px-4 py-1.5 rounded-full text-xs">
                View All
              </button>
            </div>

            <div className="space-y-3">
              <AlertItem icon={<AlertTriangle size={18} />} title="Escalations Detected (Supervisor Overloaded)" />
              <AlertItem icon={<TrendingDown size={18} />} title="Performance Dip in Design Interns" />
              <AlertItem icon={<Mail size={18} />} title="Message from Ravi Kumar (AI Intern)" />
              <AlertItem icon={<LogOut size={18} />} title="2 interns resigned under Ravi Kumar" />
              <AlertItem icon={<FileText size={18} />} title="Attendance Anomaly (3 Interns)" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 space-y-6">

            {/* HEADER */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#0F172A]">
                SmaranBot Control Panel
              </h3>

              <span className="inline-block mt-2 bg-[#DBEAFE] text-[#1E40AF] text-xs sm:text-sm px-3 py-1 rounded-full">
                SmaranBot Status <span className="text-green-600">● Active</span> | Mode: Advisory
              </span>
            </div>

            {/* MODULE TOGGLES */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3">
                AI Module Toggles
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Checkbox label="AI Task Summaries" checked />
                <Checkbox label="AI Performance Analysis" checked />
                <Checkbox label="AI Interview Evaluation" checked />
                <Checkbox label="AI Risk Prediction" />
                <Checkbox label="AI Auto-Actions (Displayed by Policy)" />
                <Checkbox label="AI Attendance Anomaly Detection" checked />
                <Checkbox label="AI Certificate Readiness Check" checked />
              </div>
            </div>

            {/* DECISION LOG */}
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3">
                AI Decision Log
              </h4>

              <div className="bg-[#F3E8FF] rounded-xl p-4 text-sm space-y-4">
                {aiDecisionLog.map((d, i) => (
                  <div key={i}>
                    <p className="mb-2">
                      • {d.title}
                      <br />
                      <span className="text-[#374151]">Reason: {d.reason}</span>
                    </p>

                    <p className="mb-2">
                      • Decision taken:{" "}
                      <span className="text-green-600 font-semibold">
                        ✓ {d.decision}
                      </span>{" "}
                      by {d.by}
                    </p>

                    <div className="text-right text-xs text-[#6B7280]">
                      4 November 2025 &nbsp; 05:30 PM
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

type CheckboxProps = {
  label: string;
  checked?: boolean;
};

function Checkbox({ label, checked }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" defaultChecked={checked} />
      {label}
    </label>
  );
}

type AlertItemProps = {
  icon: React.ReactNode;
  title: string;
};

function AlertItem({ icon, title }: AlertItemProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-[#E5E7EB] rounded-xl px-4 py-3">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-[#6B7280]">
            4 November 2025 &nbsp; 05:30 PM &nbsp; ID: 304WEB
          </p>
        </div>
      </div>

      <button className="bg-[#B9A6FF] text-white px-4 py-1.5 rounded-full text-xs font-medium self-start sm:self-auto">
        View
      </button>
    </div>
  );
}
