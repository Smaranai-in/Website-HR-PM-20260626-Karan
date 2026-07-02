import SummaryCard from "../../../../components/cards/SummaryCard";
import PerformanceAnalytics from "../../../../components/performance/PerformanceAnalytics";
import { Search } from "lucide-react";
import { performanceSummary } from "./data/mockData";

export default function Performance() {
  return (
    <div className="space-y-8 bg-[#f5f0fe] p-4 sm:p-6 lg:p-8">

      {/* SUMMARY SECTION */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
              Summary
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-1">
              Today’s summary
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="h-9 px-4 text-sm border rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
              📅 Today: 5 Nov, 2025
            </button>
            <button className="h-9 px-4 text-sm border rounded-lg hover:bg-gray-50 transition">
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {performanceSummary.map((item, i) => (
            <SummaryCard key={i} {...item} />
          ))}
        </div>
      </div>

      {/* ANALYTICS SECTION */}
      <div className="space-y-6">

        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Supervisor Performance Analytics
          </h2>
          <p className="text-sm sm:text-base text-[#9CA3AF]">
            Lorem ipsum dolor sit amet, consectetur adipisci
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">

          <select className="border rounded-md px-4 py-2 text-sm bg-white">
            <option>Supervisor</option>
            <option>Tejas</option>
            <option>Musfiq</option>
            <option>Ravi</option>
            <option>Rahul</option>
            <option>Riya</option>
            <option>Sana</option>
            <option>John</option>
            <option>Kisan</option>
          </select>

          <div className="relative">
            <input
              className="border rounded-md pl-9 pr-3 py-2 text-sm w-48 sm:w-64"
              placeholder="Search..."
            />
            <Search
              size={16}
              className="absolute left-3 top-2.5 text-gray-400"
            />
          </div>

        </div>

        {/* ANALYTICS COMPONENT */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <PerformanceAnalytics />
        </div>

      </div>

    </div>
  );
}