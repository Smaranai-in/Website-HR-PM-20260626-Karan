import { useState, useRef, useEffect } from "react";

import SummaryCard from "../../../../components/cards/SummaryCard";
import InternsTable from "../../../../components/tables/InternsTable";

import { internsSummary, interns } from "./data/mockData";
import { Search, Calendar } from "lucide-react";

export default function Interns() {
  const [showRange, setShowRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const rangeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (rangeRef.current && !rangeRef.current.contains(target)) {
        setShowRange(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
            <button className="h-9 px-4 text-sm border rounded-lg hover:bg-gray-50 transition">
              📅 Today: 5 Nov, 2025
            </button>
            <button className="h-9 px-4 text-sm border rounded-lg hover:bg-gray-50 transition">
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {internsSummary.map((item, i) => (
            <SummaryCard key={i} {...item} />
          ))}
        </div>
      </div>

      {/* INTERN LOG SECTION */}
      <div className="space-y-8">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#0F172A]">
            Hired Intern Log
          </h2>
          <p className="text-sm sm:text-base text-[#9CA3AF]">
            Lorem ipsum dolor sit amet, consectetur adipisci
          </p>
        </div>

        {/* STATUS TABS */}
        <div className="flex flex-wrap justify-center gap-2 text-sm sm:text-base">
          {[
            "All",
            "Active",
            "Onboarding",
            "Inactive",
            "Completed",
            "Fired",
          ].map((tab, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-md border transition
              ${tab === "All"
                  ? "bg-[#DDEEFF] text-[#2563EB] border-[#BFDBFE]"
                  : "bg-white text-gray-600 border-[#E5E7EB] hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">

          {/* LEFT FILTER GROUP */}
          <div className="flex flex-wrap items-center gap-3">

            <select className="border rounded-md px-3 py-2 text-sm bg-white">
              <option>Role</option>
              <option>Web Intern</option>
              <option>Figma Design Intern</option>
              <option>Design Intern</option>
            </select>

            <select className="border rounded-md px-3 py-2 text-sm bg-white">
              <option>Manager</option>
              <option>Priya Verma</option>
              <option>Shantanu Sharma</option>
              <option>Tejas Joshi</option>
              <option>Ravi Kumar</option>
              <option>John Doe</option>
            </select>

            <div className="relative">
              <input
                className="border rounded-md pl-8 pr-3 py-2 text-sm bg-white w-48 sm:w-64"
                placeholder="Search..."
              />
              <Search
                size={16}
                className="absolute left-2 top-2.5 text-gray-400"
              />
            </div>
          </div>

          {/* DATE RANGE */}
          <div className="relative" ref={rangeRef}>
            <button
              onClick={() => setShowRange((s) => !s)}
              className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50 transition"
              aria-expanded={showRange}
              aria-haspopup="dialog"
            >
              <Calendar size={16} />
              Date Range
            </button>

            {showRange && (
              <div className="mt-2 w-full sm:w-72 bg-white border rounded-md shadow-lg p-3 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <label className="text-xs text-gray-500">From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm w-full"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <label className="text-xs text-gray-500">To</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-md px-2 py-1 text-sm w-full"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                      setShowRange(false);
                    }}
                    className="py-2 px-3 text-sm border rounded-md bg-white hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowRange(false)}
                    className="py-2 px-3 text-sm bg-[#93C5FD] text-[#1E3A8A] rounded-md"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <div className="w-full overflow-x-auto">
            <InternsTable data={interns} />
          </div>
        </div>

      </div>
    </div>
  );
}