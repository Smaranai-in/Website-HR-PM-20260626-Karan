// src/components/AcademicProjectsList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutDashboard,
  BookOpen,
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
  Briefcase,
} from "lucide-react";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AcademicProjectsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterDomain, setFilterDomain] = useState("All");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  const BASE_URL =process.env.REACT_APP_API_URL;

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null, // "approve" | "reject" | "delete"
    id: null,
    message: "",
  });

  useEffect(() => {
    if (!loadingUser) {
      if (!user || user?.UserRole !== "Admin") navigate("/");
    }
  }, [user, loadingUser]);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${BASE_URL}/api/academic/getAllProjects`,
          { withCredentials: true }
        );

        const data = res.data?.data || [];

        if (!cancelled) setItems(data);
      } catch (err) {
        console.error("Failed to load academic projects:", err);
        if (!cancelled) setError("Failed to load projects. Check console.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------- HELPERS (Preserved) ----------------
  const read = (obj, ...keys) => {
    for (const k of keys) if (obj && k in obj) return obj[k];
    return "";
  };

  const toSnake = (camel) =>
    camel.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());

  const escapeCsvValue = (value) => {
    if (value == null) return "";
    const str = String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  // ---------------- FILTER LOGIC ----------------
  const filtered = items.filter((it) => {
    const domain = (
      read(it, "projectDomain", "project_domain") || ""
    ).toString();

    if (filterDomain !== "All" && domain !== filterDomain) return false;

    if (!search) return true;

    const q = search.toLowerCase();
    return (
      read(it, "fullName", "full_name").toLowerCase().includes(q) ||
      read(it, "email").toLowerCase().includes(q) ||
      read(it, "projectTitle", "project_title").toLowerCase().includes(q)
    );
  });

  // ---------------- DETAILS & ACTIONS ----------------
  const openDetails = (id) => {
    const found = items.find((x) => String(x.id ?? x._id) === String(id));
    setSelected(found || null);
  };

  const closeDetails = () => {
    setSelected(null);
  };

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
        `${BASE_URL}/api/academic/updateStatus/${id}`,
        { status },
        { headers: { ...getAuthHeader() }, withCredentials: true }
      );

      setItems((prev) =>
        prev.map((p) =>
          String(p.id ?? p._id) === String(id) ? { ...p, status } : p
        )
      );

      if (selected && String(selected.id ?? selected._id) === String(id)) {
        setSelected((s) => ({ ...s, status }));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status.");
    }
  };

  // ---------------- DELETE PROJECT ----------------
  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/academic/deleteProject/${id}`,
        { headers: getAuthHeader(), withCredentials: true }
      );

      setItems((prev) =>
        prev.filter((p) => String(p.id ?? p._id) !== String(id))
      );

      setSelected(null);
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete project.");
    }
  };

  // ---------------- CSV EXPORT ----------------
  const exportCSV = () => {
    if (items.length === 0) {
      alert("No records to export.");
      return;
    }

    const columns = [
      { key: "id", label: "ID" },
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "phoneNumber", label: "Phone" },
      { key: "college", label: "College" },
      { key: "city", label: "City" },
      { key: "projectDomain", label: "Project Domain" },
      { key: "projectTitle", label: "Project Title" },
      { key: "graduationYear", label: "Graduation Year" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Submitted At" },
      { key: "description", label: "Description" },
    ];

    const header = columns.map((c) => escapeCsvValue(c.label)).join(",");

    const lines = items.map((row) =>
      columns
        .map((c) => escapeCsvValue(row[c.key] ?? row[toSnake(c.key)] ?? ""))
        .join(",")
    );

    const csv = "\uFEFF" + [header, ...lines].join("\r\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const name = `academic_projects_${Date.now()}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();

    URL.revokeObjectURL(url);
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

  const domainList = [
    "Web Development",
    "Mobile App Development",
    "AI / Machine Learning",
    "IoT / Robotics",
    "Data Science",
    "Cyber Security",
    "Cloud / DevOps",
  ];

  // ---------------- UI ----------------
  return (
    <div className="flex h-screen bg-[#f3f8f7] dark:bg-[#020c1b] font-sans text-slate-800 dark:text-slate-200 overflow-hidden pt-20 transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-[#0A0F2C] border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 z-20 shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              ✨
            </div>
            Academic Projects
          </h2>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
            Project Domains
          </h3>
          <nav className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1">
            <button
              onClick={() => {
                setFilterDomain("All");
                setSelected(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filterDomain === "All"
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <BookOpen size={18} />
              All Projects
            </button>

            {domainList.map((domain) => (
              <button
                key={domain}
                onClick={() => {
                  setFilterDomain(domain);
                  setSelected(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  filterDomain === domain
                    ? "bg-teal-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <ChevronRight
                  size={16}
                  className={
                    filterDomain === domain ? "text-white" : "text-gray-400"
                  }
                />
                <span className="truncate">{domain}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
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
              <Briefcase size={14} className="mr-2" /> Academic Projects
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Project Applicants{" "}
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
              placeholder="Search by name, email, or project title..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#112240] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                Loading projects...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No projects found matching "{filterDomain}".
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id ?? item._id}
                  onClick={() => openDetails(item.id ?? item._id)}
                  className={`group bg-white dark:bg-[#112240] p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-5
                                ${
                                  String(selected?.id ?? selected?._id) ===
                                  String(item.id ?? item._id)
                                    ? "ring-2 ring-teal-500 border-transparent shadow-md"
                                    : "border-gray-100 dark:border-gray-700"
                                }
                            `}
                >
                  {/* Initials */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm
                                ${
                                  item.status === "approved"
                                    ? "bg-gradient-to-br from-green-400 to-green-600"
                                    : "bg-gradient-to-br from-teal-400 to-teal-600"
                                }
                            `}
                  >
                    {getInitials(read(item, "fullName", "full_name"))}
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate">
                      {item.full_name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {item.project_domain}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded truncate max-w-[200px]">
                        {item.project_title || "No topic"}
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
                <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                  {getInitials(read(selected, "fullName", "full_name"))}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {read(selected, "fullName", "full_name")}
                  </h2>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-sm flex items-center gap-1">
                    <BookOpen size={14} />{" "}
                    {read(selected, "projectDomain", "project_domain")}
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
                  value={read(selected, "email")}
                />
                <Field
                  icon={<Phone size={14} />}
                  label="Phone"
                  value={read(selected, "phoneNumber", "phone")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  icon={<MapPin size={14} />}
                  label="City"
                  value={read(selected, "city")}
                />
                <Field
                  icon={<School size={14} />}
                  label="College"
                  value={read(selected, "college")}
                />
              </div>

              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900/30">
                <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-2">
                  <LayoutDashboard size={18} /> Project Info
                </h3>
                <div className="space-y-4">
                  <Field
                    label="Title"
                    value={read(selected, "projectTitle", "project_title")}
                    isFull
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Graduation Year"
                      value={read(selected, "graduationYear", "grad_year")}
                    />
                    <Field
                      label="Submitted"
                      value={new Date(
                        read(selected, "createdAt", "created_at")
                      ).toLocaleDateString()}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
                  Description
                </h4>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl text-sm text-gray-700 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700">
                  {read(selected, "description") || "No description provided."}
                </div>
              </div>

              {read(selected, "documentUrl", "document_url") && (
                <a
                  href={read(selected, "documentUrl", "document_url")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors text-teal-700 dark:text-teal-300 group"
                >
                  <div className="bg-white dark:bg-[#0A0F2C] p-2 rounded-lg text-teal-600 dark:text-teal-400 group-hover:text-teal-800 dark:group-hover:text-teal-200">
                    <FileText size={20} />
                  </div>
                  <span className="font-medium">View Project Document</span>
                </a>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-3 mb-3">
                <button
                  onClick={() =>
                    openConfirm(
                      "Are you sure you want to approve this project?",
                      "approve",
                      selected.id ?? selected._id
                    )
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve
                </button>
                <button
                  onClick={() =>
                    openConfirm(
                      "Are you sure you want to reject this project?",
                      "reject",
                      selected.id ?? selected._id
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
                    "Delete this project permanently?",
                    "delete",
                    selected.id ?? selected._id
                  )
                }
                className="w-full py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg text-sm transition-colors"
              >
                Delete Project
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
                onClick={() =>
                  setConfirmModal({ show: false, action: null, id: null })
                }
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
                    deleteProject(confirmModal.id);
                  } else {
                    updateStatus(
                      confirmModal.id,
                      confirmModal.action === "approve"
                        ? "approved"
                        : "rejected"
                    );
                  }
                  setConfirmModal({ show: false, action: null, id: null });
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