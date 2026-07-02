import {
  Users,
  Star,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  UserPlus,
  ListTodo,
  CalendarClock,
  AlertCircle,
  PauseCircle,
} from "lucide-react";

const iconMap = {
  users: Users,
  interns: UserCheck,
  rating: Star,
  completed: CheckCircle,
  alert: AlertTriangle,
  active: UserCheck,
  onboarding: UserPlus,
  todo: ListTodo,
  calendar: CalendarClock,
  overdue: AlertCircle,
  blocked: PauseCircle,
};

type SummaryCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  bg: string;
  iconBg: string;
  icon: keyof typeof iconMap;
};

export type SummaryIconType = keyof typeof iconMap;

export default function SummaryCard({
  title,
  value,
  subtitle,
  bg,
  iconBg,
  icon,
}: SummaryCardProps) {
  const Icon = iconMap[icon] || AlertTriangle;

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 lg:p-6 ${bg}
      shadow-md flex flex-col justify-between min-h-[140px] sm:min-h-[160px] transition`}
    >
      {/* ICON */}
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${iconBg}`}
      >
        <Icon size={20} className="text-white" />
      </div>

      {/* CONTENT */}
      <div className="mt-3">
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#0F172A]">
          {value}
        </p>

        <p className="text-sm sm:text-base text-[#667085] leading-snug break-words mt-1">
          {title}
        </p>
      </div>

      {/* FOOTER */}
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#2563EB] mt-3">
          {subtitle}
        </p>
      )}
    </div>
  );
}