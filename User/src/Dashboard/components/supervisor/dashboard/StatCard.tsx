import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  variant: "blue" | "green" | "purple" | "red" | "teal";
}

const variantClasses = {
  blue: "bg-[#C9D8EB]",
  green: "bg-[#BFE2DA]",
  purple: "bg-[#D8CFE6]",
  red: "bg-[#E8B6B6]",
  teal: "bg-[#B9DAD5]",
};

const iconBgClasses = {
  blue: "bg-[#B4CAE3] text-[#2F6FA3]",
  green: "bg-[#A6D8CD] text-[#0F7A63]",
  purple: "bg-[#C7B9E0] text-[#6C4DB5]",
  red: "bg-[#E59E9E] text-[#B42323]",
  teal: "bg-[#A2CEC7] text-[#0E746A]",
};

export function StatCard({
  icon: Icon,
  value,
  label,
  change,
  changeType = "neutral",
  variant,
}: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 ${variantClasses[variant]} shadow-sm`}
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconBgClasses[variant]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-gray-900">
        {value}
      </div>

      {/* Label */}
      <div className="text-sm text-gray-600 mt-1">
        {label}
      </div>

      {/* Change */}
      {change && (
        <div
          className={`text-xs mt-2 ${changeType === "positive"
            ? "text-green-600"
            : changeType === "negative"
              ? "text-red-600"
              : "text-blue-600"
            }`}
        >
          {change}
        </div>
      )}
    </div>
  );
}