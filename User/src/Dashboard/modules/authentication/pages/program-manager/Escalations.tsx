import EscalationsTable from "../../../../components/tables/EscalationsTable";
import SmaranBotSummary from "../../../../components/common/SmaranBotSummary";

export default function Escalations() {
  return (
    <div className="space-y-8 bg-[#f5f0fe] p-4 sm:p-6 lg:p-8">

      {/* ESCALATIONS HEADER SECTION */}
      <div className="bg-[#f2f4f6] rounded-2xl p-4 sm:p-6 lg:p-8 space-y-6">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1E1B4B]">
            Escalations & Actions Center
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280]">
            Centralized issue tracking & resolution
          </p>
        </div>

        {/* FILTER ROW */}
        <div className="flex flex-col lg:flex-row flex-wrap justify-center gap-4 text-sm sm:text-base">
          {(() => {
            const filterOptions = {
              Type: ["All", "Low Rating", "Resignation", "Delay", "Other"],
              Supervisor: ["All", "Tejas Joshi", "Musfiq", "Ravi Kumar", "Priya Verma"],
              Severity: ["All", "Low", "Medium", "High", "Critical"],
              Status: ["All", "Open", "In Review", "Resolved", "Closed"],
            } as const;

            const labels = ["Type", "Supervisor", "Severity", "Status"] as const;

            return labels.map((label) => (<div
              key={label}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <span className="text-[#0F172A] font-medium">
                {label}:
              </span>

              <select className="h-9 w-40 border border-[#E5E7EB] rounded-md px-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-200">
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

      {/* ESCALATIONS LIST */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <div className="w-full overflow-x-auto">
          <EscalationsTable />
        </div>
      </div>

      {/* AI SUMMARY */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <SmaranBotSummary />
      </div>

    </div>
  );
}