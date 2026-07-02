import { FileText, CheckCircle, Award, Calendar } from "lucide-react";

export type ActivityItem = {
  id: string;
  type: "offer" | "approval" | "certificate" | "leave";
  title: string;
  name: string;
  date: string;
  time: string;
  refId: string;
};

export const activities: ActivityItem[] = [
  {
    id: "1",
    type: "approval",
    title: "Supervisor Musfiq",
    name: "approved 3 intern reports",
    date: "4 November 2025",
    time: "05:30 PM",
    refId: "304WEB",
  },
  {
    id: "2",
    type: "certificate",
    title: "Intern Aditi Sharma",
    name: "completed internship",
    date: "4 November 2025",
    time: "05:30 PM",
    refId: "304WEB",
  },
  {
    id: "3",
    type: "offer",
    title: "Added performance feedback for",
    name: "John Doe",
    date: "4 November 2025",
    time: "05:30 PM",
    refId: "304WEB",
  },
  {
    id: "4",
    type: "approval",
    title: "Supervisor Tejas Joshi",
    name: "flagged for low rating",
    date: "4 November 2025",
    time: "05:30 PM",
    refId: "304WEB",
  },
  {
    id: "5",
    type: "offer",
    title: "HR",
    name: "scheduled interview for 2 applicants",
    date: "4 November 2025",
    time: "05:30 PM",
    refId: "304WEB",
  },
  {
    id: "6",
    type: "approval",
    title: "Supervisor Musfiq",
    name: "viewed attendance timeline of John Doe",
    date: "4 November 2025",
    time: "05:30 PM",
    refId: "304WEB",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "offer":
      return FileText;
    case "approval":
      return CheckCircle;
    case "certificate":
      return Award;
    case "leave":
      return Calendar;
    default:
      return FileText;
  }
};

export default function RecentActivityLog() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0F172A]">
          Recent Activity Log
        </h2>
        <p className="text-sm text-[#64748B]">
          Lorem ipsum dolor sit amet, consectetur adipiscing
        </p>
      </div>

      {/* INNER CONTAINER */}
      <div className="border border-[#E5E7EB] rounded-2xl p-4 space-y-4">

        {activities.map((item) => {
          const Icon = getIcon(item.type);

          return (
            <div
              key={item.id}
              className="flex items-center justify-between border border-[#E5E7EB] rounded-xl px-4 py-4"
            >

              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">

                <div className="w-10 h-10 flex items-center justify-center border rounded-md">
                  <Icon size={20} />
                </div>

                <div>
                  <p className="text-sm text-[#0F172A]">
                    <span className="font-semibold">{item.title}</span>{" "}
                    {item.name}
                  </p>

                  <div className="flex gap-6 text-xs text-[#64748B] mt-1">
                    <span>{item.date}</span>
                    <span>{item.time}</span>
                    <span>ID: {item.refId}</span>
                  </div>
                </div>

              </div>

              {/* VIEW BUTTON */}
              <button className="px-5 py-2 text-sm bg-[#7CB3EB] text-white rounded-full hover:bg-[#5FA0E0] transition">
                View
              </button>

            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="flex justify-center mt-6">
        <button className="px-6 py-2 text-sm border rounded-full text-[#475569] hover:bg-gray-100">
          See All
        </button>
      </div>

    </div>
  );
}