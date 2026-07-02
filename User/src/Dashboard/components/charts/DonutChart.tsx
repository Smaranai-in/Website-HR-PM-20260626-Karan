
export default function DonutChart() {
  const percentage = 75;

  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">

      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A] mb-6">
        Supervisor Task Assigned Progress
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* DONUT */}
        <div className="relative w-40 h-40 sm:w-[180px] sm:h-[180px]">
          <svg
            viewBox={`0 0 ${size} ${size}`}
            width="100%"
            height="100%"
            className="-rotate-90"
          >
            {/* Background */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#7C3AED"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-semibold text-[#0F172A]">
              {percentage}%
            </span>
          </div>
        </div>

        {/* LEGEND */}
        <div className="space-y-3 text-sm sm:text-base">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#7C3AED]" />
            <span className="text-[#0F172A]">Completed</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#D1D5DB]" />
            <span className="text-[#0F172A]">Pending</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm sm:text-base text-center text-[#64748B]">
        % of Task Assign Completion To Intern
      </p>
    </div>
  );
}