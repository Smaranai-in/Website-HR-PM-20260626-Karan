import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { ChevronDown } from "lucide-react";

const attendanceData = [
  { name: "John Doe", status: "Present", time: "09:45 AM" },
  { name: "Priya Verma", status: "Present", time: "09:52 AM" },
  { name: "Tejas Joshi", status: "On Leave", time: "Approved Leave" },
  { name: "Riya Patel", status: "Absent", time: "No Check-in Today" },
  { name: "Aditi Sharma", status: "Not Checked", time: "" },
  { name: "Shantanu Sharma", status: "Present", time: "09:52 AM" },
];

const statusConfig = {
  Present: {
    bg: "bg-[#CDE9E2]",
    text: "text-[#1F8A70]",
    dot: "bg-[#1F8A70]",
  },
  "On Leave": {
    bg: "bg-[#F4D8B5]",
    text: "text-[#C77700]",
    dot: "bg-[#C77700]",
  },
  Absent: {
    bg: "bg-[#F4C2C2]",
    text: "text-[#C0392B]",
    dot: "bg-[#C0392B]",
  },
  "Not Checked": {
    bg: "",
    text: "text-[#2F80ED]",
    dot: "",
  },
};

export function AttendanceStatus() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h3 className="text-xl font-semibold text-gray-800 mb-1">
        Intern Attendance Status Today
      </h3>

      <div className="space-y-3 mt-4">
        {attendanceData.map((item, index) => {
          const config = statusConfig[item.status as keyof typeof statusConfig];

          return (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl shadow-sm"
            >
              <span className="text-sm font-medium text-gray-800">
                {item.name}
              </span>

              {item.status === "Not Checked" ? (
                <span className="text-sm text-[#2F80ED]">
                  (Not Checked in Yet)
                </span>
              ) : (
                <div className="flex items-center gap-4">
                  <Badge
                    className={`rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${config.dot}`}
                    />
                    {item.status}
                  </Badge>

                  <span
                    className={`text-sm ${item.status === "Present"
                        ? "text-[#2F80ED]"
                        : "text-gray-600"
                      }`}
                  >
                    {item.status === "Present"
                      ? `Check-in: ${item.time}`
                      : item.time}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-5">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-xs text-gray-600 gap-1"
        >
          View Full Attendance
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}