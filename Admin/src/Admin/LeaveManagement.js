import React, { useEffect, useState } from "react";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
    Search,
    Calendar,
    FileText,
    X,
    CheckCircle,
    XCircle,
    User,
    Clock,
    ExternalLink,
    Filter,
    MessageSquare,
    AlertCircle,
    Check,
    Download
} from "lucide-react";
import { toast } from "react-toastify";

export default function LeaveManagement() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const { profile, loadingUser } = useAuthModal();
    const navigate = useNavigate();

    const [adminRemarks, setAdminRemarks] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const callEdge = async (action, payload = {}) => {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
            throw new Error("No active session token");
        }

        const response = await fetch(
            `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ action, ...payload }),
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result?.error) {
            throw new Error(result?.error || "Edge request failed");
        }

        return result;
    };

    useEffect(() => {
        if (!loadingUser) {
            if (!profile || profile?.role !== "admin") navigate("/");
        }
    }, [profile, loadingUser, navigate]);

    // ---------------- LOAD DATA ----------------
    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await callEdge("get_all_leaves");
            setItems(res.leaves || []);
        } catch (err) {
            console.error("Failed to load leave requests:", err);
            setError("Failed to load leave requests.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Clean up remarks when selection changes
    useEffect(() => {
        setAdminRemarks(selected?.remarks || "");
    }, [selected]);

    const handleUpdateStatus = async (status) => {
        if (!selected) return;
        setActionLoading(true);
        try {
            await callEdge("update_leave_status", {
                leave_id: selected.id,
                status,
                remarks: adminRemarks
            });
            toast.success(`Leave request ${status.toLowerCase()} successfully!`);
            // Refresh list
            await loadData();
            // Close details
            setSelected(null);
        } catch (err) {
            console.error("Failed to update status:", err);
            toast.error(err.message || "Failed to update leave status.");
        } finally {
            setActionLoading(false);
        }
    };

    const getInitials = (name) => {
        return name
            ? name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "??";
    };

    const getFullName = (item) => {
        return item?.w_users?.name || item?.w_users?.email || item?.user_id || "Unknown Intern";
    };

    const statusList = ["Pending", "Approved", "Rejected"];

    // ---------------- FILTER LOGIC ----------------
    const filtered = items.filter((it) => {
        if (filterStatus !== "All" && it.status !== filterStatus) return false;
        if (!search) return true;

        const q = search.toLowerCase();
        const name = getFullName(it).toLowerCase();
        const type = (it.leave_type || "").toLowerCase();
        const reason = (it.reason || "").toLowerCase();
        return name.includes(q) || type.includes(q) || reason.includes(q);
    });

    const getStatusColor = (status) => {
        if (status === "Approved") return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200/20";
        if (status === "Pending") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/20";
        if (status === "Rejected") return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200/20";
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    };

    return (
        <div className="flex h-screen bg-[#f3f8f7] dark:bg-[#020c1b] font-sans text-slate-800 dark:text-slate-200 overflow-hidden pt-20 transition-colors duration-300">
            {/* SIDEBAR FOR STATUS FILTER */}
            <aside className="w-72 bg-white dark:bg-[#0A0F2C] border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 shadow-sm hidden md:flex">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Calendar size={16} />
                    </div>
                    <h2 className="text-xl font-bold">Leave Requests</h2>
                </div>

                <div className="p-4 flex-1 overflow-hidden flex flex-col">
                    <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
                        Status Filters
                    </h3>
                    <nav className="space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                        <button
                            onClick={() => {
                                setFilterStatus("All");
                                setSelected(null);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${filterStatus === "All"
                                ? "bg-amber-500 text-white shadow-md"
                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            <Calendar size={18} />
                            All Applications
                        </button>

                        {statusList.map((st) => (
                            <button
                                key={st}
                                onClick={() => {
                                    setFilterStatus(st);
                                    setSelected(null);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${filterStatus === st
                                    ? "bg-amber-500 text-white shadow-md"
                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {st === "Approved" ? <CheckCircle size={16} className={filterStatus === st ? "text-white" : "text-gray-400"} /> :
                                    st === "Pending" ? <Clock size={16} className={filterStatus === st ? "text-white" : "text-gray-400"} /> :
                                        <XCircle size={16} className={filterStatus === st ? "text-white" : "text-gray-400"} />}
                                <span className="truncate capitalize">{st}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* LIST OF REQUESTS */}
                <div className={`flex flex-col p-4 sm:p-8 overflow-hidden transition-all duration-300 ${selected ? "lg:w-7/12 w-full" : "w-full"}`}>
                    <div className="mb-8">
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium">
                                <Calendar size={14} className="mr-2" /> Leave Management
                            </div>
                            <span className="text-gray-400 dark:text-gray-500 text-xl font-normal ml-2">
                                {filtered.length} requests
                            </span>
                        </div>
                    </div>

                    {/* MOBILE STATUS FILTER (md and below) */}
                    <div className="flex items-center gap-3 mb-4 md:hidden">
                        <Filter size={16} className="text-amber-500 flex-shrink-0" />
                        <select
                            value={filterStatus}
                            onChange={(e) => { setFilterStatus(e.target.value); setSelected(null); }}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#112240] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="All">All Applications</option>
                            {statusList.map(st => (
                                <option key={st} value={st}>{st}</option>
                            ))}
                        </select>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by intern name, type, or reason..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#112240] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-center">
                            {error}
                        </div>
                    )}

                    {/* SCROLLABLE LIST */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-20 text-gray-400 animate-pulse">
                                Loading leave requests...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                No leave requests found.
                            </div>
                        ) : (
                            filtered.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setSelected(item)}
                                    className={`group bg-white dark:bg-[#112240] p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-5
                                        ${selected?.id === item.id
                                            ? "ring-2 ring-amber-500 border-transparent shadow-md"
                                            : "border-gray-100 dark:border-gray-700"
                                        }
                                    `}
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                                        {getInitials(getFullName(item))}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate">
                                            {getFullName(item)}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                                            <Calendar size={14} /> {item.leave_type} Leave • {new Date(item.start_date).toLocaleDateString()} to {new Date(item.end_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                                            "{item.reason}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* SLIDE-OVER SIDE DETAILS PANEL */}
                {selected && (
                    <div className="w-full lg:w-5/12 bg-white dark:bg-[#0A0F2C] border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl z-30 absolute right-0 h-full animate-in slide-in-from-right-10 duration-300">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                            <button
                                onClick={() => setSelected(null)}
                                className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                <X size={20} />
                            </button>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(selected.status)}`}>
                                {selected.status}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {/* Applicant Info */}
                            <div className="flex items-center gap-4 border-b dark:border-gray-800 pb-6">
                                <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                    {getInitials(getFullName(selected))}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {getFullName(selected)}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {selected?.w_users?.email || "No Email"}
                                    </p>
                                </div>
                            </div>

                            {/* Leave Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Leave Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Leave Type</p>
                                        <p className="text-sm font-semibold">{selected.leave_type} Leave</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Duration</p>
                                        <p className="text-sm font-semibold">
                                            {new Date(selected.start_date).toLocaleDateString()} to {new Date(selected.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Reason</p>
                                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm leading-relaxed italic">
                                        "{selected.reason}"
                                    </div>
                                </div>
                            </div>

                            {/* Proof/Attachment */}
                            {selected.attachment_url && (
                                <a
                                    href={selected.attachment_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 rounded-xl hover:bg-amber-100/50 transition-colors text-amber-700 dark:text-amber-400 group"
                                >
                                    <div className="bg-white dark:bg-[#0A0F2C] p-2 rounded-lg text-amber-600 dark:text-amber-400">
                                        <FileText size={20} />
                                    </div>
                                    <span className="font-medium flex-1 text-sm">Download/View Leave Proof</span>
                                    <ExternalLink size={16} />
                                </a>
                            )}

                            {/* Approve/Reject Controls (only if status is Pending) */}
                            {selected.status === "Pending" ? (
                                <div className="space-y-4 pt-4 border-t dark:border-gray-800">
                                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin Decision</h3>
                                    
                                    <div>
                                        <label className="text-xs font-semibold text-slate-500 block mb-1.5">Remarks (Optional)</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Write feedback, reason for rejection, or approval notes..."
                                            value={adminRemarks}
                                            onChange={(e) => setAdminRemarks(e.target.value)}
                                            className="w-full bg-white dark:bg-[#0a192f] border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none text-slate-800 dark:text-white"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleUpdateStatus("Approved")}
                                            disabled={actionLoading}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <Check size={18} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus("Rejected")}
                                            disabled={actionLoading}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            <X size={18} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Decision Log</span>
                                    <p className="text-sm">
                                        Status: <span className="font-semibold">{selected.status}</span>
                                    </p>
                                    {selected.remarks && (
                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            Remarks: <span className="italic">"{selected.remarks}"</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
