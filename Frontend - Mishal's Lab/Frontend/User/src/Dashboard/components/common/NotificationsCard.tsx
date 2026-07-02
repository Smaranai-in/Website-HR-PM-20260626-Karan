import {
  FileText,
  Mail,
  LogOut,
  UserCheck,
} from "lucide-react";

const notifications = [
  {
    icon: FileText,
    title: "Supervisor Tejas Joshi needs performance review",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    icon: FileText,
    title: "Monthly Supervisor performance report ready",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    icon: Mail,
    title: "Message from Ravi Kumar (AI Intern) (1)",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    icon: LogOut,
    title: "2 interns resigned under Ravi Kumar",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
  {
    icon: UserCheck,
    title: "Supervisor Musfiq approved intern attendance",
    date: "4 November 2025",
    time: "05:30 PM",
    id: "304WEB",
  },
];

export default function NotificationsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F172A]">
          Notifications
        </h3>
        <button className="bg-[#E5E7EB] text-xs sm:text-sm px-4 py-1.5 rounded-full hover:bg-gray-200 transition">
          View All
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {notifications.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-[#E5E7EB] rounded-xl px-4 py-4"
            >
              {/* LEFT */}
              <div className="flex gap-3 items-start">
                <Icon size={20} className="mt-1 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-medium text-[#0F172A] break-words">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#6B7280] break-words">
                    {item.date} • {item.time} • ID: {item.id}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex justify-end sm:justify-start">
                <button className="bg-[#C4B5FD] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm hover:bg-[#A78BFA] transition">
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}