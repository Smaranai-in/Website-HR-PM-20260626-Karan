import {
  escalations,
  type SeverityType,
  type StatusType,
} from "../../modules/authentication/pages/program-manager/data/mockData";

const severityStyle: Record<SeverityType, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-orange-100 text-orange-600",
  Low: "bg-green-100 text-green-600",
};

const statusStyle: Record<StatusType, string> = {
  Open: "bg-blue-100 text-blue-700",
  "In Review": "bg-purple-100 text-purple-700",
};

export default function EscalationsTable() {
  return (
    <div className="space-y-6">

      {/* TITLE */}
      <div>
        <h3 className="text-[22px] font-semibold text-[#0F172A]">
          Escalations List
        </h3>
        <p className="text-[14px] text-[#64748B] mt-1">
          Track and manage all escalation cases
        </p>
      </div>

      {/* HEADER */}
      <div
        className="grid grid-cols-[1fr_2fr_2fr_2fr_1.3fr_1.3fr_1.5fr]
        bg-[#D9ECFF] px-8 py-4 rounded-[14px]
        text-[16px] font-semibold text-[#0F172A]"
      >
        <span>ID</span>
        <span>Type</span>
        <span>Supervisor</span>
        <span>Intern</span>
        <span>Severity</span>
        <span>Status</span>
        <span className="text-center">Action</span>
      </div>

      {/* ROWS */}
      <div className="space-y-4">
        {escalations.map((e, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_2fr_2fr_2fr_1.3fr_1.3fr_1.5fr]
            items-center px-8 py-5
            rounded-[16px]
            bg-white
            border border-[#EEF2F7]
            shadow-[0_3px_8px_rgba(0,0,0,0.05)]
            hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]
            transition-all duration-200
            text-[14px]"
          >
            {/* ID */}
            <span className="text-[#374151] font-medium">
              {e.id}
            </span>

            {/* TYPE */}
            <span className="text-[#374151]">
              {e.type}
            </span>

            {/* SUPERVISOR */}
            <span className="text-[#374151]">
              {e.supervisor}
            </span>

            {/* INTERN */}
            <span className="text-[#374151]">
              {e.intern}
            </span>

            {/* SEVERITY */}
            <div className="flex">
              <span
                className={`px-4 h-[30px] flex items-center
                rounded-full text-[13px] font-medium
                ${severityStyle[e.severity]}`}
              >
                {e.severity}
              </span>
            </div>

            {/* STATUS */}
            <div className="flex">
              <span
                className={`px-4 h-[30px] flex items-center
                rounded-full text-[13px] font-medium
                ${statusStyle[e.status]}`}
              >
                {e.status}
              </span>
            </div>

            {/* ACTION */}
            <div className="flex justify-center">
              <button
                className="h-[34px] px-4
                border border-[#E5E7EB]
                rounded-[8px]
                text-[14px] font-medium
                hover:bg-[#F8FAFC]
                transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}