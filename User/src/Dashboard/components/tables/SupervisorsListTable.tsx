import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Star,
  MoreHorizontal,
  Eye,
  Users,
  RotateCcw,
  Calendar,
  FileWarning,
  Flag,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  supervisors,
  type Supervisor,
  type SupervisorStatus,
} from "../../modules/authentication/pages/program-manager/data/mockData";

const statusStyles: Record<SupervisorStatus, string> = {
  Excellent: "bg-[#DCFCE7] text-[#16A34A]",
  Good: "bg-[#E0F2FE] text-[#0284C7]",
  "Needs Review": "bg-[#FEE2E2] text-[#DC2626]",
};

type MenuItemProps = {
  icon: LucideIcon;
  text: string;
  onClick?: () => void;
};

export default function SupervisorsListTable() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const navigate = useNavigate();

  const openSupervisorPage = (supervisor: Supervisor, index: number) => {
    navigate(`/program-manager/supervisor/${index}`, {
      state: supervisor,
    });
    setOpenMenu(null);
  };

  return (
    <>
      {/* TABLE TITLE */}
      <h3 className="text-[30px] font-semibold text-[#0F172A] mb-4">
        Supervisors List
      </h3>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-[2fr_2.2fr_1fr_1.2fr_1.3fr_0.6fr] bg-[#D9ECFF] px-6 py-3 rounded-[10px] text-[20px] font-medium">
        <span>Name</span>
        <span>Email</span>
        <span>Intern</span>
        <span>Avg Ratings</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      {/* TABLE ROWS */}
      <div className="mt-4 space-y-3">
        {supervisors.map((s, i) => (
          <div
            key={i}
            className="relative grid grid-cols-[2fr_2.2fr_1fr_1.2fr_1.3fr_0.6fr] items-center px-6 py-4 rounded-[14px] border border-[#EEF2F7] shadow-sm"
          >
            {/* NAME */}
            <div className="flex items-center gap-3">
              <img
                src={s.avatar}
                alt={s.name}
                className="w-9 h-9 rounded-full"
              />
              <span className="text-[15px] font-medium">{s.name}</span>
            </div>

            {/* EMAIL */}
            <span className="text-[15px] text-[#475569]">{s.email}</span>

            {/* INTERN COUNT */}
            <span className="text-[15px]">{s.interns}</span>

            {/* RATING */}
            <div className="flex items-center gap-1 text-[15px]">
              {s.rating}
              <Star size={16} fill="#FBBF24" className="text-[#FBBF24]" />
            </div>

            {/* STATUS */}
            <span
              className={`px-3 py-1 rounded-full text-[15px] font-medium w-fit ${statusStyles[s.status]}`}
            >
              {s.status}
            </span>

            {/* ACTION MENU */}
            <div className="relative flex justify-center">
              <button onClick={() => setOpenMenu(openMenu === i ? null : i)}>
                <MoreHorizontal size={18} className="text-[#6B7280]" />
              </button>

              {openMenu === i && (
                <div className="absolute right-6 top-10 z-50 w-[291px] max-w-[90vw] bg-white border border-[#E5E7EB] rounded-[12px] shadow-lg text-[15px]">
                  <MenuItem
                    icon={Eye}
                    text="View Profile"
                    onClick={() => openSupervisorPage(s, i)}
                  />
                  <MenuItem
                    icon={Users}
                    text="View Interns Under Supervisor"
                    onClick={() => openSupervisorPage(s, i)}
                  />
                  <MenuItem icon={RotateCcw} text="Move Back to Applicants" />
                  <MenuItem icon={Calendar} text="Schedule Meeting" />
                  <MenuItem icon={FileWarning} text="Issue Improvement Plan" />
                  <MenuItem icon={Flag} text="Flag / Escalate to HR" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ===== MENU ITEM ===== */

function MenuItem({ icon: Icon, text, onClick }: MenuItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 hover:bg-[#F1F5F9] cursor-pointer"
    >
      <Icon size={16} />
      <span>{text}</span>
    </div>
  );
}
