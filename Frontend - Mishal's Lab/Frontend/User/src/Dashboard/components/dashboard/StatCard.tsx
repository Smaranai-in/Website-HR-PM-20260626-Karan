import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  variant?: "blue" | "cyan" | "pink" | "orange" | "purple" | "green";
}

const variantStyles = {
  blue: "bg-stat-blue",
  cyan: "bg-stat-cyan",
  pink: "bg-stat-pink",
  orange: "bg-stat-orange",
  purple: "bg-stat-purple",
  green: "bg-stat-green",
};

const iconVariantStyles = {
  blue: "bg-stat-icon-blue/20 text-stat-icon-blue",
  cyan: "bg-stat-icon-cyan/20 text-stat-icon-cyan",
  pink: "bg-stat-icon-pink/20 text-stat-icon-pink",
  orange: "bg-stat-icon-orange/20 text-stat-icon-orange",
  purple: "bg-stat-icon-purple/20 text-stat-icon-purple",
  green: "bg-stat-icon-green/20 text-stat-icon-green",
};

export function StatCard({
  icon,
  value,
  label,
  change,
  changeType = "positive",
  variant = "blue",
}: StatCardProps) {
  return (
    <div className={cn("rounded-xl p-4 animate-fade-in", variantStyles[variant])}>
      <div className={cn("inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3", iconVariantStyles[variant])}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-foreground/80">{label}</p>
        {change && (
          <p className={cn(
            "text-xs",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}

export default StatCard;
