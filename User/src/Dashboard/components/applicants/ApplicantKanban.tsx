import type { Applicant } from "./ApplicantCard";
import { ApplicantCard } from "./ApplicantCard";
import { Users, MessageSquare, Phone, Calendar, Send, UserCheck } from "lucide-react";

interface ApplicantKanbanProps {
  applicants: Applicant[];
  onViewAIReview: (applicant: Applicant) => void;
}

type ColumnStatus = "applied" | "screened" | "contacted" | "interview" | "offer" | "hired";

interface Column {
  status: ColumnStatus;
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  headerBg: string;
}

const columns: Column[] = [
  { status: "applied", title: "Applicants", icon: <Users className="h-4 w-4" />, bgColor: "bg-kanban-applicants", headerBg: "bg-secondary" },
  { status: "screened", title: "Screened >60", icon: <MessageSquare className="h-4 w-4" />, bgColor: "bg-kanban-screened", headerBg: "bg-stat-blue" },
  { status: "contacted", title: "Contacted", icon: <Phone className="h-4 w-4" />, bgColor: "bg-kanban-contacted", headerBg: "bg-stat-cyan" },
  { status: "interview", title: "Interview", icon: <Calendar className="h-4 w-4" />, bgColor: "bg-kanban-interview", headerBg: "bg-stat-orange" },
  { status: "offer", title: "Offer Sent", icon: <Send className="h-4 w-4" />, bgColor: "bg-kanban-offer", headerBg: "bg-stat-pink" },
  { status: "hired", title: "Hired", icon: <UserCheck className="h-4 w-4" />, bgColor: "bg-kanban-hired", headerBg: "bg-stat-green" },
];

export function ApplicantKanban({ applicants, onViewAIReview }: ApplicantKanbanProps) {
  const getApplicantsByStatus = (status: ColumnStatus) =>
    applicants.filter(a => a.status === status);

  return (
    <div className="grid grid-cols-6 gap-4">
      {columns.map((column) => (
        <div key={column.status} className={`rounded-xl ${column.bgColor} p-3`}>
          {/* Column Header */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${column.headerBg} mb-3`}>
            {column.icon}
            <span className="text-sm font-medium text-foreground">{column.title}</span>
          </div>

          {/* Cards */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
            {getApplicantsByStatus(column.status).map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onViewAIReview={onViewAIReview}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
