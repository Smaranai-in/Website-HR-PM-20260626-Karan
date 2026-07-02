
import SummaryCard from "../../../../components/cards/SummaryCard";
import SupervisorsListTable from "../../../../components/tables/SupervisorsListTable";

import { supervisorsSummary } from "./data/mockData";


export default function Supervisors() {
  return (
    <div className="space-y-8 bg-[#f5f0fe] p-4 sm:p-6 lg:p-8">

      {/* SUMMARY SECTION */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A]">
              Summary
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-1">
              Today’s summary
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="h-9 px-4 text-sm border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition">
              📅 Today: 5 Nov, 2025
            </button>
            <button className="h-9 px-4 text-sm border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition">
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {supervisorsSummary.map((item, i) => (
            <SummaryCard key={i} {...item} />
          ))}
        </div>
      </div>

      {/* TITLE + FILTERS */}
      <div className="space-y-6 text-center">

        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#0F172A]">
            Supervisors
          </h2>
          <p className="text-sm sm:text-base text-[#9CA3AF] mt-1">
            Manage and Review all Supervisors in the Internship Program
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm sm:text-base">
          {(() => {
            const filterOptions = {
              Ratings: ["All", "4.5+", "4.0-4.5", "<4.0"],
              Status: ["All", "Active", "Onboarding", "Inactive", "Completed", "Fired"],
              "Intern Count": ["All", "0-2", "3-5", "6+"],
            } as const;

            type FilterKey = keyof typeof filterOptions;

            const labels: FilterKey[] = ["Ratings", "Status", "Intern Count"];

            return labels.map((label) => (
              <div key={label} className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-[#0F172A] font-medium">
                  {label}:
                </span>

                <select className="h-9 w-40 border border-[#E5E7EB] rounded-lg px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
                  {filterOptions[label].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="w-full overflow-x-auto">
          <SupervisorsListTable />
        </div>
      </div>

    </div>
  );
}