import { Star } from "lucide-react";

import type { Supervisor, SupervisorStatus }
  from "../../modules/authentication/pages/program-manager/data/mockData";

type SupervisorTableProps = {
  data?: Supervisor[];
};

export default function SupervisorTable({ data = [] }: SupervisorTableProps) {
  const statusStyles: Record<SupervisorStatus, string> = {
    Excellent: "bg-[#DCFCE7] text-[#16A34A]",
    Good: "bg-[#E0F2FE] text-[#0284C7]",
    "Needs Review": "bg-[#FEE2E2] text-[#DC2626]",
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">

      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A] mb-4">
        Supervisor Performance
      </h3>

      {/* TABLE WRAPPER (Important for Mobile Scroll) */}
      <div className="overflow-x-auto">

        {/* HEADER */}
        <div className="min-w-[750px] grid grid-cols-[2.5fr_1fr_1.2fr_1.2fr_1.5fr] bg-[#E6F2FF] px-4 sm:px-6 py-3 rounded-lg text-sm sm:text-base font-medium">
          <span>Supervisor</span>
          <span>Interns</span>
          <span>Ratings</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* ROWS */}
        <div className="mt-4 space-y-3 min-w-[750px]">
          {data.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-[2.5fr_1fr_1.2fr_1.2fr_1.5fr] items-center px-4 sm:px-6 py-4 rounded-xl border border-[#EEF2F7] text-sm sm:text-base"
            >

              {/* Supervisor */}
              <div className="flex items-center gap-3">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover"
                />
                <span className="font-medium whitespace-nowrap">
                  {s.name}
                </span>
              </div>

              {/* Interns */}
              <span>{s.interns}</span>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {s.rating}
                <Star size={14} fill="#FBBF24" className="text-[#FBBF24]" />
              </div>

              {/* Status */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${statusStyles[s.status]
                  }`}
              >
                {s.status}
              </span>

              {/* Action */}
              <button className="px-3 sm:px-4 py-2 rounded-lg bg-white text-black text-xs sm:text-sm hover:bg-[#2563EB] hover:text-white border transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex justify-center mt-6">
        <button className="px-5 py-2 rounded-full border text-xs sm:text-sm text-[#475569] hover:bg-gray-100 transition">
          View All Supervisors
        </button>
      </div>
    </div>
  );
}