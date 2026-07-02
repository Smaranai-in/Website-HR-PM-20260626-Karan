export default function WeeklyAISummary() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 space-y-5">

      {/* HEADER */}
      <div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A]">
          Weekly AI Summary
        </h3>
        <p className="text-sm sm:text-base text-[#64748B] mt-1">
          Generated on 5 Nov, 2025
        </p>
      </div>

      {/* POINT 1 */}
      <div className="px-4 py-3 rounded-lg bg-[#DBEAFE] text-sm sm:text-base break-words">
        • 2 supervisors show declining intern ratings
      </div>

      {/* POINT 2 WITH MINI VISUAL */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 px-4 py-4 rounded-xl bg-[#F3E8FF]">

        <div className="text-sm sm:text-base leading-relaxed">
          <p>• 3 interns resigned this week (within normal range)</p>
          <p>• Avg task approval time improved by 12%</p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-[120px] h-[80px] sm:h-[95px] bg-white rounded-lg flex items-center justify-center">
          <span className="text-4xl sm:text-5xl leading-none">📈</span>
        </div>
      </div>

      {/* KEY RECOMMENDATION */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 px-4 py-4 rounded-xl bg-[#D1FAE5] text-sm sm:text-base">

        <div className="leading-relaxed">
          <p className="font-semibold">Key Recommendation</p>
          <p>Schedule review with Supervisor Tejas Joshi</p>
        </div>

        <div className="flex-shrink-0 w-full sm:w-[160px] h-[70px] bg-white rounded-lg flex flex-col items-center justify-center">
          <span className="text-lg sm:text-xl font-semibold">530</span>
          <span className="text-xs text-[#64748B]">Lorem Ipsum</span>
        </div>
      </div>

      {/* HEALTH */}
      <div className="px-4 py-3 rounded-lg bg-[#DBEAFE] text-sm sm:text-base break-words">
        • Overall program health: Stable ✅
      </div>

      {/* BUTTON */}
      <div className="flex justify-end pt-2">
        <button className="px-5 py-2 bg-[#BFDBFE] text-[#0F172A] rounded-full text-xs sm:text-sm hover:bg-blue-200 transition">
          Regenerate Summary
        </button>
      </div>
    </div>
  );
}