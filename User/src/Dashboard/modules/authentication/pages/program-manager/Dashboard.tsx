
import SummaryCard from "../../../../components/cards/SummaryCard";
import SupervisorTable from "../../../../components/tables/SupervisorTable";
import WeeklyLineChart from "../../../../components/charts/WeeklyLineChart";
import DonutChart from "../../../../components/charts/DonutChart";

import AlertCard from "../../../../components/common/AlertCard";
import WeeklyAISummary from "../../../../components/common/WeeklyAISummary";
import NotificationsCard from "../../../../components/common/NotificationsCard";
import RecentActivityLog from "../../../../components/common/RecentActivityLog";

import { summaryData, supervisors, lineChartData } from "./data/mockData";

export default function Dashboard() {
  return (
    <div className="space-y-8 bg-[#f5f0fe] p-6 sm:p-8 lg:p-12">

      {/* SUMMARY SECTION */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0F172A]">
              Summary
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-1">
              Today’s summary
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="h-9 px-4 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F8FAFC] transition">
              📅 Today: 5 Nov, 2025
            </button>
            <button className="h-9 px-4 text-sm border border-[#E5E7EB] rounded-lg hover:bg-[#F8FAFC] transition">
              Export
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {summaryData.map((item, i) => (
            <SummaryCard key={i} {...item} />
          ))}
        </div>
      </div>

      {/* MAIN DASHBOARD GRID */}
      <section className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">

        {/* LEFT COLUMN */}
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <SupervisorTable data={supervisors} />
          </div>

          <WeeklyLineChart data={lineChartData} />

          <RecentActivityLog />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          <AlertCard />
          <WeeklyAISummary />
          <DonutChart />
          <NotificationsCard />
        </div>

      </section>
    </div>
  );
}