// src/components/ApplicantsList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";
import {
  Search,
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  FileText,
  X,
  CheckCircle,
  XCircle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  School,
  Clock,
  Trash2,
  UserCheck,
  Award,
  Eye,
  ArrowLeft,
  Plus,
  Save,
  CalendarDays,
  MessageSquare,
  Quote,
  ClipboardList,
  Ban,
  Loader2, // Added Loader icon
  Globe, // Added for Portfolio
  Github, // Added for GitHub
  Linkedin, // Added for LinkedIn
  Calendar,
  User,
  Menu, // Added for mobile menu
  MonitorPlay, // Added for AI Interview
} from "lucide-react";

export default function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection & View State
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  // Project/Task State
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    project_name: "",
    assigned_task: "",
  });
  const [loadingProjects, setLoadingProjects] = useState(false);

  // --- NEW LOADING STATES ---
  const [isProjectSubmitting, setIsProjectSubmitting] = useState(false); // For Create Project button
  const [updatingProjectId, setUpdatingProjectId] = useState(null); // For specific Weekly Update button
  const [isConfirmingAction, setIsConfirmingAction] = useState(false); // For Modal Confirm button

  // New State for Individual Project Weekly Update Inputs
  const [updateInputs, setUpdateInputs] = useState({});

  // Review State
  const [reviewText, setReviewText] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({}); // Track expanded submenus
  const [visibleCount, setVisibleCount] = useState(30);

  // Reset pagination when filter or search changes
  useEffect(() => {
    setVisibleCount(30);
  }, [statusFilter, searchQuery]);

  // Modal State
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    message: "",
    id: null,
  });

  const { user, profile, loading: loadingUser } = useAuthModal();
  const navigate = useNavigate();

  // ---------------- SIDEBAR CONFIGURATION ----------------
  const sidebarFilters = [
    {
      label: "All Applicants",
      val: "All",
      icon: <LayoutDashboard size={18} />,
      colorClass: "bg-slate-800 dark:bg-slate-700",
    },
    {
      label: "Applied",
      val: "Applied",
      icon: <FileText size={18} />,
      colorClass: "bg-blue-500",
    },

    {
      label: "Under Review",
      val: "Under Review",
      icon: <Search size={18} />,
      colorClass: "bg-indigo-500",
    },
    {
      label: "Assessment Stage",
      val: "Assessment Stage",
      icon: <ClipboardList size={18} />,
      colorClass: "bg-purple-500",
      submenu: [
        { label: "Task Assigned", val: "Task Assigned", icon: <ClipboardList size={16} />, colorClass: "bg-purple-400" },
        { label: "Task Submitted", val: "Task Submitted", icon: <ClipboardList size={16} />, colorClass: "bg-blue-400" },
        { label: "Task to be Selected", val: "Task to be Selected", icon: <ClipboardList size={16} />, colorClass: "bg-purple-400" },
        { label: "Task Overdue (Auto)", val: "Task Overdue (Auto)", icon: <ClipboardList size={16} />, colorClass: "bg-red-400" },
        { label: "Task Reviewed – Pass", val: "Task Reviewed – Pass", icon: <CheckCircle size={16} />, colorClass: "bg-green-500" },
        { label: "Task Reviewed – Fail (Retry)", val: "Task Reviewed – Fail (Resubmission Allowed)", icon: <XCircle size={16} />, colorClass: "bg-amber-500" },
        { label: "Task Resubmitted", val: "Task Resubmitted", icon: <ClipboardList size={16} />, colorClass: "bg-blue-400" },
        { label: "Task Reviewed – Fail (Final)", val: "Task Reviewed – Fail (Final)", icon: <XCircle size={16} />, colorClass: "bg-red-500" },
        { label: "No Resubmission", val: "Resubmission Not Received (Auto)", icon: <XCircle size={16} />, colorClass: "bg-red-500" },
      ]
    },
    {
      label: "Interview Stage",
      val: "Interview Stage",
      icon: <MessageSquare size={18} />,
      colorClass: "bg-orange-500",
      submenu: [
        { label: "Interview Scheduled", val: "Interview Scheduled", icon: <Calendar size={16} />, colorClass: "bg-orange-400" },
        { label: "Interview Rescheduled", val: "Interview Rescheduled", icon: <Calendar size={16} />, colorClass: "bg-orange-400" },
        { label: "Interview Passed", val: "Interview Passed", icon: <CheckCircle size={16} />, colorClass: "bg-green-500" },
        { label: "Interview Failed", val: "Interview Failed", icon: <XCircle size={16} />, colorClass: "bg-red-500" },
        { label: "Interview No Show", val: "Interview No Show", icon: <XCircle size={16} />, colorClass: "bg-red-500" },
        { label: "Interview On Hold", val: "Interview On Hold", icon: <Clock size={16} />, colorClass: "bg-amber-500" },
      ]
    },
    {
      label: "On Hold",
      val: "On Hold",
      icon: <Clock size={18} />,
      colorClass: "bg-amber-500",
    },
    {
      label: "Pre-boarding / Selected",
      val: "Pre-boarding / Selected",
      icon: <CheckCircle size={18} />,
      colorClass: "bg-green-600",
      submenu: [
        { label: "Rules Shared & Email Sent", val: "Rules Shared & Email Sent", icon: <Mail size={16} />, colorClass: "bg-green-500" },
        { label: "Pre-boarding Completed", val: "Pre-boarding Completed", icon: <CheckCircle size={16} />, colorClass: "bg-green-600" },
      ]
    },
    {
      label: "Internship",
      val: "Internship",
      icon: <Briefcase size={18} />,
      colorClass: "bg-emerald-600",
      submenu: [
        { label: "Week 1 Review", val: "Week 1 Review", icon: <ClipboardList size={16} />, colorClass: "bg-emerald-500" },
        { label: "Week 2 Review", val: "Week 2 Review", icon: <ClipboardList size={16} />, colorClass: "bg-emerald-500" },
        { label: "On Track", val: "On Track", icon: <CheckCircle size={16} />, colorClass: "bg-green-600" },
        { label: "Performance Issue", val: "Performance Issue", icon: <XCircle size={16} />, colorClass: "bg-red-500" },
        { label: "Recommended for Offer", val: "Recommended for Offer", icon: <Award size={16} />, colorClass: "bg-teal-500" },
      ]
    },
    {
      label: "Completed",
      val: "Completed",
      icon: <Award size={18} />,
      colorClass: "bg-teal-600",
    },
    {
      label: "Rejected",
      val: "Rejected",
      icon: <XCircle size={18} />,
      colorClass: "bg-red-500",
    },
    {
      label: "Inactive",
      val: "Inactive",
      icon: <Ban size={18} />,
      colorClass: "bg-gray-500",
    },
  ];

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    if (!loadingUser) {
      if (!profile || profile?.role !== "admin") {
        navigate("/");
      }
    }
  }, [profile, loadingUser, navigate]);

  const callEdge = async (action, payload = {}) => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
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

  // ---------------- FETCH APPLICANTS ----------------
  const fetchInternshipApplicants = async (statusFilter) => {

    let statusParam = "";

    if (statusFilter === "Applied") statusParam = "Applied";
    else if (statusFilter === "Under Review") statusParam = "Under Review";
    // For Assessment Stage OR any specific assessment status, we fetch ALL and filter locally
    else if (statusFilter === "Assessment Stage" || [
      "Task Assigned",
      "Task Submitted",
      "Task to be Selected",
      "Task Overdue (Auto)",
      "Task Reviewed – Pass",
      "Task Reviewed – Fail (Resubmission Allowed)",
      "Task Resubmitted",
      "Task Reviewed – Fail (Final)",
      "Resubmission Not Received (Auto)"
    ].includes(statusFilter)) {
      statusParam = "";
    }
    else if (statusFilter === "Interview Stage" || [
      "Interview Scheduled",
      "Interview Rescheduled",
      "Interview Passed",
      "Interview Failed",
      "Interview No Show",
      "Interview On Hold"
    ].includes(statusFilter)) {
      statusParam = "";
    }
    else if (statusFilter === "On Hold") statusParam = "On Hold";
    else if (statusFilter === "Pre-boarding / Selected" || [
      "Selected", // Keep compatibility
      "Rules Shared & Email Sent",
      "Rules Shared",
      "Selection Email Sent",
      "Pre-boarding Completed"
    ].includes(statusFilter)) {
      statusParam = "";
    }
    else if (statusFilter === "On Hold") statusParam = "On Hold";
    else if (statusFilter === "Selected") statusParam = "Selected"; // Fallback if still used explicitly
    else if (statusFilter === "Internship" || [
      "Onboarded", // Keep compatibility
      "Week 1 Review",
      "Week 2 Review",
      "On Track",
      "Performance Issue",
      "Recommended for Offer"
    ].includes(statusFilter)) {
      statusParam = "";
    }
    else if (statusFilter === "Completed") statusParam = "Completed";
    else if (statusFilter === "Rejected") statusParam = "Rejected";
    else if (statusFilter === "Inactive") statusParam = "Inactive"; // Or "Withdrawn" if you want to mix? For now let's assume we start using "Inactive"

    // For backward compatibility, if user selects "Inactive", we might want to also fetch "Withdrawn" if DB has old data. 
    // But since backend likely filters by exact string, we might rename data or just support new status. 
    // Let's assume we use "Inactive" going forward.

    const data = await callEdge("get_applications", {
      status: statusParam || "All",
    });

    // Map new schema fields to expected frontend fields
    const mappedApplications = (data.applications || []).map(app => {
      let parsedHistory = [];
      try {
        if (typeof app.status_history === "string") {
          parsedHistory = JSON.parse(app.status_history);
        } else if (Array.isArray(app.status_history)) {
          parsedHistory = app.status_history;
        }
      } catch (e) {
        console.warn("Failed to parse status_history", e);
      }

      return {
        ...app,
        is_select: app.current_status || app.is_select || "Applied",
        review_timestamp: app.status_updated_at || app.review_timestamp || app.reviewtimestamp,
        status_history: parsedHistory,
      };
    });

    return mappedApplications;
  };



  useEffect(() => {
    let mounted = true;

    const loadApplicants = async () => {
      try {
        setLoading(true);


        const data = await fetchInternshipApplicants(statusFilter);

        if (mounted) {
          setApplicants(data);

        }
      } catch (err) {
        console.error("Load Applicants Error:", err);
        if (mounted) {

        }
        toast.error(`Error: ${err.message}`);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadApplicants();

    return () => {
      mounted = false;
    };
  }, [statusFilter]);

  // ---------------- FETCH PROJECTS (Edge Function) ----------------
  const fetchProjects = async (internId) => {

    if (!internId) return;

    try {

      setLoadingProjects(true);

      const data = await callEdge("get_projects", {
        intern_id: internId,
      });

      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  // ---------------- NEW: ADD PROJECT (Edge Function) ----------------
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectForm.project_name || !projectForm.assigned_task) return;

    // Start Loading
    setIsProjectSubmitting(true);

    try {
      await callEdge("add_project", {
        intern_id: selected.user_id,
        project_name: projectForm.project_name,
        assigned_task: projectForm.assigned_task,
      });

      toast.success("Project added successfully!");
      setProjectForm({
        project_name: "",
        assigned_task: "",
      });
      fetchProjects(selected.user_id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add project details");
    } finally {
      // Stop Loading
      setIsProjectSubmitting(false);
    }
  };

  // ---------------- NEW: ADD WEEKLY UPDATE (Edge Function) ----------------
  const handleAddWeeklyUpdate = async (projectId) => {
    const text = updateInputs[projectId];
    if (!text || text.trim() === "") return;

    // Start Loading for specific project
    setUpdatingProjectId(projectId);

    try {
      await callEdge("add_weekly_update", {
        project_id: projectId,
        update_text: text,
      });

      toast.success("Weekly update added!");
      setUpdateInputs((prev) => ({ ...prev, [projectId]: "" })); // Clear input
      fetchProjects(selected.user_id); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to add update");
    } finally {
      // Stop Loading
      setUpdatingProjectId(null);
    }
  };

  // ---------------- NEW: DELETE WEEKLY UPDATE (Trigger) ----------------
  const handleDeleteWeeklyUpdate = (projectId, updateId) => {
    setConfirmModal({
      show: true,
      action: "delete_weekly_update",
      message: "Are you sure you want to delete this weekly update?",
      id: { projectId, updateId },
    });
  };

  // ---------------- DELETE PROJECT TRIGGER ----------------
  const handleDeleteProject = (projectId) => {
    setConfirmModal({
      show: true,
      action: "delete_project",
      message: "Are you sure you want to permanently delete this project task?",
      id: projectId,
    });
  };

  // ---------------- STRICT FILTERING LOGIC ----------------
  const filtered = applicants.filter((app) => {
    const currentStatus = app.is_select || "Applied";

    // Assessment Statuses Group
    const assessmentStatuses = [
      "Assessment Stage",
      "Task Assigned",
      "Task Submitted",
      "Task to be Selected",
      "Task Overdue (Auto)",
      "Task Reviewed – Pass",
      "Task Reviewed – Fail (Resubmission Allowed)",
      "Task Resubmitted",
      "Task Reviewed – Fail (Final)",
      "Resubmission Not Received (Auto)"
    ];

    // Interview Statuses Group
    const interviewStatuses = [
      "Interview Stage",
      "Interview Scheduled",
      "Interview Rescheduled",
      "Interview Passed",
      "Interview Failed",
      "Interview No Show",
      "Interview On Hold"
    ];

    // Pre-boarding Statuses Group
    const preboardingStatuses = [
      "Pre-boarding / Selected",
      "Selected",
      "Rules Shared & Email Sent",
      "Rules Shared",
      "Selection Email Sent",
      "Pre-boarding Completed"
    ];

    // Internship Statuses Group
    const internshipStatuses = [
      "Internship",
      "Onboarded",
      "Week 1 Review",
      "Week 2 Review",
      "On Track",
      "Performance Issue",
      "Recommended for Offer"
    ];

    if (statusFilter === "All") {
      // Pass through
    } else if (statusFilter === "Assessment Stage") {
      if (!assessmentStatuses.includes(currentStatus)) return false;
    } else if (statusFilter === "Interview Stage") {
      if (!interviewStatuses.includes(currentStatus)) return false;
    } else if (statusFilter === "Pre-boarding / Selected") {
      if (!preboardingStatuses.includes(currentStatus)) return false;
    } else if (statusFilter === "Internship") {
      if (!internshipStatuses.includes(currentStatus)) return false;
    } else {
      // Exact match for others
      if (currentStatus !== statusFilter) return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.full_name?.toLowerCase().includes(q) ||
      app.email?.toLowerCase().includes(q) ||
      app.university?.toLowerCase().includes(q)
    );
  });

  // ---------------- HANDLERS ----------------
  const openDetails = (id) => {
    const found = applicants.find((a) => a.id === id);
    setSelected(found || null);
    setViewMode("list");
  };

  const closeDetails = () => setSelected(null);

  const openConfirm = (action, message) => {
    setConfirmModal({ show: true, action, message, id: null });
    setReviewText("");
  };

  const handleViewFullProfile = () => {
    setViewMode("full_profile");
    if (selected) {
      fetchProjects(selected.user_id);
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  // ---------------- HELPER FUNCTIONS ----------------
  const getInitials = (name) =>
    name
      ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
      : "??";

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLastUpdatedTime = (item) => {
    // console.log("Debug item:", item.full_name, item.is_select, item.review_timestamp, item.reviewtimestamp);
    if (item.is_select === "Applied") {
      return item.created_at;
    }

    // Prioritize DB field 'review_timestamp'. Handle array or string.
    let ts = item.review_timestamp || item.reviewtimestamp;

    if (Array.isArray(ts) && ts.length > 0) {
      return ts[ts.length - 1];
    }
    if (typeof ts === "string" && ts) {
      return ts;
    }

    // If we are here, status changed but no review_timestamp. 
    // This happens for legacy data where we didn't track moves.
    // We MUST fallback to created_at to avoid showing nothing or "invalid date".
    return item.created_at;
  };

  const getDateLabel = (item) => {
    if (item.is_select === "Applied") return "Applied:";
    if (item.is_select === "Task Assigned") return "Assigned:";
    if (item.is_select === "Task Submitted") return "Submitted:";
    if (item.is_select === "Under Review") return "Review Started:";
    if (item.is_select === "Selected" || item.is_select === "Shortlisted") return "Selected:";
    if (item.is_select === "Rejected") return "Rejected:";
    return "";
  };

  const formatTime = (timeString) => {
    if (!timeString) return "—";
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getStatusLabel = (is_select) => {
    if (is_select === "Applied") return "Applied";
    if (is_select === "Under Review") return "Under Review";

    if (is_select === "Assessment Stage") return "Assessment Stage";
    if (is_select === "Interview Stage") return "Interview Stage";
    if (is_select === "On Hold") return "On Hold";
    if (is_select === "Selected") return "Selected";
    if (is_select === "Onboarded") return "Onboarded";
    if (is_select === "Completed") return "Completed";
    if (is_select === "Rejected") return "Rejected";
    if (is_select === "Withdrawn" || is_select === "Inactive") return "Inactive";
    return is_select; // Default to showing the status text itself
  };

  const getStatusColor = (is_select) => {
    if (is_select === "Applied")
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (is_select === "Under Review")
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400";


    // Assessment Group
    if ([
      "Assessment Stage",
      "Task Assigned",
      "Task Submitted",
      "Task to be Selected",
      "Task Resubmitted"
    ].includes(is_select))
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";

    if ([
      "Task Reviewed – Pass",
      "Selected",
      "Onboarded",
      "Completed",
      "Internship",
      "Week 1 Review",
      "Week 2 Review",
      "On Track",
      "Recommended for Offer"
    ].includes(is_select))
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";

    if ([
      "Task Overdue (Auto)",
      "Task Reviewed – Fail (Resubmission Allowed)",
      "Task Reviewed – Fail (Final)",
      "Resubmission Not Received (Auto)",
      "Rejected",
      "Performance Issue"
    ].includes(is_select))
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    // Interview Group
    if (is_select === "Interview Stage" || [
      "Interview Scheduled",
      "Interview Rescheduled",
      "Interview On Hold"
    ].includes(is_select))
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";

    if ([
      "Interview Passed",
      "Pre-boarding / Selected",
      "Selected",
      "Rules Shared & Email Sent",
      "Rules Shared",
      "Selection Email Sent",
      "Pre-boarding Completed"
    ].includes(is_select))
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    if (["Interview Failed", "Interview No Show"].includes(is_select))
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (is_select === "On Hold")
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (is_select === "Withdrawn" || is_select === "Inactive")
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

    return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
  };

  const getAvatarBg = (is_select) => {
    if (is_select === "Applied") return "bg-blue-500";
    if (is_select === "Under Review") return "bg-indigo-500";

    if (is_select === "Assessment Stage") return "bg-purple-500";
    if (is_select === "Interview Stage") return "bg-orange-500";
    if (is_select === "On Hold") return "bg-amber-500";
    if (is_select === "Selected") return "bg-green-500";
    if (is_select === "Onboarded") return "bg-emerald-600";
    if (is_select === "Completed") return "bg-teal-600";
    if (is_select === "Rejected") return "bg-red-500";
    if (is_select === "Withdrawn" || is_select === "Inactive") return "bg-gray-500";
    return "bg-slate-500";
  };

  const deleteProject = async (projectId) => {
    return callEdge("delete_project", { id: projectId });
  };

  const deleteInternship = async (applicationId) => {
    return callEdge("delete_application", { id: applicationId });
  };

  const updateInternship = async (id, action, statusHistory, review, reviewtimestamp) => {
    return callEdge("update_application", {
      id,
      is_select: action,
      status_history: statusHistory,
      review,
      reviewtimestamp,
    });
  };

  // ---------------- CENTRAL CONFIRM ACTION ----------------
  const confirmAction = async () => {
    setIsConfirmingAction(true); // Start Loading

    // CASE 1: Delete Project
    if (confirmModal.action === "delete_project") {
      const idToDelete = confirmModal.id;

      if (!idToDelete) {
        toast.error("Error: Project ID missing");
        setConfirmModal({ show: false, action: null, message: "", id: null });
        setIsConfirmingAction(false);
        return;
      }

      try {
        await deleteProject(idToDelete);
        toast.success("Project deleted successfully");

        setProjects((prev) => prev.filter((p) => p.id !== idToDelete));
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setIsConfirmingAction(false); // Stop Loading
        setConfirmModal({ show: false, action: null, message: "", id: null });
      }
      return;
    }

    // CASE 2: Delete Weekly Update
    if (confirmModal.action === "delete_weekly_update") {
      const { projectId, updateId } = confirmModal.id;

      try {
        await callEdge("delete_weekly_update", {
          project_id: projectId,
          update_id: updateId,
        });

        toast.success("Update deleted successfully");
        fetchProjects(selected.user_id); // Refresh list
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete update");
      } finally {
        setIsConfirmingAction(false); // Stop Loading
        setConfirmModal({ show: false, action: null, message: "", id: null });
      }
      return;
    }

    // CASE 3: Applicant actions
    if (!selected) {
      setIsConfirmingAction(false);
      setConfirmModal({ show: false, action: null, message: "", id: null });
      return;
    }

    // Validation: Require text entry for Weekly Review
    if (["Week 1 Review", "Week 2 Review"].includes(confirmModal.action)) {
      if (!reviewText || reviewText.trim() === "") {
        toast.error("Please enter a review description before saving.");
        setIsConfirmingAction(false);
        return;
      }
    }

    try {
      if (confirmModal.action === "delete") {
        await deleteInternship(selected.id);

        setApplicants((prev) => prev.filter((p) => p.id !== selected.id));
        setSelected(null);
        setViewMode("list");
      } else {
        // Handle Review as Array
        let existingReviews = selected.review;
        let updatedReviews = [];

        if (Array.isArray(existingReviews)) {
          updatedReviews = [...existingReviews];
        } else if (
          typeof existingReviews === "string" &&
          existingReviews.trim() !== ""
        ) {
          updatedReviews = [existingReviews];
        }

        // Handle ReviewTimestamp as Array
        // Check both keys to ensure we catch existing data
        let existingTimestamps = selected.reviewtimestamp || selected.review_timestamp;
        let updatedTimestamps = [];

        if (Array.isArray(existingTimestamps)) {
          updatedTimestamps = [...existingTimestamps];
        } else if (existingTimestamps) {
          updatedTimestamps = [existingTimestamps];
        }

        // New: Handle status_history JSON Array
        let currentHistory = selected.status_history || [];
        let updatedHistory = Array.isArray(currentHistory) ? [...currentHistory] : [];

        // Logic to ALWAYS add timestamp if we are confirming an action
        const newTimestamp = new Date().toISOString();

        let newRemark = "";
        if (reviewText && reviewText.trim() !== "") {
          newRemark = reviewText;
          updatedReviews.push(reviewText);
          updatedTimestamps.push(newTimestamp);
        } else if (confirmModal.action !== selected.is_select) {
          newRemark = `Status updated to: ${confirmModal.action}`;
          updatedReviews.push(newRemark);
          updatedTimestamps.push(newTimestamp);
        } else {
          newRemark = `Status confirmed as: ${confirmModal.action}`;
          updatedReviews.push(newRemark);
          updatedTimestamps.push(newTimestamp);
        }

        updatedHistory.push({
          status: confirmModal.action,
          remark: newRemark,
          date: newTimestamp,
          changed_by: profile?.name || profile?.email || "Admin"
        });

        await updateInternship(
          selected.id,
          confirmModal.action,
          updatedHistory,
          updatedReviews,
          updatedTimestamps
        );

        toast.success(`Applicant updated to ${confirmModal.action}!`); // Success message first

        // --- AUTOMATIC ONBOARDING EMAIL GENERATION ---
        const onboardingStatuses = [
          "Rules Shared & Email Sent",
          "Pre-boarding / Selected",
          "Selected",
          "Selection Email Sent",
          "Onboarded",
          "Internship",
          "Pre-boarding Completed"
        ];
        
        if (onboardingStatuses.includes(confirmModal.action) && selected?.email) {
          const subject = encodeURIComponent("Congratulations! You've been selected for an Internship at SmaranAI 🚀");
          const body = encodeURIComponent(`Dear ${selected.full_name},

Congratulations! We are thrilled to inform you that you have been selected for the ${selected.top_priority_role || 'Internship'} program at SmaranAI.

As part of your pre-boarding process, please review our standard rules and guidelines below:

📌 ONBOARDING RULES & NEXT STEPS:
1. Communication: All official communication and updates will occur through the Intern Portal.
2. Dashboard Access: Your Intern Dashboard will be unlocked shortly.
3. Attendance: You are required to log your daily activity and check-in/out through the portal.
4. Assessments: Weekly tasks must be completed and submitted before their respective deadlines.
5. Professionalism: We maintain a strict code of conduct and expect professional behavior at all times.

Please reply to this email to confirm your acceptance of the offer and acknowledge these rules. Once we receive your confirmation, we will finalize your onboarding setup.

Welcome to the team! We are excited to have you on board.

Best regards,
SmaranAI Admin Team`);
          
          // Open default mail client with pre-filled details
          const mailtoUrl = `mailto:${selected.email}?subject=${subject}&body=${body}`;
          window.open(mailtoUrl, '_blank');
        }
        // ---------------------------------------------

        // REFETCH to ensure we see server state
        // This confirms if the DB actually saved it.
        await fetchInternshipApplicants(statusFilter).then(data => {
          setApplicants(data);
          // Also update selected item from the fresh data
          const freshSelected = data.find(d => d.id === selected.id);
          if (freshSelected) {
            setSelected(freshSelected);
          }
        });

        setIsConfirmingAction(false);
        setConfirmModal({ show: false, action: null, message: "", id: null });
        setReviewText("");
        return; // Early return to skip the manual setApplicants below since we refetched
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Action failed");
    } finally {
      setIsConfirmingAction(false); // Stop Loading
      setConfirmModal({ show: false, action: null, message: "", id: null });
      setReviewText("");
    }
  };

  return (
    <div className="flex h-screen bg-[#f3f8f7] dark:bg-[#020c1b] font-sans text-slate-800 dark:text-slate-200 overflow-hidden pt-16 transition-colors duration-300">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* SIDEBAR */}
      <aside className={`fixed lg:relative top-16 lg:top-0 w-72 bg-white dark:bg-[#0A0F2C] border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 z-40 lg:z-20 shadow-sm transition-all duration-300 h-[calc(100vh-4rem)] lg:h-full lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              ✨
            </div>
            Internship
          </h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
            Status Filters
          </h3>
          <nav className="space-y-1">
            {sidebarFilters.map((item) => (
              <div key={item.val} className="w-full">
                <button
                  onClick={() => {
                    // Toggle dropdown if submenu exists
                    if (item.submenu) {
                      setExpandedMenus(prev => ({
                        ...prev,
                        [item.val]: !prev[item.val]
                      }));

                      // Treat clicking the parent as filtering by parent status too
                      setStatusFilter(item.val);
                      setSelected(null);
                      setViewMode("list");
                    } else {
                      setStatusFilter(item.val);
                      setSelected(null);
                      setViewMode("list");
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${statusFilter === item.val || (item.submenu && item.submenu.some(sub => sub.val === statusFilter))
                    ? `${item.colorClass} text-white shadow-md transform scale-[1.02]`
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                >
                  <span
                    className={`${statusFilter === item.val || (item.submenu && item.submenu.some(sub => sub.val === statusFilter))
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.submenu && (
                    <ChevronRight
                      size={16}
                      className={`text-white/80 transition-transform duration-200 ${expandedMenus[item.val] ? 'rotate-90' : ''}`}
                    />
                  )}
                  {!item.submenu && statusFilter === item.val && (
                    <ChevronRight size={16} className="text-white/80" />
                  )}
                </button>

                {/* Submenu Rendering */}
                {item.submenu && expandedMenus[item.val] && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2 animate-fadeIn">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.val}
                        onClick={() => {
                          setStatusFilter(subItem.val);
                          setSelected(null);
                          setViewMode("list");
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${statusFilter === subItem.val
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          }`}
                      >
                        <span className={statusFilter === subItem.val ? "text-purple-600" : "text-gray-400"}>
                          {subItem.icon}
                        </span>
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex overflow-hidden relative">

        {/* VIEW 1: LIST VIEW */}
        {viewMode === "list" && (
          <div
            className={`flex flex-col p-4 md:p-8 overflow-hidden transition-all duration-300 w-full ${selected ? "lg:w-7/12" : "w-full"
              }`}
          >
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg bg-white dark:bg-[#112240] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    <Menu size={20} />
                  </button>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-teal-5 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium">
                    <Briefcase size={14} className="mr-2" /> Internship Program
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                  Internship Applicants{" "}
                  <span className="text-gray-400 dark:text-gray-500 text-lg md:text-xl font-normal ml-2">
                    {applicants.length}
                  </span>
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/ai-interviews")}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 w-fit"
                >
                  <MonitorPlay size={18} />
                  AI-Interview
                </button>
                {["Pre-boarding / Selected", "Rules Shared & Email Sent", "Pre-boarding Completed", "Internship", "Week 1 Review", "Week 2 Review", "On Track", "Performance Issue", "Recommended for Offer"].includes(statusFilter) && (
                  <button
                    onClick={() => navigate("/user-activity")}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 w-fit"
                  >
                    <ClipboardList size={18} />
                    Intern Activity
                  </button>
                )}
              </div>
            </div>

            <div className="relative mb-6">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#112240] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="text-center py-20 text-gray-400">
                  Loading...
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  No applicants found.
                </div>
              ) : (
                <>
                  {filtered.slice(0, visibleCount).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => openDetails(item.id)}
                      className={`group bg-white dark:bg-[#112240] p-4 md:p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 ${selected?.id === item.id
                        ? "ring-2 ring-teal-500 border-transparent shadow-md"
                        : "border-gray-100 dark:border-gray-700"
                        }`}
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm flex-shrink-0 ${getAvatarBg(
                          item.is_select,
                        )}`}
                      >
                        {getInitials(item.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg truncate">
                          {item.full_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {item.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 truncate flex items-center gap-1">
                          <School size={12} />{" "}
                          {item.university || "University not specified"}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:ml-4 w-full sm:w-auto">
                        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1 sm:mr-2">
                          <Clock size={12} /> {getDateLabel(item)} {formatDateTime(getLastUpdatedTime(item))}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide self-start ${getStatusColor(
                            item.is_select,
                          )}`}
                        >
                          {getStatusLabel(item.is_select)}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {filtered.length > visibleCount && (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 30)}
                      className="w-full py-3.5 mt-2 text-center text-teal-600 dark:text-teal-400 font-semibold bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100/50 dark:hover:bg-teal-950/35 rounded-xl transition-all border border-dashed border-teal-200 dark:border-teal-900/50 flex items-center justify-center gap-2"
                    >
                      Show More Applicants (Showing {visibleCount} of {filtered.length})
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: FULL PROFILE VIEW */}
        {viewMode === "full_profile" && selected && (
          <div className="w-full flex flex-col h-full bg-white dark:bg-[#0A0F2C] overflow-hidden animate-in fade-in slide-in-from-right-10 duration-300">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3 md:gap-4">
                <button
                  onClick={handleBackToList}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-2xl shadow-md ${getAvatarBg(
                      selected.is_select,
                    )}`}
                  >
                    {getInitials(selected.full_name)}
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white">
                      {selected.full_name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm line-clamp-1">
                      {selected.top_priority_role} • {selected.availability} •
                      Applied: {formatDateTime(selected.created_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${getStatusColor(
                  selected.is_select,
                )}`}
              >
                {getStatusLabel(selected.is_select)}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                      <Briefcase size={18} /> Intern Details
                    </h3>
                    <div className="space-y-4">
                      <Field
                        label="Email"
                        value={selected.email}
                        icon={<Mail size={14} />}
                      />
                      <Field
                        label="Phone"
                        value={selected.phone_number}
                        icon={<Phone size={14} />}
                      />
                      <Field
                        label="LinkedIn"
                        value={selected.linkedin_profile}
                        icon={<Briefcase size={14} />}
                      />
                      <Field
                        label="Location"
                        value={`${selected.city}, ${selected.state}`}
                        icon={<MapPin size={14} />}
                      />
                    </div>
                  </div>

                  {/* ADMIN REVIEW SECTION - FULL PROFILE (Handles JSON Array) */}
                  {((selected.status_history?.length > 0) || selected.review?.length > 0) && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
                      <h3 className="font-bold text-lg mb-4 text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Application Timeline & Remarks
                      </h3>

                      <div className="space-y-4">
                        {/* 1. New JSONB History Array (Prioritized) */}
                        {selected.status_history && Array.isArray(selected.status_history) && selected.status_history.length > 0 ? (
                          selected.status_history.map((historyItem, index) => (
                            <div key={`history-${index}`} className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
                              <div className="flex gap-3">
                                <div className="mt-1">
                                  {historyItem.status === 'Applied' ? (
                                    <Briefcase size={16} className="text-amber-500" />
                                  ) : (
                                    <Quote size={16} className="text-amber-400" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">
                                      {historyItem.status}
                                    </span>
                                    {historyItem.date && (
                                      <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                        <Clock size={12} />
                                        {formatDateTime(historyItem.date)}
                                      </span>
                                    )}
                                  </div>

                                  {historyItem.remark && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                                      "{historyItem.remark}"
                                    </p>
                                  )}

                                  {historyItem.changed_by && historyItem.changed_by !== 'System' && (
                                    <p className="text-[10px] text-gray-400 mt-2 text-right">By: {historyItem.changed_by}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            {/* Fallbacks for older data without status_history JSON */}
                            {Array.isArray(selected.review) ? (
                              <div className="space-y-4">
                                {selected.review.map((rev, index) => (
                                  <div key={index} className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                    <div className="flex gap-3">
                                      <Quote size={16} className="text-amber-400 flex-shrink-0 mt-1" />
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{rev}"</p>
                                        {selected.reviewtimestamp && selected.reviewtimestamp[index] && (
                                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                                            <Clock size={12} />
                                            {formatDateTime(selected.reviewtimestamp[index])}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              typeof selected.review === "string" && selected.review.trim() !== "" && (
                                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-amber-100 dark:border-amber-800/30">
                                  <div className="flex gap-3">
                                    <Quote size={20} className="text-amber-400 flex-shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">"{selected.review}"</p>
                                      {selected.reviewtimestamp && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                                          <Clock size={12} />
                                          {formatDateTime(Array.isArray(selected.reviewtimestamp) ? selected.reviewtimestamp[0] : selected.reviewtimestamp)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {(selected.is_select === "Selected" ||
                    selected.is_select === "Completed") && (
                      <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-purple-800 dark:text-purple-300 flex items-center gap-2">
                          <CalendarDays size={18} /> Work Schedule
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field
                              label="Start Week"
                              value={selected.start_week}
                            />
                            <Field label="End Week" value={selected.end_week} />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field
                              label="Start Time"
                              value={formatTime(selected.start_time)}
                            />
                            <Field
                              label="End Time"
                              value={formatTime(selected.end_time)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {/* --- UPDATED SECTION: ADD PROJECT AND TASKS --- */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 1. Add New Project Form */}
                  <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                      <Plus size={18} className="text-teal-500" /> Assign New
                      Project
                    </h3>
                    <form onSubmit={handleAddProject} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Project Name"
                          className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={projectForm.project_name}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              project_name: e.target.value,
                            })
                          }
                          disabled={isProjectSubmitting}
                        />
                        <input
                          type="text"
                          placeholder="Assigned Task / Objective"
                          className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          value={projectForm.assigned_task}
                          onChange={(e) =>
                            setProjectForm({
                              ...projectForm,
                              assigned_task: e.target.value,
                            })
                          }
                          disabled={isProjectSubmitting}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isProjectSubmitting}
                        className={`px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 ${isProjectSubmitting
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                          }`}
                      >
                        {isProjectSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />{" "}
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save size={16} /> Create Project
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* 2. Project History & Weekly Updates List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        Active Projects & Updates
                      </h3>
                      <button
                        onClick={() => {
                          console.log("selected data :", selected);
                          fetchProjects(selected.user_id);
                        }}
                        className="text-xs text-teal-600 hover:underline"
                      >
                        Refresh
                      </button>
                    </div>

                    {loadingProjects ? (
                      <p className="text-gray-400">Loading projects...</p>
                    ) : projects.length === 0 ? (
                      <p className="text-gray-400 italic">
                        No projects assigned yet.
                      </p>
                    ) : (
                      projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="bg-white dark:bg-[#112240] p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:shadow-md"
                        >
                          {/* Project Header */}
                          <div className="flex justify-between items-start mb-3 border-b border-gray-100 dark:border-gray-700 pb-3">
                            <div>
                              <h4 className="font-bold text-teal-700 dark:text-teal-400 text-lg">
                                {proj.project_name}
                              </h4>
                              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {proj.assigned_task}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">
                                {formatDateTime(proj.created_at)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProject(proj.id);
                                }}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                title="Delete Entire Project"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Weekly Updates List */}
                          <div className="space-y-3 mb-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Weekly Updates
                            </p>
                            {proj.weekly_update &&
                              Array.isArray(proj.weekly_update) &&
                              proj.weekly_update.length > 0 ? (
                              proj.weekly_update.map((update, idx) => (
                                <div
                                  key={update.id || idx}
                                  className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg group"
                                >
                                  <div className="mt-1 text-teal-500">
                                    <CheckCircle size={14} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {update.text}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                      {formatDateTime(update.created_at)}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeleteWeeklyUpdate(
                                        proj.id,
                                        update.id,
                                      )
                                    }
                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                    title="Delete this update"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-400 italic">
                                No updates yet.
                              </p>
                            )}
                          </div>

                          {/* Add New Update Input */}
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <input
                              type="text"
                              placeholder="Add a weekly update..."
                              className="flex-1 bg-gray-50 dark:bg-gray-800 border-none rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-teal-500"
                              value={updateInputs[proj.id] || ""}
                              onChange={(e) =>
                                setUpdateInputs({
                                  ...updateInputs,
                                  [proj.id]: e.target.value,
                                })
                              }
                              disabled={updatingProjectId === proj.id}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddWeeklyUpdate(proj.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleAddWeeklyUpdate(proj.id)}
                              disabled={updatingProjectId === proj.id}
                              className={`bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 p-2 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors ${updatingProjectId === proj.id
                                ? "opacity-70 cursor-not-allowed"
                                : ""
                                }`}
                              title="Post Update"
                            >
                              {updatingProjectId === proj.id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Plus size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIDEBAR DETAILS (List View) */}
        {selected && viewMode === "list" && (
          <div className="hidden lg:flex w-5/12 bg-white dark:bg-[#0A0F2C] border-l border-gray-200 dark:border-gray-800 flex-col shadow-2xl z-30 absolute right-0 h-full animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex justify-between items-start mb-4">
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <X size={20} />
                </button>
                <div className="flex gap-2">
                  {(selected.is_select === "Selected" ||
                    selected.is_select === "Onboarded" ||
                    selected.is_select === "Completed") && (
                      <button
                        onClick={handleViewFullProfile}
                        className="flex items-center gap-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-4 py-2 rounded-full text-xs font-bold uppercase hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                      >
                        <Eye size={14} /> View Full Profile
                      </button>
                    )}
                  <div
                    className={`px-3 py-2 flex items-center rounded-full text-xs font-bold uppercase ${getStatusColor(
                      selected.is_select,
                    )}`}
                  >
                    {getStatusLabel(selected.is_select)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md ${getAvatarBg(
                    selected.is_select,
                  )}`}
                >
                  {getInitials(selected.full_name)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selected.full_name}
                  </h2>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-sm flex items-center gap-1">
                    <Briefcase size={14} />{" "}
                    {selected.top_priority_role || "Intern"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Applied: {formatDateTime(selected.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* 1. Contact Info */}
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

              {/* 2. Social Links (New Section) */}
              <div className="grid grid-cols-3 gap-3">
                <Field
                  icon={<Linkedin size={14} />}
                  label="LinkedIn"
                  value={
                    selected.linkedin_profile ? (
                      <a
                        href={selected.linkedin_profile}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-semibold"
                      >
                        View Profile
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <Field
                  icon={<Github size={14} />}
                  label="GitHub"
                  value={
                    selected.github_url ? (
                      <a
                        href={selected.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-700 dark:text-slate-300 hover:underline truncate block font-semibold"
                      >
                        View GitHub
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <Field
                  icon={<Globe size={14} />}
                  label="Portfolio"
                  value={
                    selected.portfolio_url ? (
                      <a
                        href={selected.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline truncate block font-semibold"
                      >
                        View Site
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>

              {/* 3. Location & Education */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  icon={<MapPin size={14} />}
                  label="Location"
                  value={[selected.city, selected.state, selected.country]
                    .filter(Boolean)
                    .join(", ")}
                />
                <Field
                  icon={<GraduationCap size={14} />}
                  label="Grad Year"
                  value={selected.graduation_year}
                />
              </div>

              {/* 4. Professional Status & Availability (New Section) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <User size={18} /> Professional Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Current Status"
                    value={
                      selected.is_student
                        ? "Student"
                        : selected.is_working_professional
                          ? "Working Professional"
                          : "Not Specified"
                    }
                  />
                  <Field
                    label="Availability"
                    icon={<Clock size={14} />}
                    value={selected.available_to_join || "—"}
                  />
                </div>
              </div>

              {/* 5. Experience Descriptions (New Section) */}
              {(selected.has_internship_exp ||
                selected.is_working_professional) && (
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                    <h3 className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                      <Briefcase size={18} /> Experience Details
                    </h3>

                    {selected.has_internship_exp && (
                      <div className="bg-white dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                        <Field
                          label="Internship Experience"
                          value={selected.internship_exp_desc}
                          isFull
                        />
                      </div>
                    )}

                    {selected.is_working_professional && (
                      <div className="bg-white dark:bg-indigo-950/30 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/20">
                        <Field
                          label="Work Experience"
                          value={selected.work_experience_desc}
                          isFull
                        />
                      </div>
                    )}
                  </div>
                )}

              {/* 6. Interview Date (New Section) */}
              {selected.interview_date && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 flex items-center gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-full text-orange-600 dark:text-orange-400">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider mb-1">
                      Scheduled Interview
                    </p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {formatDateTime(selected.interview_date)}
                    </p>
                  </div>
                </div>
              )}

              {/* 7. Work Schedule (Existing) */}
              {true && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
                  <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                    <CalendarDays size={18} /> Preferred Schedule
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Start Week" value={selected.start_week} />
                    <Field label="End Week" value={selected.end_week} />
                    <Field
                      label="Start Time"
                      value={formatTime(selected.start_time)}
                    />
                    <Field
                      label="End Time"
                      value={formatTime(selected.end_time)}
                    />
                  </div>
                </div>
              )}

              {/* 8. Education Details (Existing) */}
              <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900/30">
                <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-2">
                  <School size={18} /> Education
                </h3>
                <div className="space-y-4">
                  <Field
                    label="University"
                    value={selected.university}
                    isFull
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Program" value={selected.program_type} />
                    <Field label="Branch" value={selected.branch} />
                  </div>
                </div>
              </div>

              {/* 9. Resume Link (Existing) */}
              {selected.cv_url ? (
                <a
                  href={selected.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors text-teal-700 dark:text-teal-300 group"
                >
                  <div className="bg-white dark:bg-[#0A0F2C] p-2 rounded-lg text-teal-600 dark:text-teal-400 group-hover:text-teal-800 dark:group-hover:text-teal-200">
                    <FileText size={20} />
                  </div>
                  <span className="font-medium">View Resume / CV</span>
                </a>
              ) : (
                <div className="p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center text-gray-400 text-sm">
                  No resume uploaded
                </div>
              )}

              {/* 10. Review History (Existing) */}
              {selected.review && (
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                    <MessageSquare size={16} /> Review History
                  </h3>
                  {Array.isArray(selected.review) ? (
                    selected.review.map((rev, index) => (
                      <div
                        key={index}
                        className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30"
                      >
                        <div className="flex gap-2">
                          <Quote
                            size={14}
                            className="text-amber-400 flex-shrink-0 mt-0.5"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                              {rev}
                            </p>
                            {selected.reviewtimestamp && selected.reviewtimestamp[index] && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                                <Clock size={12} />
                                {formatDateTime(selected.reviewtimestamp[index])}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30">
                      <div className="flex gap-2">
                        <Quote
                          size={14}
                          className="text-amber-400 flex-shrink-0 mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                            {selected.review}
                          </p>
                          {selected.reviewtimestamp && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                              <Clock size={12} />
                              {formatDateTime(Array.isArray(selected.reviewtimestamp) ? selected.reviewtimestamp[0] : selected.reviewtimestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-2 gap-3 mb-3">
                {(!selected.is_select || selected.is_select === "Applied") && (
                  <>
                    <button
                      onClick={() =>
                        openConfirm("Under Review", "Accept this applicant?")
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <CheckCircle size={16} /> Under Review
                    </button>
                    <button
                      onClick={() =>
                        openConfirm("Rejected", "Reject this applicant?")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {selected.is_select === "Under Review" && (
                  <>
                    <button
                      onClick={() =>
                        openConfirm("Assessment Stage", "Move this applicant to Assessment Stage?")
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <UserCheck size={16} /> Assessment
                    </button>
                    <button
                      onClick={() =>
                        openConfirm("Rejected", "Reject this applicant?")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {[
                  "Assessment Stage",
                  "Task Assigned",
                  "Task Submitted",
                  "Task to be Selected",
                  "Task Overdue (Auto)",
                  "Task Reviewed – Pass",
                  "Task Reviewed – Fail (Resubmission Allowed)",
                  "Task Resubmitted",
                  "Task Reviewed – Fail (Final)",
                  "Resubmission Not Received (Auto)"
                ].includes(selected.is_select) && (
                    <div className="col-span-2 space-y-3 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                      <h3 className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wide mb-2">Assessment Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Assignment */}
                        <button onClick={() => openConfirm("Task Assigned", "Mark as Task Assigned?")} className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 py-1.5 rounded text-[10px] font-medium hover:bg-purple-50 transition-colors">Task Assigned</button>
                        <button onClick={() => openConfirm("Task to be Selected", "Mark as Task to be Selected?")} className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 py-1.5 rounded text-[10px] font-medium hover:bg-purple-50 transition-colors">Task to be Selected</button>

                        {/* Submission */}
                        <button onClick={() => openConfirm("Task Submitted", "Mark as Task Submitted?")} className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 py-1.5 rounded text-[10px] font-medium hover:bg-blue-50 transition-colors">Task Submitted</button>
                        <button onClick={() => openConfirm("Task Resubmitted", "Mark as Resubmitted?")} className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 py-1.5 rounded text-[10px] font-medium hover:bg-blue-50 transition-colors">Task Resubmitted</button>

                        {/* Review Results */}
                        <button onClick={() => openConfirm("Task Reviewed – Pass", "Mark as Passed?")} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1.5 rounded text-[10px] font-medium hover:bg-green-50 transition-colors">Review - Pass</button>
                        <button onClick={() => openConfirm("Task Reviewed – Fail (Resubmission Allowed)", "Mark as Failed (Retry)?")} className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 py-1.5 rounded text-[10px] font-medium hover:bg-amber-50 transition-colors">Review - Fail (Retry)</button>
                        <button onClick={() => openConfirm("Task Reviewed – Fail (Final)", "Mark as Failed (Final)?")} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 py-1.5 rounded text-[10px] font-medium hover:bg-red-50 transition-colors">Review - Fail (Final)</button>

                        {/* Auto/System */}
                        <button onClick={() => openConfirm("Task Overdue (Auto)", "Mark as Overdue?")} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-1.5 rounded text-[10px] font-medium hover:bg-gray-50 transition-colors">Task Overdue</button>
                        <button onClick={() => openConfirm("Resubmission Not Received (Auto)", "Mark as No Resubmission?")} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-1.5 rounded text-[10px] font-medium hover:bg-gray-50 transition-colors">No Resubmission</button>
                      </div>

                      <div className="border-t border-purple-200 dark:border-purple-800 pt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openConfirm("Interview Stage", "Move to interview phase?")}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <UserCheck size={14} /> Promote to Interview
                        </button>
                        <button
                          onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                {[
                  "Interview Stage",
                  "Interview Scheduled",
                  "Interview Rescheduled",
                  "Interview Passed",
                  "Interview Failed",
                  "Interview No Show",
                  "Interview On Hold"
                ].includes(selected.is_select) && (
                    <div className="col-span-2 space-y-3 bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
                      <h3 className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide mb-2">Interview Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => openConfirm("Interview Scheduled", "Mark as Interview Scheduled?")} className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 py-1.5 rounded text-[10px] font-medium hover:bg-orange-50 transition-colors">Scheduled</button>
                        <button onClick={() => openConfirm("Interview Rescheduled", "Mark as Rescheduled?")} className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 py-1.5 rounded text-[10px] font-medium hover:bg-orange-50 transition-colors">Rescheduled</button>

                        <button onClick={() => openConfirm("Interview Passed", "Mark as Passed?")} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1.5 rounded text-[10px] font-medium hover:bg-green-50 transition-colors">Passed</button>
                        <button onClick={() => openConfirm("Interview Failed", "Mark as Failed?")} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 py-1.5 rounded text-[10px] font-medium hover:bg-red-50 transition-colors">Failed</button>

                        <button onClick={() => openConfirm("Interview No Show", "Mark as No Show?")} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 py-1.5 rounded text-[10px] font-medium hover:bg-red-50 transition-colors">No Show</button>
                        <button onClick={() => openConfirm("Interview On Hold", "Put Interview On Hold?")} className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 py-1.5 rounded text-[10px] font-medium hover:bg-amber-50 transition-colors">On Hold</button>
                      </div>

                      <div className="border-t border-orange-200 dark:border-orange-800 pt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openConfirm("Selected", "Select this applicant?")}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <UserCheck size={14} /> Select
                        </button>
                        <button
                          onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                {selected.is_select === "On Hold" && (
                  <>
                    <button
                      onClick={() =>
                        openConfirm("Selected", "Select this applicant?")
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <UserCheck size={16} /> Selected
                    </button>
                    <button
                      onClick={() =>
                        openConfirm("Rejected", "Reject this applicant?")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {selected.is_select === "Selected" && (
                  <>
                    <button
                      onClick={() =>
                        openConfirm("Onboarded", "Onboard this applicant?")
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <UserCheck size={16} /> Onboarded
                    </button>
                    <button
                      onClick={() =>
                        openConfirm("Rejected", "Reject this applicant?")
                      }
                      className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </>
                )}
                {[
                  "Onboarded",
                  "Internship",
                  "Week 1 Review",
                  "Week 2 Review",
                  "On Track",
                  "Performance Issue",
                  "Recommended for Offer"
                ].includes(selected.is_select) && (
                    <div className="col-span-2 space-y-3 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                      <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide mb-2">Internship Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => openConfirm("Week 1 Review", "Move to Week 1 Review?")} className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 py-1.5 rounded text-[10px] font-medium hover:bg-emerald-50 transition-colors">Week 1 Review</button>
                        <button onClick={() => openConfirm("Week 2 Review", "Move to Week 2 Review?")} className="bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 py-1.5 rounded text-[10px] font-medium hover:bg-emerald-50 transition-colors">Week 2 Review</button>
                        
                        <button onClick={() => openConfirm("On Track", "Mark as On Track?")} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1.5 rounded text-[10px] font-medium hover:bg-green-50 transition-colors">On Track</button>
                        <button onClick={() => openConfirm("Performance Issue", "Mark as Performance Issue?")} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 py-1.5 rounded text-[10px] font-medium hover:bg-red-50 transition-colors">Performance Issue</button>

                        <button onClick={() => openConfirm("Recommended for Offer", "Recommend for Offer?")} className="bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 py-1.5 rounded text-[10px] font-medium hover:bg-teal-50 transition-colors col-span-2">Recommended for Offer</button>
                      </div>

                      <div className="border-t border-emerald-200 dark:border-emerald-800 pt-3 grid grid-cols-3 gap-2">
                        <button
                          onClick={() => openConfirm("Completed", "Mark as Completed?")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-[11px]"
                        >
                          <CheckCircle size={14} /> Complete
                        </button>
                        <button
                          onClick={() => openConfirm("Withdrawn", "Mark as Withdrawn?")}
                          className="bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-[11px]"
                        >
                          <Ban size={14} /> Withdraw
                        </button>
                        <button
                          onClick={() => openConfirm("Rejected", "Reject this intern?")}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-[11px]"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                {selected.is_select === "Rejected" && (
                  <>
                    <button
                      onClick={() =>
                        openConfirm("On Hold", "Re-Accept this applicant?")
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm col-span-2"
                    >
                      <CheckCircle size={16} /> Hold
                    </button>
                    <button
                      onClick={() =>
                        openConfirm("Selected", "Re-Accept this applicant?")
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm col-span-2"
                    >
                      <CheckCircle size={16} /> Selected
                    </button>
                  </>
                )}
                {selected.is_select === "Withdrawn" && (
                  <>
                    <button
                      onClick={() =>
                        openConfirm("On Hold", "Re-Accept this applicant?")
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-sm col-span-2"
                    >
                      <CheckCircle size={16} /> Hold
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() =>
                  openConfirm("delete", "Permanently DELETE this applicant?")
                }
                className="w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Trash2 size={16} /> Delete Application
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE DETAIL MODAL */}
      {selected && viewMode === "list" && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40 flex items-end justify-center">
          <div className="bg-white dark:bg-[#0A0F2C] w-full max-h-[90vh] rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex justify-between items-start mb-3">
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <X size={18} />
                </button>
                <div className="flex gap-2 items-center">
                  {(selected.is_select === "Selected" ||
                    selected.is_select === "Onboarded" ||
                    selected.is_select === "Completed") && (
                      <button
                        onClick={handleViewFullProfile}
                        className="flex items-center gap-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                      >
                        <Eye size={12} /> Full Profile
                      </button>
                    )}
                  <div
                    className={`px-2 py-1 flex items-center rounded-full text-xs font-bold uppercase ${getStatusColor(
                      selected.is_select,
                    )}`}
                  >
                    {getStatusLabel(selected.is_select)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${getAvatarBg(
                    selected.is_select,
                  )}`}
                >
                  {getInitials(selected.full_name)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {selected.full_name}
                  </h2>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-xs flex items-center gap-1">
                    <Briefcase size={12} />{" "}
                    {selected.top_priority_role || "Intern"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-3">
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

              {/* Social Links */}
              <div className="grid grid-cols-3 gap-2">
                <Field
                  icon={<Linkedin size={14} />}
                  label="LinkedIn"
                  value={
                    selected.linkedin_profile ? (
                      <a
                        href={selected.linkedin_profile}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline truncate block font-semibold text-xs"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <Field
                  icon={<Github size={14} />}
                  label="GitHub"
                  value={
                    selected.github_url ? (
                      <a
                        href={selected.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-700 dark:text-slate-300 hover:underline truncate block font-semibold text-xs"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
                <Field
                  icon={<Globe size={14} />}
                  label="Portfolio"
                  value={
                    selected.portfolio_url ? (
                      <a
                        href={selected.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline truncate block font-semibold text-xs"
                      >
                        View
                      </a>
                    ) : (
                      "—"
                    )
                  }
                />
              </div>

              {/* Location & Education */}
              <div className="grid grid-cols-2 gap-3">
                <Field
                  icon={<MapPin size={14} />}
                  label="Location"
                  value={[selected.city, selected.state, selected.country].filter(Boolean).join(", ")}
                />
                <Field
                  icon={<GraduationCap size={14} />}
                  label="Grad Year"
                  value={selected.graduation_year}
                />
              </div>

              {/* Professional Status */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-300 mb-2 flex items-center gap-2 text-sm">
                  <User size={14} /> Professional Status
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Current Status"
                    value={
                      selected.is_student
                        ? "Student"
                        : selected.is_working_professional
                          ? "Working Professional"
                          : "Not Specified"
                    }
                  />
                  <Field
                    label="Availability"
                    icon={<Clock size={12} />}
                    value={selected.available_to_join || "—"}
                  />
                </div>
              </div>

              {/* Education */}
              <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900/30">
                <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-2 flex items-center gap-2 text-sm">
                  <School size={14} /> Education
                </h3>
                <Field
                  label="University"
                  value={selected.university}
                  isFull
                />
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Field label="Program" value={selected.program_type} />
                  <Field label="Branch" value={selected.branch} />
                </div>
              </div>

              {/* Work Schedule */}
              {(selected.start_week || selected.end_week) && (
                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
                  <h3 className="font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2 text-sm">
                    <CalendarDays size={14} /> Preferred Schedule
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Start Week" value={selected.start_week} />
                    <Field label="End Week" value={selected.end_week} />
                    <Field label="Start Time" value={formatTime(selected.start_time)} />
                    <Field label="End Time" value={formatTime(selected.end_time)} />
                  </div>
                </div>
              )}

              {/* Resume Link */}
              {selected.cv_url ? (
                <a
                  href={selected.cv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 p-3 border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/20 rounded-xl text-teal-700 dark:text-teal-300 text-sm font-medium"
                >
                  <FileText size={16} /> View Resume / CV
                </a>
              ) : (
                <div className="p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center text-gray-400 text-xs">
                  No resume uploaded
                </div>
              )}

              {/* Review History */}
              {selected.review && (
                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 text-sm">
                    <MessageSquare size={14} /> Review History
                  </h3>
                  {Array.isArray(selected.review) ? (
                    selected.review.map((rev, index) => (
                      <div
                        key={index}
                        className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30"
                      >
                        <div className="flex gap-2">
                          <Quote size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-700 dark:text-gray-300 italic">{rev}</p>
                            {selected.reviewtimestamp && selected.reviewtimestamp[index] && (
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                <Clock size={10} />
                                {formatDateTime(selected.reviewtimestamp[index])}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
                      <div className="flex gap-2">
                        <Quote size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-700 dark:text-gray-300 italic">{selected.review}</p>
                          {selected.reviewtimestamp && (
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                              <Clock size={10} />
                              {formatDateTime(Array.isArray(selected.reviewtimestamp) ? selected.reviewtimestamp[0] : selected.reviewtimestamp)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="grid grid-cols-2 gap-2 mb-2">
                {(!selected.is_select || selected.is_select === "Applied") && (
                  <>
                    <button
                      onClick={() => openConfirm("Under Review", "Accept this applicant?")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <CheckCircle size={14} /> Under Review
                    </button>
                    <button
                      onClick={() => openConfirm("Assessment Stage", "Move to assessment?")}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <UserCheck size={14} /> Assessment
                    </button>
                    <button
                      onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {selected.is_select === "Under Review" && (
                  <>
                    <button
                      onClick={() => openConfirm("Task Assigned", "Move to assessment (Task Assigned)?")}
                      className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <UserCheck size={14} /> Assessment
                    </button>
                    <button
                      onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {[
                  "Assessment Stage",
                  "Task Assigned",
                  "Task Submitted",
                  "Task to be Selected",
                  "Task Overdue (Auto)",
                  "Task Reviewed – Pass",
                  "Task Reviewed – Fail (Resubmission Allowed)",
                  "Task Resubmitted",
                  "Task Reviewed – Fail (Final)",
                  "Resubmission Not Received (Auto)"
                ].includes(selected.is_select) && (
                    <div className="col-span-2 space-y-3 bg-purple-50 dark:bg-purple-900/10 p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                      <h3 className="text-xs font-bold text-purple-800 dark:text-purple-300 uppercase tracking-wide mb-2">Assessment Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Assignment */}
                        <button onClick={() => openConfirm("Task Assigned", "Mark as Task Assigned?")} className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 py-1.5 rounded text-[10px] font-medium hover:bg-purple-50 transition-colors">Task Assigned</button>
                        <button onClick={() => openConfirm("Task to be Selected", "Mark as Task to be Selected?")} className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 py-1.5 rounded text-[10px] font-medium hover:bg-purple-50 transition-colors">Task to be Selected</button>

                        {/* Submission */}
                        <button onClick={() => openConfirm("Task Submitted", "Mark as Task Submitted?")} className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 py-1.5 rounded text-[10px] font-medium hover:bg-blue-50 transition-colors">Task Submitted</button>
                        <button onClick={() => openConfirm("Task Resubmitted", "Mark as Resubmitted?")} className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 py-1.5 rounded text-[10px] font-medium hover:bg-blue-50 transition-colors">Task Resubmitted</button>

                        {/* Review Results */}
                        <button onClick={() => openConfirm("Task Reviewed – Pass", "Mark as Passed?")} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1.5 rounded text-[10px] font-medium hover:bg-green-50 transition-colors">Review - Pass</button>
                        <button onClick={() => openConfirm("Task Reviewed – Fail (Resubmission Allowed)", "Mark as Failed (Retry)?")} className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 py-1.5 rounded text-[10px] font-medium hover:bg-amber-50 transition-colors">Review - Fail (Retry)</button>
                        <button onClick={() => openConfirm("Task Reviewed – Fail (Final)", "Mark as Failed (Final)?")} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 py-1.5 rounded text-[10px] font-medium hover:bg-red-50 transition-colors">Review - Fail (Final)</button>

                        {/* Auto/System */}
                        <button onClick={() => openConfirm("Task Overdue (Auto)", "Mark as Overdue?")} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-1.5 rounded text-[10px] font-medium hover:bg-gray-50 transition-colors">Task Overdue</button>
                        <button onClick={() => openConfirm("Resubmission Not Received (Auto)", "Mark as No Resubmission?")} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 py-1.5 rounded text-[10px] font-medium hover:bg-gray-50 transition-colors">No Resubmission</button>
                      </div>

                      <div className="border-t border-purple-200 dark:border-purple-800 pt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openConfirm("Interview Stage", "Move to interview phase?")}
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <UserCheck size={14} /> Promote to Interview
                        </button>
                        <button
                          onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                {[
                  "Interview Stage",
                  "Interview Scheduled",
                  "Interview Rescheduled",
                  "Interview Passed",
                  "Interview Failed",
                  "Interview No Show",
                  "Interview On Hold"
                ].includes(selected.is_select) && (
                    <div className="col-span-2 space-y-3 bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl border border-orange-100 dark:border-orange-900/30">
                      <h3 className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide mb-2">Interview Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => openConfirm("Interview Scheduled", "Mark as Interview Scheduled?")} className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 py-1.5 rounded text-[10px] font-medium hover:bg-orange-50 transition-colors">Scheduled</button>
                        <button onClick={() => openConfirm("Interview Rescheduled", "Mark as Rescheduled?")} className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 py-1.5 rounded text-[10px] font-medium hover:bg-orange-50 transition-colors">Rescheduled</button>

                        <button onClick={() => openConfirm("Interview Passed", "Mark as Passed?")} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1.5 rounded text-[10px] font-medium hover:bg-green-50 transition-colors">Passed</button>
                        <button onClick={() => openConfirm("Interview Failed", "Mark as Failed?")} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 py-1.5 rounded text-[10px] font-medium hover:bg-red-50 transition-colors">Failed</button>

                        <button onClick={() => openConfirm("Interview No Show", "Mark as No Show?")} className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 py-1.5 rounded text-[10px] font-medium hover:bg-red-50 transition-colors">No Show</button>
                        <button onClick={() => openConfirm("Interview On Hold", "Put Interview On Hold?")} className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 py-1.5 rounded text-[10px] font-medium hover:bg-amber-50 transition-colors">On Hold</button>
                      </div>

                      <div className="border-t border-orange-200 dark:border-orange-800 pt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openConfirm("Pre-boarding / Selected", "Select this applicant?")}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <UserCheck size={14} /> Select
                        </button>
                        <button
                          onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                {[
                  "Pre-boarding / Selected",
                  "Selected",
                  "Rules Shared & Email Sent",
                  "Rules Shared",
                  "Selection Email Sent",
                  "Pre-boarding Completed"
                ].includes(selected.is_select) && (
                    <div className="col-span-2 space-y-3 bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                      <h3 className="text-xs font-bold text-green-800 dark:text-green-300 uppercase tracking-wide mb-2">Pre-boarding Actions</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => openConfirm("Rules Shared & Email Sent", "Mark Rules Shared & Email Sent?")} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1.5 rounded text-[10px] font-medium hover:bg-green-50 transition-colors">Rules & Email Sent</button>
                        <button onClick={() => openConfirm("Pre-boarding Completed", "Mark Pre-boarding Completed?")} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 py-1.5 rounded text-[10px] font-medium hover:bg-green-50 transition-colors">Pre-boarding Completed</button>
                      </div>

                      <div className="border-t border-green-200 dark:border-green-800 pt-3 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openConfirm("Onboarded", "Onboard this applicant?")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <UserCheck size={14} /> Onboarded
                        </button>
                        <button
                          onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                {selected.is_select === "On Hold" && (
                  <>
                    <button
                      onClick={() => openConfirm("Pre-boarding / Selected", "Select this applicant?")}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <UserCheck size={14} /> Select
                    </button>
                    <button
                      onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}

                {selected.is_select === "Onboarded" && (
                  <>
                    <button
                      onClick={() => openConfirm("Completed", "Mark as completed?")}
                      className="bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <Award size={14} /> Completed
                    </button>
                    <button
                      onClick={() => openConfirm("Withdrawn", "Mark as withdrawn?")}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <Ban size={14} /> Withdrawn
                    </button>
                    <button
                      onClick={() => openConfirm("Rejected", "Reject this applicant?")}
                      className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs col-span-2"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </>
                )}
                {selected.is_select === "Rejected" && (
                  <>
                    <button
                      onClick={() => openConfirm("On Hold", "Re-Accept this applicant?")}
                      className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <Clock size={14} /> Hold
                    </button>
                    <button
                      onClick={() => openConfirm("Pre-boarding / Selected", "Re-Accept this applicant?")}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs"
                    >
                      <CheckCircle size={14} /> Select
                    </button>
                  </>
                )}
                {(selected.is_select === "Withdrawn" || selected.is_select === "Inactive") && (
                  <button
                    onClick={() => openConfirm("On Hold", "Re-Accept this applicant?")}
                    className="bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-1 text-xs col-span-2"
                  >
                    <Clock size={14} /> Hold
                  </button>
                )}
              </div>
              <button
                onClick={() => openConfirm("delete", "Permanently DELETE this applicant?")}
                className="w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-xs"
              >
                <Trash2 size={14} /> Delete Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#112240] p-6 rounded-2xl w-full max-w-[400px] shadow-2xl text-center animate-in fade-in zoom-in duration-200">
            <div
              className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.action === "selected"
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : confirmModal.action === "hired"
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  : confirmModal.action === "not_selected" ||
                    confirmModal.action === "delete" ||
                    confirmModal.action === "delete_project" ||
                    confirmModal.action === "delete_weekly_update"
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : confirmModal.action === "completed"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
            >
              {confirmModal.action === "not_selected" ||
                confirmModal.action === "delete_project" ? (
                <XCircle size={24} />
              ) : confirmModal.action === "delete" ||
                confirmModal.action === "delete_weekly_update" ? (
                <Trash2 size={24} />
              ) : confirmModal.action === "hired" ? (
                <UserCheck size={24} />
              ) : (
                <CheckCircle size={24} />
              )}
            </div>

            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
              Confirm Action
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {confirmModal.message}
            </p>

            {confirmModal.action !== "delete" &&
              confirmModal.action !== "delete_project" &&
              confirmModal.action !== "delete_weekly_update" && (
                <div className="mb-6 relative">
                  <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                    <MessageSquare size={16} />
                  </div>
                  <textarea
                    className="w-full p-3 pl-9 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 h-24 resize-none"
                    placeholder={["Week 1 Review", "Week 2 Review"].includes(confirmModal.action) ? "Write weekly review details (required)..." : "Add a review or comment (optional)..."}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </div>
              )}

            <div className="flex gap-3">
              <button
                className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                onClick={() => {
                  setConfirmModal({
                    show: false,
                    action: null,
                    message: "",
                    id: null,
                  });
                  setReviewText("");
                }}
                disabled={isConfirmingAction}
              >
                Cancel
              </button>
              <button
                className={`flex-1 py-2.5 rounded-lg text-white font-medium shadow-md transition-colors flex items-center justify-center gap-2 ${confirmModal.action === "Selected"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : confirmModal.action === "Onboarded"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : confirmModal.action === "Rejected" ||
                      confirmModal.action === "delete" ||
                      confirmModal.action === "delete_project" ||
                      confirmModal.action === "delete_weekly_update"
                      ? "bg-red-600 hover:bg-red-700"
                      : confirmModal.action === "completed"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600"
                  } ${isConfirmingAction ? "opacity-70 cursor-not-allowed" : ""}`}
                onClick={confirmAction}
                disabled={isConfirmingAction}
              >
                {isConfirmingAction ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Confirming...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
