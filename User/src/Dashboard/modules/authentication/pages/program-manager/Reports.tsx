import { Download } from "lucide-react";
import type { ReportFormat } from "./data/mockData";
import { reportsData } from "./data/mockData";

const formatIconMap: Record<ReportFormat, string> = {
  pdf: "/pdf.png",
  image: "/images.png",
  csv: "/csv.png",
};

export default function Reports() {
  return (
    <div className="space-y-8 bg-[#f5f0fe] p-4 sm:p-6 lg:p-8">

      {/* TITLE */}
      <div className="text-center space-y-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A]">
          Reports & Exports Center
        </h2>
        <p className="text-sm sm:text-base text-[#64748B]">
          Generate and download program-level reports
        </p>
      </div>

      {/* REPORT GENERATOR + TABLE */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 space-y-8">

        {/* GENERATOR HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#0F172A]">
            Report Generator
          </h3>

          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">

            {/* FORMAT OPTIONS */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {["PDF", "Excel", "CSV"].map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer text-[#374151]"
                >
                  <input
                    type="radio"
                    name="format"
                    className="accent-blue-600"
                  />
                  {type}
                </label>
              ))}
            </div>

            <button
              className="h-9 px-5 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] transition"
            >
              Generate Report
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[900px]">

            {/* TABLE HEADER */}
            <div className="grid grid-cols-[2.2fr_1.2fr_1.2fr_1fr_1.3fr_1.3fr] bg-[#D9ECFF] px-6 py-3 rounded-xl text-sm font-semibold text-[#0F172A]">
              <span>Report Name</span>
              <span>Category</span>
              <span>Period</span>
              <span className="text-center">Format</span>
              <span>Generated</span>
              <span className="text-center">Action</span>
            </div>

            {/* TABLE ROWS */}
            <div className="mt-4 space-y-3">
              {reportsData.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[2.2fr_1.2fr_1.2fr_1fr_1.3fr_1.3fr] items-center px-6 py-4 border border-[#EEF2F7] rounded-xl text-sm"
                >
                  <span className="font-medium text-[#0F172A]">
                    {r.name}
                  </span>

                  <span>{r.category}</span>
                  <span>{r.period}</span>

                  <div className="flex justify-center">
                    <img
                      src={formatIconMap[r.format]}
                      alt={r.format}
                      className="w-6 h-6 object-contain"
                    />
                  </div>

                  <span>{r.generated}</span>

                  <div className="flex justify-center">
                    <button
                      className="flex items-center justify-center gap-2 h-9 px-4 border rounded-lg text-sm font-medium text-[#2563EB] hover:bg-[#F8FAFC] transition"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}