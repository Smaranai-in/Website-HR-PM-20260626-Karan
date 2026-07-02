import { useState, useEffect } from "react";
import {
  MoreHorizontal,
  Eye,
  FileText,
  CheckCircle,
  UserX,
} from "lucide-react";
import type { Intern } from "../../modules/authentication/pages/program-manager/data/mockData";
import type { LucideIcon } from "lucide-react";


type InternsTableProps = {
  data?: Intern[];
};

export default function InternsTable({ data = [] }: InternsTableProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    if (openIndex === null) return;

    function onDocClick(e: MouseEvent) {
      if (!(e.target instanceof Element)) return;

      const insideDropdown = e.target.closest(
        `[data-dropdown-index='${openIndex}']`
      );
      const insideTrigger = e.target.closest(
        `[data-dropdown-trigger='${openIndex}']`
      );

      if (!insideDropdown && !insideTrigger) {
        setOpenIndex(null);
      }
    }

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openIndex]);

  type InternStatus = Intern["status"];

  const statusMap: Record<
    InternStatus,
    { bg: string; text: string; dot: string }
  > = {
    Active: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      dot: "bg-[#4ADE80]",
    },
    Onboarding: {
      bg: "bg-[#E0F2FE]",
      text: "text-[#0284C7]",
      dot: "bg-[#60A5FA]",
    },
    Completed: {
      bg: "bg-[#F3F4F6]",
      text: "text-[#374151]",
      dot: "bg-[#9CA3AF]",
    },
    Inactive: {
      bg: "bg-[#FEF3C7]",
      text: "text-[#B45309]",
      dot: "bg-[#F59E0B]",
    },
    Fired: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#DC2626]",
      dot: "bg-[#F87171]",
    },
    Resigned: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#B91C1C]",
      dot: "bg-[#EF4444]",
    },
  };

  return (
    <>
      {/* TABLE HEADER */}
      <div
        className="grid grid-cols-[1fr_2.3fr_2.5fr_1.6fr_2.3fr_1.2fr_0.8fr]
        bg-[#D9ECFF] px-6 py-4 rounded-[14px]
        text-[18px] font-medium text-[#0F172A]"
      >
        <span>UniqueID</span>
        <span>Intern Profile</span>
        <span>Email</span>
        <span>Manager (Supervisor)</span>
        <span>Internship Duration</span>
        <span>Status</span>
        <span className="text-center">Action</span>
      </div>

      {/* ROWS */}
      <div className="mt-4 space-y-3">
        {data.map((i, idx) => {
          const status = statusMap[i.status];

          return (
            <div
              key={idx}
              className="relative min-h-[76px]
              grid grid-cols-[1fr_2.3fr_2.5fr_1.6fr_2.3fr_1.2fr_0.8fr]
              items-center px-6 py-5 rounded-[14px]
              bg-white border border-[#EEF2F7]
              shadow-[0_3px_8px_rgba(0,0,0,0.08)]
              hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]
              transition-all duration-200"
            >
              {/* ID */}
              <span className="text-[14px] text-[#374151]">
                {i.id}
              </span>

              {/* INTERN */}
              <div className="flex items-center gap-3">
                <img
                  src={i.avatar}
                  alt={i.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-[14px] font-medium text-[#0F172A]">
                    {i.name}
                  </p>
                  <p className="text-[13px] text-[#9CA3AF]">
                    {i.role}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <span className="text-[14px] truncate text-[#374151]">
                {i.email}
              </span>

              {/* MANAGER */}
              <span className="text-[14px] text-[#374151]">
                {i.manager}
              </span>

              {/* DURATION */}
              <span className="text-[14px] text-[#374151]">
                {i.duration}
              </span>

              {/* STATUS */}
              <div
                className={`flex items-center gap-2 px-3 h-[32px]
                rounded-full text-[13px] font-medium w-fit
                ${status?.bg || ""}
                ${status?.text || ""}`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${status?.dot || ""}`}
                />
                {i.status}
              </div>

              {/* ACTION */}
              <div className="relative flex items-center justify-center">
                <div data-dropdown-trigger={idx}>
                  <MoreHorizontal
                    size={20}
                    className="cursor-pointer text-gray-500 hover:text-gray-800"
                    onClick={() =>
                      setOpenIndex(openIndex === idx ? null : idx)
                    }
                  />
                </div>

                {openIndex === idx && (
                  <div
                    data-dropdown-index={idx}
                    className="absolute right-2 top-9 w-[200px] max-w-[90vw]
                    bg-white border border-[#E5E7EB]
                    rounded-[10px] shadow-xl z-50"
                  >
                    <MenuItem icon={Eye} label="View Details" onClick={() => setOpenIndex(null)} />
                    <MenuItem icon={FileText} label="View Documents" onClick={() => setOpenIndex(null)} />
                    <MenuItem icon={CheckCircle} label="Mark Complete" onClick={() => setOpenIndex(null)} />
                    <MenuItem
                      icon={UserX}
                      label="Fire Intern"
                      danger
                      onClick={() => setOpenIndex(null)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* DROPDOWN ITEM */
type MenuItemProps = {
  icon: LucideIcon;
  label: string;
  danger?: boolean;
  onClick?: () => void;
};

function MenuItem({ icon: Icon, label, danger, onClick }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-[14px]
      cursor-pointer transition
      ${danger
          ? "text-red-600 hover:bg-red-50"
          : "text-[#0F172A] hover:bg-[#E8F1FF]"
        }`}
    >
      <Icon size={18} />
      {label}
    </div>
  );
}