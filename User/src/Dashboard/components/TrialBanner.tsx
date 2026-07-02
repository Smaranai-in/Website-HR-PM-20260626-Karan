import React from "react";
import { Info } from "lucide-react";

interface TrialBannerProps {
  status: string;
  message: string;
}

export default function TrialBanner({ status, message }: TrialBannerProps) {
  return (
    <div className="bg-purple-100 border border-purple-200 rounded-xl p-4 flex gap-3">
      <Info className="text-purple-600 w-5 h-5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-purple-900">{status}</p>
        <p className="text-xs text-purple-700 mt-0.5">{message}</p>
      </div>
    </div>
  );
}
