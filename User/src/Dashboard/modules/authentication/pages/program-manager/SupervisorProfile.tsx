import { useLocation, useParams } from "react-router-dom";
import { TrendingUp, BarChart2, Info, Calendar, Phone, MoreHorizontal, Star } from "lucide-react";
import SummaryCard from "../../../../components/cards/SummaryCard";
import { performanceSummary, interns, supervisors } from "./data/mockData";

export default function SupervisorProfile() {
    const location = useLocation();
    const params = useParams();

    const supervisorFromState = location.state;
    const idx =
        typeof params.id !== "undefined" ? Number(params.id) : null;

    const supervisor =
        supervisorFromState ||
        (idx !== null && supervisors[idx]) ||
        supervisors[0];

    const myInterns = interns.filter(
        (i) => i.manager === supervisor?.name
    );

    return (
        <div className="space-y-8 bg-[#f5f0fe] p-6 sm:p-8 lg:p-12">

            {/* ================= SUMMARY ================= */}
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-[#1E1B4B]">
                            Summary
                        </h2>
                        <p className="text-sm text-gray-500">
                            Today’s summary
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
                            <Calendar size={16} />
                            Today: 5 Nov, 2025
                        </button>
                        <button className="px-4 py-2 border rounded-lg text-sm">
                            Export
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                    {performanceSummary.map((item, i) => (
                        <SummaryCard key={i} {...item} />
                    ))}
                </div>
            </div>

            {/* ================= PROFILE HEADER (banner) ================= */}
            <div className="rounded-2xl py-8 px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B4B]">
                    Supervisor Profile
                </h2>
                <p className="text-gray-500 mt-2">
                    Lorem ipsum dolor sit amet, consectetur adipisci
                </p>

                <div className="mt-5 flex justify-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm shadow-sm">
                        <Phone size={16} />
                        Start Meeting
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm shadow-sm">
                        <Calendar size={16} />
                        Schedule Meeting
                    </button>
                </div>
            </div>

            {/* ================= SUPERVISOR INFO ================= */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">
                    Supervisor Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                    <div><strong>Name :</strong> {supervisor?.name}</div>
                    <div><strong>Email :</strong> {supervisor?.email}</div>
                    <div><strong>Role :</strong> Senior Supervisor</div>
                    <div><strong>Active Since :</strong> Jan 2024</div>
                </div>
            </div>

            {/* ================= INTERNS UNDER SUPERVISOR (custom table) ================= */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">
                    Interns Under Supervisor
                </h3>

                <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                        {/* header */}
                        <div className="grid grid-cols-[2.5fr_1.6fr_1.2fr_1fr_1fr_0.5fr] bg-[#D9ECFF] px-6 py-3 rounded-[10px] text-sm font-semibold text-[#0F172A]">
                            <span>Name</span>
                            <span>Role</span>
                            <span>Status</span>
                            <span>Rating Given</span>
                            <span>Performance</span>
                            <span className="text-center">Action</span>
                        </div>

                        {/* rows */}
                        <div className="mt-4 space-y-3">
                            {myInterns.length > 0 ? (
                                myInterns.map((it, idx) => {
                                    const perfMap = {
                                        Active: "Excellent",
                                        Onboarding: "Good",
                                        Completed: "Good",
                                        Inactive: "Poor",
                                        Fired: "Poor",
                                        Resigned: "Poor",
                                    };

                                    const performance = perfMap[it.status] || "—";
                                    const rating = it.rating ?? "—";

                                    return (
                                        <div key={idx} className="grid grid-cols-[2.5fr_1.6fr_1.2fr_1fr_1fr_0.5fr] items-center px-6 py-4 border border-[#EEF2F7] rounded-xl bg-white">
                                            <div className="flex items-center gap-3">
                                                <img src={it.avatar} alt={it.name} className="w-9 h-9 rounded-full object-cover" />
                                                <div>
                                                    <p className="font-medium text-sm text-[#0F172A]">{it.name}</p>
                                                </div>
                                            </div>

                                            <span className="text-sm">{it.role}</span>

                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${it.status === "Active" ? "bg-[#DCFCE7] text-[#16A34A]" : it.status === "Completed" ? "bg-[#E0F2FE] text-[#0284C7]" : it.status === "Resigned" ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#F3F4F6] text-[#374151]"}`}>
                                                    {it.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{rating}</span>
                                                <Star size={16} fill="#FBBF24" className="text-[#FBBF24]" />
                                            </div>

                                            <div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${performance === "Excellent" ? "bg-[#DCFCE7] text-[#16A34A]" : performance === "Good" ? "bg-[#E0F2FE] text-[#0284C7]" : performance === "Poor" ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#F3F4F6] text-[#374151]"}`}>
                                                    {performance}
                                                </span>
                                            </div>

                                            <div className="flex justify-center">
                                                <button className="text-gray-500 hover:text-gray-800"><MoreHorizontal size={18} /></button>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-sm text-gray-500">No interns found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= FEEDBACK ================= */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">
                    Feedback Summary
                </h3>

                <ul className="space-y-2 text-sm text-gray-700">
                    <li>👍 Supportive mentoring (6 mentions)</li>
                    <li>👍 Timely feedback (4 mentions)</li>
                    <li>⚠️ Task clarity issues (2 mentions)</li>
                </ul>
            </div>

            {/* ================= PERFORMANCE TRENDS ================= */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">
                    Performance Trends
                </h3>

                <div className="flex flex-col md:flex-row gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} />
                        Rating Trend (Last 6 Months)
                    </div>

                    <div className="flex items-center gap-2">
                        <BarChart2 size={18} />
                        Intern Dropout vs Completion
                    </div>

                    <div className="flex items-center gap-2">
                        <Info size={18} />
                        Avg Task Review Time
                    </div>
                </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-[#1E1B4B] mb-6">
                    Actions
                </h3>

                <div className="flex flex-wrap gap-6">
                    <button className="px-6 py-3 rounded-xl bg-[#CFF7EC] text-[#065F46] shadow">
                        Schedule Review
                    </button>

                    <button className="px-6 py-3 rounded-xl bg-[#E9D5FF] text-[#6B21A8] shadow">
                        Improvement Plan
                    </button>

                    <button className="px-6 py-3 rounded-xl bg-[#FCD9B6] text-[#92400E] shadow">
                        Message
                    </button>

                    <button className="px-6 py-3 rounded-xl bg-[#FECACA] text-[#991B1B] shadow">
                        Escalate to HR
                    </button>
                </div>
            </div>

        </div>
    );
}