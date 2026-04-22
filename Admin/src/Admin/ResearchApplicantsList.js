// src/components/ResearchApplicantsList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  Users,
  FileText,
  Download,
  X,
  CheckCircle,
  XCircle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  School,
  Calendar,
  Trash2, // Ensure Trash2 is imported if used, based on context of previous files
} from "lucide-react";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ResearchApplicantsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterSupport, setFilterSupport] = useState("All");
  const [error, setError] = useState(null);

  const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();
  // Added local search state for the UI search bar
  const [searchQuery, setSearchQuery] = useState("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    id: null,
    message: "",
  });

  const BASE_URL =process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!loadingUser) {
      if (!user || user?.UserRole !== "Admin") navigate("/");
    }
  }, [user, loadingUser]);

  // ---------------- FETCH DATA (Your Original Logic) ----------------
  useEffect(() => {
    async function loadApplicants() {
      setLoading(true);

      try {
        const res = await axios.get(
          `${BASE_URL}/api/research/getResearchData`,
          { withCredentials: true }
        );

        const data = res.data.data || [];

        const mapped = data.map((x) => ({
          ...x,
          phone_number: x.phone,
          college_university: x.college,
          graduation_year: x.grad_year,
          profile_type: x.role,
          research_topic: x.topic,
          research_stage: x.stage,
        }));

        setItems(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load applicants.");
      } finally {
        setLoading(false);
      }
    }

    loadApplicants();
  }, []);

  // ---------------- FILTER SUPPORT (Your Original Logic + Search) ----------------
  const filtered = items.filter((it) => {
    // 1. Your original Support Filter
    let matchSupport = true;
    if (filterSupport !== "All") {
      const support = Array.isArray(it.support_needed)
        ? it.support_needed.join(", ")
        : String(it.support_needed || "");
      if (!support.toLowerCase().includes(filterSupport.toLowerCase())) {
        matchSupport = false;
      }
    }

    // 2. Added Name/Email Search for the UI Search Bar
    let matchSearch = true;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      matchSearch =
        it.full_name?.toLowerCase().includes(q) ||
        it.email?.toLowerCase().includes(q) ||
        it.research_topic?.toLowerCase().includes(q);
    }

    return matchSupport && matchSearch;
  });

  // ---------------- VIEW DETAILS ----------------
  const openDetails = (id) => {
    const found = items.find((x) => x.id === id);
    setSelected(found || null);
  };

  const closeDetails = () => {
    setSelected(null);
  };

  // ---------------- CONFIRMATION POPUP ----------------
  const openConfirm = (message, action, id) => {
    setConfirmModal({
      show: true,
      action,
      id,
      message,
    });
  };

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/api/research/updateStatus/${id}`,
        { status },
        { withCredentials: true }
      );

      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err) {
      alert("Status update failed.");
      console.error(err);
    }
  };

  // ---------------- DELETE APPLICANT ----------------
  const deleteApplicant = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/research/deleteApplicant/${id}`,
        { withCredentials: true, headers: getAuthHeader() }
      );

      setItems((prev) => prev.filter((p) => p.id !== id));
      setSelected(null);
    } catch (err) {
      alert("Delete failed.");
      console.error(err);
    }
  };

  // ---------------- CSV EXPORT ----------------
  const escapeCsv = (v) => {
    if (!v) return "";
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const exportCSV = () => {
    const cols = [
      "id",
      "full_name",
      "phone_number",
      "email",
      "country",
      "state",
      "city",
      "college_university",
      "graduation_year",
      "profile_type",
      "research_topic",
      "research_stage",
      "description",
      "support_needed",
      "document_url",
      "status",
      "created_at",
    ];

    const header = cols.join(",");
    const rows = items.map((row) =>
      cols.map((c) => escapeCsv(row[c])).join(",")
    );

    const csv = "\uFEFF" + [header, ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "research_applicants.csv";
    a.click();
  };

  // Helper for Initials
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

  const filterCategories = [
    "Topic Selection Guidance",
    "Literature Review Support",
    "Survey / Questionnaire Preparation",
    "Methodology Design",
    "Statistical Analysis",
    "Coding / ML Implementation",
    "Report Writing",
    "Proofreading",
    "Journal Publication Assistance",
  ];

  // ---------------- UI ----------------
  return (
    <div className="flex h-screen bg-[#f3f8f7] dark:bg-[#020c1b] font-sans text-slate-800 dark:text-slate-200 overflow-hidden mt-16 transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-[#0A0F2C] border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 z-20 shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              ✨
            </div>
            Research Applicants
          </h2>
        </div>

        <div className="p-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
            Filters
          </h3>
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
            <button
              onClick={() => setFilterSupport("All")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterSupport === "All"
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Users size={18} />
              All Applicants
            </button>

            {filterCategories.map((s) => (
              <button
                key={s}
                onClick={() => setFilterSupport(s)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  filterSupport === s
                    ? "bg-teal-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <ChevronRight
                  size={16}
                  className={
                    filterSupport === s ? "text-white" : "text-gray-400"
                  }
                />
                <span className="truncate">{s}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={exportCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* CENTER COLUMN: LIST */}
        <div
          className={`flex flex-col p-8 overflow-hidden transition-all duration-300 ${
            selected ? "w-7/12" : "w-full"
          }`}
        >
          {/* HEADER */}
          <div className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-3">
              <Users size={14} className="mr-2" /> Research Support
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Enrollment Requests{" "}
              <span className="text-gray-400 dark:text-gray-500 text-xl font-normal ml-2">
                {items.length}
              </span>
            </h1>
          </div>

          {/* SEARCH BAR */}
          <div className="relative mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or topic..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#112240] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30 text-center">
              {error}
            </div>
          )}

          {/* SCROLLABLE LIST */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="text-center py-20 text-gray-400">
                Loading applicants...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No applicants found matching "{filterSupport}".
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => openDetails(item.id)}
                  className={`group bg-white dark:bg-[#112240] p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-5
                                ${
                                  selected?.id === item.id
                                    ? "ring-2 ring-teal-500 border-transparent shadow-md"
                                    : "border-gray-100 dark:border-gray-700"
                                }
                            `}
                >
                  {/* Initials */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm
                                ${
                                  item.id % 2 === 0
                                    ? "bg-gradient-to-br from-teal-400 to-teal-600"
                                    : "bg-gradient-to-br from-emerald-400 to-emerald-600"
                                }
                            `}
                  >
                    {getInitials(item.full_name)}
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate">
                      {item.full_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {item.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded truncate max-w-[200px]">
                        {item.research_topic || "No topic"}
                      </span>
                    </div>
                  </div>

                  {/* Status + Date on the right */}
                  <div className="flex flex-col items-end gap-1 ">
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mr-4">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : ""}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
      ${
        item.status === "approved"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : item.status === "rejected"
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      }
    `}
                    >
                      {item.status || "pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        {selected && (
          <div className="w-5/12 bg-white dark:bg-[#0A0F2C] border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl z-30 absolute right-0 h-full animate-in slide-in-from-right-10 duration-300">
            {/* Details Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex justify-between items-start mb-4">
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <X size={20} />
                </button>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                            ${
                              selected.status === "approved"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : selected.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            }
                        `}
                >
                  {selected.status || "PENDING"}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md
                            ${
                              selected.id % 2 === 0
                                ? "bg-teal-500"
                                : "bg-emerald-500"
                            }`}
                >
                  {getInitials(selected.full_name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selected.full_name}
                  </h2>
                  <p className="text-teal-600 dark:text-teal-400 font-medium">
                    {selected.profile_type || "Applicant"}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  icon={<Mail size={14} />}
                  label="Email"
                  value={selected.email}
                />
                <Field
                  icon={<Phone size={14} />}
                  label="Phone"
                  value={selected.phone_number}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  icon={<MapPin size={14} />}
                  label="Location"
                  value={[selected.city, selected.state, selected.country]
                    .filter(Boolean)
                    .join(", ")}
                />
                <Field
                  icon={<School size={14} />}
                  label="University"
                  value={selected.college_university}
                />
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900/30">
                <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-2">
                  <LayoutDashboard size={18} /> Research Details
                </h3>
                <div className="space-y-4">
                  <Field
                    label="Topic"
                    value={selected.research_topic}
                    isFull
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Stage" value={selected.research_stage} />
                    <Field
                      label="Grad Year"
                      value={selected.graduation_year}
                    />
                  </div>
                  <Field
                    label="Support Needed"
                    value={selected.support_needed}
                    isFull
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
                  Description
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700">
                  {selected.description || "No description provided."}
                </div>
              </div>

              {selected.document_url && (
                <a
                  href={selected.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors text-teal-700 dark:text-teal-300 group"
                >
                  <div className="bg-white dark:bg-[#0A0F2C] p-2 rounded-lg text-teal-600 dark:text-teal-400 group-hover:text-teal-800 dark:group-hover:text-teal-200">
                    <FileText size={20} />
                  </div>
                  <span className="font-medium">View Attached Proposal</span>
                </a>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() =>
                    openConfirm(
                      "Approve this application?",
                      "approve",
                      selected.id
                    )
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button
                  onClick={() =>
                    openConfirm(
                      "Reject this application?",
                      "reject",
                      selected.id
                    )
                  }
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
              <button
                onClick={() =>
                  openConfirm(
                    "Delete this application permanently?",
                    "delete",
                    selected.id
                  )
                }
                className="w-full py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors"
              >
                Delete Application
              </button>
            </div>
          </div>
        )}
      </main>

      {/* CONFIRMATION MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl w-[350px] shadow-2xl text-center">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4
                ${
                  confirmModal.action === "approve"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }
            `}
            >
              {confirmModal.action === "approve" ? (
                <CheckCircle size={24} />
              ) : (
                <XCircle size={24} />
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              {confirmModal.message}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                onClick={() => setConfirmModal({ show: false })}
              >
                Cancel
              </button>
              <button
                className={`flex-1 py-2.5 rounded-lg text-white font-medium shadow-md transition-colors
                    ${
                      confirmModal.action === "approve"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    }
                    ${
                      confirmModal.action === "delete"
                        ? "bg-gray-800 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600"
                        : ""
                    }
                `}
                onClick={() => {
                  if (confirmModal.action === "delete") {
                    deleteApplicant(confirmModal.id);
                  } else {
                    updateStatus(
                      confirmModal.id,
                      confirmModal.action === "approve" ? "approved" : "rejected"
                    );
                  }
                  setConfirmModal({ show: false });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- SUB COMPONENT ----------------
function Field({ label, value, icon, isFull }) {
  return (
    <div className={isFull ? "col-span-2" : ""}>
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 break-words">
        {value || "—"}
      </p>
    </div>
  );
}