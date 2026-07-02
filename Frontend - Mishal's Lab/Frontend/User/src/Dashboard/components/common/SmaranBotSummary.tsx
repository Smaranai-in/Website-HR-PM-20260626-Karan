import { Upload } from "lucide-react";

export default function SmaranBotSummary({ variant = "escalation" }) {
  return (
    <div className="bg-white rounded-[20px] shadow-figma px-8 py-6">
      {/* HEADER */}
      <div className="mb-5">
        <h3 className="text-[24px] font-semibold text-[#0F172A]">
          SmaranBot AI Summary
        </h3>
        <p className="text-[16px] text-[#6B7280]">
          Generated on 5 Nov, 2025
        </p>
      </div>

      {/* BODY (UNCHANGED) */}
      <div className="flex gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4 w-full sm:w-[420px]">
          <div className="bg-[#E9F2FF] px-4 py-3 rounded-[12px] text-[16px] font-medium">
            • 2 supervisors show declining intern ratings
          </div>

          <div className="bg-[#F2ECFF] rounded-[16px] px-4 py-4 flex justify-between items-center gap-5">
            <div className="text-[16px] font-medium leading-[18px]">
              • 3 interns resigned this week (within normal range)
              <br />• Avg task approval time improved by 12%
            </div>

            <div className="bg-white rounded-[14px] px-4 py-3 shadow-sm text-center">
              <div className="flex items-end gap-2 h-[42px] justify-center mb-2">
                <div className="w-2 h-5 bg-[#D1D5F0] rounded" />
                <div className="w-2 h-3 bg-[#D1D5F0] rounded" />
                <div className="w-2 h-7 bg-[#9CA3FF] rounded" />
                <div className="w-2 h-9 bg-[#6366F1] rounded" />
                <div className="w-2 h-6 bg-[#9CA3FF] rounded" />
                <div className="w-2 h-3 bg-[#D1D5F0] rounded" />
              </div>
              <p className="text-[11px] tracking-widest text-[#9CA3AF]">
                SMTWTFS
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="bg-[#D1FAF5] rounded-[14px] px-5 flex items-center justify-between w-full sm:w-[435px] h-[89px]">
            <div className="text-[16px] leading-[18px]">
              <p className="font-semibold mb-1 text-[#0F172A]">
                Key Recommendation
              </p>
              <p className="text-[#0F172A]">
                Schedule review with <b>Supervisor Tejas Joshi</b>
              </p>
            </div>

            <div className="bg-white rounded-[12px] px-4 py-3 flex items-center gap-4 shadow-sm">
              <div>
                <p className="text-[16px] font-semibold text-[#0F172A]">
                  530
                </p>
                <p className="text-[10px] text-[#9CA3AF]">
                  Lorem Ipsum
                </p>
              </div>

              <svg width="52" height="26" viewBox="0 0 52 26">
                <path
                  d="M2 16 C8 6, 14 20, 20 12 C26 4, 32 20, 44 16"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          <div className="bg-[#E8F2FF] rounded-[10px] flex items-center px-4 w-full sm:w-[436px] h-[51px] text-[16px]">
            <span className="text-[#0F172A]">
              • Overall program health:{" "}
              <span className="font-semibold text-[#16A34A]">
                Stable ✅
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER (CONDITIONAL – ONLY CHANGE) */}
      <div className="flex justify-between items-center mt-6">
        <button className="flex items-center gap-2 px-4 py-2 border border-[#CBD5E1] rounded-[10px] text-[#0F3C6E] text-[14px] font-medium hover:bg-[#F8FAFC]">
          <Upload size={16} />
          Export
        </button>

        {variant === "reports" ? (
          <button className="px-4 py-2 rounded-full bg-[#93C5FD] text-[#1E3A8A] shadow-md text-[16px] sm:text-[22px] font-medium">
            Regenerate
          </button>
        ) : (
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-full border border-[#CBD5E1] text-[#2563EB] text-[16px] font-medium shadow-sm">
              View Recommendation
            </button>
            <button className="px-6 py-2 rounded-full bg-[#93C5FD] text-[#1E3A8A] shadow-md text-[16px] font-medium">
              Take Actions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
