import { AlertTriangle } from "lucide-react";

export default function AlertCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 space-y-5">

      {/* HEADER */}
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} className="text-orange-500" />
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A]">
          Alerts & Escalations
        </h3>
      </div>

      {/* ALERT ITEMS */}
      <div className="space-y-3 text-sm sm:text-base">

        <div className="flex items-center px-4 py-3 rounded-lg bg-[#DBEAFE] break-words">
          ⚠️ Low ratings for Tejas Joshi (3 interns)
        </div>

        <div className="flex items-center px-4 py-3 rounded-lg bg-[#F3E8FF] break-words">
          ⚠️ 2 intern resignations under Ravi Kumar
        </div>

        <div className="flex items-center px-4 py-3 rounded-lg bg-[#D1FAE5] break-words">
          ⏳ Performance review pending
        </div>
      </div>

      {/* BUTTON */}
      <div className="flex justify-center pt-2">
        <button className="px-5 py-2 rounded-full border text-xs sm:text-sm text-[#475569] hover:bg-gray-100 transition">
          Go to Escalations
        </button>
      </div>
    </div>
  );
}