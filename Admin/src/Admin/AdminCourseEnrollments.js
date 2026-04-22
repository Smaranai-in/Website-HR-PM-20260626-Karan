// src/components/AdminCourseEnrollments.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import {
  Search,
  BookOpen,
  Download,
  X,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  School,
  GraduationCap,
  Briefcase,
  Info,
} from "lucide-react";

export default function AdminCourseEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterView, setFilterView] = useState("All");

  const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  const BASE_URL =process.env.REACT_APP_API_URL;

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    if (!loadingUser) {
      if (!user || user?.UserRole !== "Admin") {
        navigate("/");
      }
    }
  }, [user, loadingUser, navigate]);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const loadEnrollments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/api/courseEnroll/getAllCourseEnroll`,
          { withCredentials: true }
        );

        console.log(res);
        // Try multiple possible keys to be safe
        const apiData =
          res.data?.domains ||
          res.data?.enrollments ||
          res.data?.data ||
          [];

        console.log("API course enrollments:", apiData);
        setEnrollments(Array.isArray(apiData) ? apiData : []);
      } catch (err) {
        console.error("Error loading enrollments:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEnrollments();
  }, []);

  // ---------------- FILTER LOGIC ----------------
  const filtered = enrollments.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();

    const courseName = item.course_details?.course_name || "";
    const courseDomain = item.course_details?.course_domain || "";

    return (
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.degree_program?.toLowerCase().includes(q) ||
      courseName.toLowerCase().includes(q) ||
      courseDomain.toLowerCase().includes(q)
    );
  });

  // ---------------- HELPERS ----------------
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCloseDetails = () => setSelected(null);
  const handleViewDetails = (item) => setSelected(item);

  // ---------------- CSV EXPORT ----------------
  const escapeCsv = (v) => {
    if (!v) return "";
    const s = String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const exportCSV = () => {
    if (!enrollments || enrollments.length === 0) {
      alert("No data to export");
      return;
    }

    const cols = [
      "name",
      "email",
      "phno",
      "city",
      "state",
      "country",
      "college_university",
      "degree_program",
      "year_of_study",
      "field_of_study",
      "prior_experience",
      "reason_for_taking_course",
    ];

    const header = cols.join(",");
    const rows = enrollments.map((row) =>
      cols.map((c) => escapeCsv(row?.[c])).join(",")
    );
    const csv = "\uFEFF" + [header, ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "course_enrollments.csv";
    a.click();
  };

  // ---------------- UI ----------------
  return (
    <div className="flex h-screen bg-[#f3f8f7] dark:bg-[#020c1b] font-sans text-slate-800 dark:text-slate-200 overflow-hidden pt-16 transition-colors duration-300">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-[#0A0F2C] border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 z-20 shadow-sm transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              ✨
            </div>
            Course
          </h2>
        </div>

        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
            Course Admin
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => {
                setFilterView("All");
                setSelected(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                filterView === "All"
                  ? "bg-teal-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <BookOpen size={18} />
              <span className="flex-1">Enrollments</span>
              {filterView === "All" && (
                <ChevronRight size={16} className="text-white/80" />
              )}
            </button>
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
              <BookOpen size={14} className="mr-2" /> Course Management
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Course Enrollments{" "}
              <span className="text-gray-400 dark:text-gray-500 text-xl font-normal ml-2">
                {enrollments.length}
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
              placeholder="Search name, email, degree, course name, domain..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#112240] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* SCROLLABLE LIST */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="text-center py-20 text-gray-400">
                Loading data...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No enrollments found.
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleViewDetails(item)}
                  className={`group bg-white dark:bg-[#112240] p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md flex items-center gap-5 ${
                    selected?.id === item.id
                      ? "ring-2 ring-teal-500 border-transparent shadow-md"
                      : "border-gray-100 dark:border-gray-700"
                  }`}
                >
                  {/* Initials */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm ${
                      item.id % 2 === 0
                        ? "bg-gradient-to-br from-teal-400 to-teal-600"
                        : "bg-gradient-to-br from-cyan-400 to-cyan-600"
                    }`}
                  >
                    {getInitials(item.name)}
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {item.email}
                    </p>

                    {/* DEGREE */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded truncate max-w-[200px] flex items-center gap-1">
                        <GraduationCap size={12} />{" "}
                        {item.degree_program || "N/A"}
                      </span>
                    </div>

                    {/* COURSE NAME */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded truncate max-w-[260px]">
                        📘{" "}
                        {item.course_details?.course_name || "No Course Name"}
                      </span>
                    </div>

                    {/* COURSE DOMAIN */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded truncate max-w-[260px]">
                        🌐{" "}
                        {item.course_details?.course_domain || "No Domain"}
                      </span>
                    </div>
                  </div>

                  {/* Chevron */}
                  <div className="text-gray-300 dark:text-gray-600 group-hover:text-teal-500">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS */}
        {selected && (
          <div className="w-5/12 bg-white dark:bg-[#0A0F2C] border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl z-30 absolute right-0 h-full duration-300">
            {/* Details Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex justify-between items-start mb-4">
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <X size={20} />
                </button>
                <div className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                  Enrolled
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md bg-teal-500">
                  {getInitials(selected.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selected.name}
                  </h2>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-sm flex items-center gap-1">
                    <School size={14} /> {selected.college_university}
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
                  value={selected.phno}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  icon={<MapPin size={14} />}
                  label="Location"
                  value={
                    [selected.city, selected.state, selected.country]
                      .filter(Boolean)
                      .join(", ") || ""
                  }
                />
                <Field
                  icon={<Briefcase size={14} />}
                  label="Experience"
                  value={selected.prior_experience}
                />
              </div>

              {/* COURSE INFORMATION */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-3">
                  📘 Course Information
                </h3>

                <Field
                  label="Course Name"
                  value={selected.course_details?.course_name}
                  isFull
                />

                <Field
                  label="Course Domain"
                  value={selected.course_details?.course_domain}
                  isFull
                />
              </div>

              {/* Academic Details */}
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900/30">
                <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-2">
                  <GraduationCap size={18} /> Academic Details
                </h3>
                <div className="space-y-4">
                  <Field
                    label="Degree Program"
                    value={selected.degree_program}
                    isFull
                  />
                  <Field
                    label="Field of Study"
                    value={selected.field_of_study}
                    isFull
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Year"
                      value={selected.year_of_study}
                    />
                  </div>
                </div>
              </div>

              {/* Reason & Source */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Info size={12} /> Reason for taking course
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selected.reason_for_taking_course ||
                      "No reason provided."}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-2">
                    How did you hear about us?
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selected.how_did_you_hear_about_us || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer (Optional Actions) */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={handleCloseDetails}
                className="w-full py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </main>
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