import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  User,
  Phone,
  Mail,
  Linkedin,
  Globe,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  Clock,
  Link as LinkIcon,
  UploadCloud,
  Send,
  Rocket,
  Info,
  CalendarDays,
  Github,
  FileText,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";

export default function ApplyInternship() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  const [hasApplied, setHasApplied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [internId, setInternId] = useState(null);
  const [existingCvUrl, setExistingCvUrl] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [fetchingExisting, setFetchingExisting] = useState(true);


  // Days for the dropdown
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    linkedin_profile: "",
    university: "",
    country: "",
    state: "",
    city: "",
    program_type: "",
    branch: "",
    graduation_year: "",
    is_student: false,
    is_working_professional: false,
    has_internship_exp: false,
    // --- New Fields for Descriptions ---
    work_experience_desc: "",
    internship_exp_desc: "",
    // ----------------------------------
    portfolio_url: "",
    github_url: "",
    top_priority_role: "",
    availability: "",
    start_week: "",
    end_week: "",
    start_time: "",
    end_time: "",
    cv: null,
    Interview_date: "",
    available_to_join: "",
  });

  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser]);

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const checkExistingApplication = async () => {
      const currentUserId = user?.id;
      if (!currentUserId) {
        setFetchingExisting(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("w_internship_applications")
          .select("*")
          .eq("user_id", currentUserId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching existing application:", JSON.stringify(error, null, 2));
        } else if (data) {
          setHasApplied(true);
          setInternId(data.id);
          setExistingCvUrl(data.cv_url);
          setCurrentStatus(data.current_status || "");
          setForm({
            full_name: data.full_name || "",
            phone_number: data.phone_number || "",
            email: data.email || "",
            linkedin_profile: data.linkedin_profile || "",
            university: data.university || "",
            country: data.country || "",
            state: data.state || "",
            city: data.city || "",
            program_type: data.program_type || "",
            branch: data.branch || "",
            graduation_year: data.graduation_year || "",
            is_student: data.is_student || false,
            is_working_professional: data.is_working_professional || false,
            has_internship_exp: data.has_internship_exp || false,
            work_experience_desc: data.work_experience_desc || "",
            internship_exp_desc: data.internship_exp_desc || "",
            portfolio_url: data.portfolio_url || "",
            github_url: data.github_url || "",
            top_priority_role: data.top_priority_role || "",
            availability: data.availability || "",
            start_week: data.start_week || "",
            end_week: data.end_week || "",
            start_time: data.start_time || "",
            end_time: data.end_time || "",
            cv: null, // Don't pre-fill file input
            Interview_date: data.interview_date || "",
            available_to_join: data.available_to_join || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch application:", err);
      } finally {
        setFetchingExisting(false);
      }
    };

    if (!loadingUser) {
      checkExistingApplication();
    }
 }, [user, loadingUser]); 

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setForm({ ...form, cv: files[0] });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  // --- LOGIC TO CALCULATE HOURS AND COMPARE WITH PREFERENCE ---
  const checkScheduleValidity = () => {
    if (
      !form.start_week ||
      !form.end_week ||
      !form.start_time ||
      !form.end_time ||
      !form.availability
    ) {
      return {
        valid: false,
        message: "Please fill all schedule and availability fields.",
      };
    }

    const startIndex = weekDays.indexOf(form.start_week);
    const endIndex = weekDays.indexOf(form.end_week);

    if (startIndex === -1 || endIndex === -1)
      return { valid: false, message: "Invalid week selection." };
    if (endIndex < startIndex)
      return { valid: false, message: "End week cannot be before start week." };

    const daysCount = endIndex - startIndex + 1;

    const start = new Date(`1970-01-01T${form.start_time}:00`);
    const end = new Date(`1970-01-01T${form.end_time}:00`);

    if (end <= start)
      return { valid: false, message: "End time must be after start time." };

    const hoursPerDay = (end - start) / 1000 / 60 / 60;
    const totalWeeklyHours = daysCount * hoursPerDay;
    const requiredHours = form.availability.includes("30") ? 30 : 15;

    if (totalWeeklyHours >= requiredHours) {
      return { valid: true };
    } else {
      return {
        valid: false,
        message: `Your schedule (${totalWeeklyHours.toFixed(
          1,
        )} hrs/week) does not meet the required ${requiredHours} hrs based on your availability preference.`,
      };
    }
  };

  const handlePdfUpload = async (file, USERID) => {
    if (!file) return;

    // 🔒 validations
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("PDF must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const filePath = `${USERID}/resume_${Date.now()}.pdf`;

      // 1️⃣ Upload
      const { error: uploadError } = await supabase.storage
        .from("internship_resumes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2️⃣ Get URL
      const { data } = supabase.storage
        .from("internship_resumes")
        .getPublicUrl(filePath);

      return data.publicUrl;

      // 3️⃣ Update DB
    } catch (error) {
      console.error(error);
      toast.error("PDF upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to apply");
      return;
    }

    if (!isEditing && !form.cv) {
      toast.error("Please upload your CV");
      return;
    }
    // Required fields
if (!form.full_name.trim()) {
  toast.error("Full Name is required");
  return;
}

if (!form.phone_number.trim()) {
  toast.error("Phone Number is required");
  return;
}

if (!/^\d{10}$/.test(form.phone_number.replace(/\D/g, ""))) {
  toast.error("Enter a valid 10 digit phone number");
  return;
}

if (!form.email.trim()) {
  toast.error("Email is required");
  return;
}

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
  toast.error("Enter a valid email address");
  return;
}

if (!form.program_type) {
  toast.error("Please select Program Type");
  return;
}

if (!form.top_priority_role) {
  toast.error("Please select a Top Priority Role");
  return;
}

if (!form.availability) {
  toast.error("Please select Availability");
  return;
}

if (!form.available_to_join) {
  toast.error("Please select when you can join");
  return;
}

if (!form.Interview_date) {
  toast.error("Please select a preferred interview date");
  return;
}
const selectedDate = new Date(form.Interview_date);
const today = new Date();
today.setHours(0, 0, 0, 0);

if (selectedDate < today) {
  toast.error("Interview date cannot be in the past");
  return;
}
// Graduation year validation
if (
  form.graduation_year &&
  !/^\d{4}$/.test(form.graduation_year)
) {
  toast.error("Graduation year must be 4 digits");
  return;
}

// LinkedIn validation
if (
  form.linkedin_profile &&
  !form.linkedin_profile.startsWith("http")
) {
  toast.error("LinkedIn URL must start with http:// or https://");
  return;
}

// Portfolio validation
if (
  form.portfolio_url &&
  !form.portfolio_url.startsWith("http")
) {
  toast.error("Portfolio URL must start with http:// or https://");
  return;
}

// GitHub validation
if (
  form.github_url &&
  !form.github_url.startsWith("http")
) {
  toast.error("GitHub URL must start with http:// or https://");
  return;
}

// Work experience description required
if (
  form.is_working_professional &&
  !form.work_experience_desc.trim()
) {
  toast.error("Please describe your work experience");
  return;
}

// Internship description required
if (
  form.has_internship_exp &&
  !form.internship_exp_desc.trim()
) {
  toast.error("Please describe your internship experience");
  return;
}

    setLoading(true);

    try {
      // 1️⃣ Upload Resume

      const scheduleCheck = checkScheduleValidity();

      if (!scheduleCheck.valid) {
        toast.error(scheduleCheck.message);
        setLoading(false);
        return; // ⛔ STOP SUBMISSION
      }
      const cvUrl = form.cv
  ? await handlePdfUpload(form.cv, user.id)
  : existingCvUrl;
      if (!cvUrl) {
  setLoading(false);
  return;
}
      const applicationData = {
        user_id: user.id,
      full_name: form.full_name.trim(),
email: form.email.trim(),
phone_number: form.phone_number.trim(),

        linkedin_profile: form.linkedin_profile,
        portfolio_url: form.portfolio_url,
        github_url: form.github_url,

        university: form.university,
        country: form.country,
        state: form.state,
        city: form.city,

        program_type: form.program_type,
        branch: form.branch,
        graduation_year: form.graduation_year,

        is_student: form.is_student,
        is_working_professional: form.is_working_professional,
        has_internship_exp: form.has_internship_exp,

        work_experience_desc: form.work_experience_desc,
        internship_exp_desc: form.internship_exp_desc,

        top_priority_role: form.top_priority_role,
        availability: form.availability,

        start_week: form.start_week,
        end_week: form.end_week,
        start_time: form.start_time,
        end_time: form.end_time,

        interview_date: form.Interview_date,
        available_to_join: form.available_to_join,

        cv_url: cvUrl
      };

      if (isEditing) {
      const {
  data: { session },
} = await supabase.auth.getSession();

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "update_internship_application",
      id: internId,
      ...applicationData,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}
        toast.success("Application updated successfully!");
        setIsEditing(false); // Switch back to applied view
      } else {
        applicationData.current_status = "Applied";
        applicationData.current_sub_status = "Application Received";
        applicationData.created_at = new Date().toISOString();

        const {
  data: { session },
} = await supabase.auth.getSession();

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "create_internship_application",
      ...applicationData,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}
        toast.success("Application submitted successfully!");
        setHasApplied(true); // Switch to applied view
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission Error Details:", err);
      toast.error(err.message || JSON.stringify(err) || "Submission failed");
    }

    setLoading(false);
  };

  if (fetchingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0F2C]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 md:px-16 bg-white dark:bg-[#0A0F2C] min-h-screen transition-colors duration-700 font-sans relative overflow-hidden">
      {/* 🎨 Consistent Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,180,0.1)_0%,transparent_70%)] blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium shadow-md border border-emerald-100 dark:border-emerald-900/50 mb-6">
            <Rocket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Join Our Team</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0D1B2A] dark:text-white leading-tight mb-6">
            Apply for{" "}
            <span className="bg-gradient-to-r from-[#00A884] via-[#00C6B1] to-[#00D4FF] text-transparent bg-clip-text">
              SmaranAI Internship
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Kickstart your career in AI & Data Science with real-world projects,
            expert mentorship, and hands-on experience.
          </p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white dark:bg-[#0E1835]/90 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* INFO BANNER */}
          <div className="bg-emerald-50/50 dark:bg-[#0F1A32] border-b border-emerald-100 dark:border-emerald-900/30 p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0" />
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                <h2 className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  Before You Apply
                </h2>
                <p>
                  <strong>SmaranAI.in</strong> offers Mentoring, Research
                  Support, and Project Guidance. This is a{" "}
                  <strong>Fully Online, Unpaid Internship (2-6 months)</strong>.
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5 marker:text-emerald-500">
                  <li>Eligibility: Students, Freshers, AI Enthusiasts.</li>
                  <li>Requirement: Daily Reporting & Attendance.</li>
                  <li>Benefit: Verifiable Experience Certificate.</li>
                  <li>Review: Weekly performance evaluations.</li>
                </ul>
                <p className="text-xs md:text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-300">
                  <strong>Note for Professionals:</strong> Career transition
                  mentorship is available as a paid service (₹5000).
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {(hasApplied && !isEditing) && !submitted ? (
              <div className="text-center py-16 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  You have already applied!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Your internship application is currently under review. Need to update your application details?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {!["Selected", "Pre-boarding / Selected", "Pre-boarding Completed", "Onboarded", "Internship"].includes(currentStatus) ? (
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setIsEditing(true);
                      }}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                    >
                      Edit Application
                    </button>
                  ) : (
                    <span className="px-6 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-900/30 text-sm">
                      ⚠️ Editing is disabled as you have been selected.
                    </span>
                  )}
                  <button
                    onClick={() => navigate("/mypage")}
                    className="px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-[#111a2e] transition-colors"
                  >
                    View Status in My Page
                  </button>
                </div>
              </div>
            ) : !submitted || isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. PERSONAL DETAILS */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      icon={User}
                      label="Full Name"
                      placeholder="John Doe"
                    />
                    <Input
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      icon={Phone}
                      label="Phone Number"
                      placeholder="+91 98765 43210"
                    />
                    <Input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      icon={Mail}
                      label="Email Address"
                      placeholder="you@example.com"
                      type="email"
                    />
                    <Input
                      name="linkedin_profile"
                      value={form.linkedin_profile}
                      onChange={handleChange}
                      icon={Linkedin}
                      label="LinkedIn Profile"
                      placeholder="linkedin.com/in/..."
                      optional
                    />
                  </div>
                </div>

                {/* 2. LOCATION */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      icon={Globe}
                      label="Country"
                      placeholder="India"
                      optional
                    />
                    <Input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      icon={MapPin}
                      label="State"
                      placeholder="Telangana"
                      optional
                    />
                    <Input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      icon={Building2}
                      label="City"
                      placeholder="Hyderabad"
                      optional
                    />
                  </div>
                </div>

                {/* 3. EDUCATION */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" /> Education
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Select
                      label="Program Type"
                      name="program_type"
                      value={form.program_type}
                      onChange={handleChange}
                      icon={GraduationCap}
                      options={[
                        "B.Tech",
                        "M.Tech",
                        "B.Sc",
                        "MBA",
                        "Working Professional",
                      ]}
                    />
                    <Input
                      name="branch"
                      value={form.branch}
                      onChange={handleChange}
                      icon={Building2}
                      label="Branch"
                      placeholder="CSE/ECE..."
                      optional
                    />
                    <Input
                      name="graduation_year"
                      value={form.graduation_year}
                      onChange={handleChange}
                      icon={Clock}
                      label="Graduation Year"
                      placeholder="2025"
                      optional
                    />
                  </div>
                  <Input
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    icon={Building2}
                    label="University / College Name"
                    placeholder="Institute Name..."
                    optional
                  />
                </div>

                {/* 4. STATUS (CHECKBOXES) */}
                <div className="bg-gray-50 dark:bg-[#0A0F2C] p-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3">
                    Current Status
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Checkbox
                      name="is_student"
                      checked={form.is_student}
                      onChange={handleChange}
                      label="I am a Student"
                    />
                    <Checkbox
                      name="is_working_professional"
                      checked={form.is_working_professional}
                      onChange={handleChange}
                      label="Working Professional"
                    />
                    <Checkbox
                      name="has_internship_exp"
                      checked={form.has_internship_exp}
                      onChange={handleChange}
                      label="Previous Internship Exp"
                    />
                  </div>

                  {/* --- DYNAMIC DESCRIPTION INPUTS --- */}
                  <div className="space-y-4 mt-2">
                    {/* Shows only if Working Professional is checked */}
                    {form.is_working_professional && (
                      <TextArea
                        name="work_experience_desc"
                        value={form.work_experience_desc}
                        onChange={handleChange}
                        label="Describe your Work Experience"
                        placeholder="Company name, Role, Years of experience..."
                        icon={Briefcase}
                      />
                    )}

                    {/* Shows only if Previous Internship Exp is checked */}
                    {form.has_internship_exp && (
                      <TextArea
                        name="internship_exp_desc"
                        value={form.internship_exp_desc}
                        onChange={handleChange}
                        label="Previous Internship Details"
                        placeholder="Where did you intern? What projects did you work on?"
                        icon={FileText}
                      />
                    )}
                  </div>
                </div>

                {/* 5. ROLE & AVAILABILITY & SCHEDULE */}
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Preference & Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Select
                      label="Top Priority Role"
                      name="top_priority_role"
                      value={form.top_priority_role}
                      onChange={handleChange}
                      icon={Briefcase}
                      options={[
                        "AI Developer",
                        "Automation Expert",
                        "Full Stack Web Developer",
                        "UI/UX Designer",
                        "Front End",
                        "S/W Requirement Analyst",
                        "Team Coordinator (FS/AI)",
                        "S/W Developer/Trainer",
                        "Mentor",
                        "Digital Marketing",
                        "HR",
                        "S/W Tester",
                        "Ethical Hacking",
                        "Psychology",
                        "Education",
                        "PRO",
                        "Business analyst",
                        "Market research",
                      ]}
                    />
                    <Select
                      label="Availability"
                      name="availability"
                      value={form.availability}
                      onChange={handleChange}
                      icon={Clock}
                      options={["Full Time (30hrs)", "Part Time (15hrs)"]}
                    />
                  </div>

                  {/* Added Joining Date & Availability Input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input
                      type="date"
                      label="Preferred Interview Date"
                      name="Interview_date"
                      value={form.Interview_date}
                      onChange={handleChange}
                      icon={CalendarDays}
                    />
                    <Select
                      label="When are you available to join?"
                      name="available_to_join"
                      value={form.available_to_join}
                      onChange={handleChange}
                      icon={Rocket}
                      options={[
                        "Immediately",
                        "In 1 Week",
                        "In 2 Weeks",
                        "After 1 Month",
                      ]}
                    />
                  </div>

                  {/* --- NEW SCHEDULE SECTION --- */}
                  <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 mb-6">
                    <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-4 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> Select Your Schedule
                    </h4>

                    {/* Line 1: Start Week & End Week */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <Select
                        label="Start Week"
                        name="start_week"
                        value={form.start_week}
                        onChange={handleChange}
                        options={weekDays}
                      />
                      <Select
                        label="End Week"
                        name="end_week"
                        value={form.end_week}
                        onChange={handleChange}
                        options={weekDays}
                      />
                    </div>

                    {/* Line 2: Start Time & End Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        type="time"
                        label="Start Time"
                        name="start_time"
                        value={form.start_time}
                        onChange={handleChange}
                      />
                      <Input
                        type="time"
                        label="End Time"
                        name="end_time"
                        value={form.end_time}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      name="portfolio_url"
                      value={form.portfolio_url}
                      onChange={handleChange}
                      icon={LinkIcon}
                      label="Portfolio URL"
                      placeholder="https://..."
                      optional
                    />
                    <Input
                      name="github_url"
                      value={form.github_url}
                      onChange={handleChange}
                      icon={Github}
                      label="Github URL"
                      placeholder="https://github.com/..."
                      optional
                    />
                  </div>
                </div>

                {/* 6. CV UPLOAD */}
                <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-[#0A0F2C] hover:bg-gray-100 dark:hover:bg-[#111a2e] transition-colors">
                  <label className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full h-full">
                    <UploadCloud className="w-10 h-10 text-emerald-500" />
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {isEditing && existingCvUrl ? "Update CV (PDF Only) - Optional" : "Upload CV (PDF Only)"}{" "}
                      {!isEditing && <span className="text-red-500">*</span>}
                    </span>
                    <span className="text-xs text-gray-500">
                      Max file size 5MB
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  {form.cv ? (
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 py-2 px-4 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" /> {form.cv.name}
                    </div>
                  ) : isEditing && existingCvUrl ? (
                    <div className="mt-3 flex flex-col items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-3 px-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Using previously uploaded CV</span>
                      </div>
                      <a href={existingCvUrl} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
                        View Current CV <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : null}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isEditing ? "Updating Application..." : "Submitting Application..."}
                    </>
                  ) : (
                    <>
                      {isEditing ? "Update Application" : "Apply Now"} <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-24 animate-fade-in">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {isEditing ? "Application Updated!" : "Application Submitted!"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                  {isEditing ? "Your application details have been successfully updated." : "Thank you for applying. We will review your profile and get back to you shortly."}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Return Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------- */
/* REUSABLE UI COMPONENTS (Design System)      */
/* ------------------------------------------- */

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon: Icon,
  placeholder,
  optional = false,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {label} {!optional && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl 
          border border-gray-300 dark:border-gray-700 
          bg-white dark:bg-[#0A0F2C] 
          text-gray-900 dark:text-white placeholder-gray-400
          focus:ring-2 focus:ring-emerald-400 focus:border-transparent 
          outline-none transition-all duration-200
        `}
      />
    </div>
  </div>
);

// --- NEW TEXTAREA COMPONENT ---
const TextArea = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  placeholder,
  optional = false,
}) => (
  <div className="flex flex-col gap-2 animate-fade-in-up">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {label} {!optional && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows="3"
        className={`
          w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl 
          border border-gray-300 dark:border-gray-700 
          bg-white dark:bg-[#0A0F2C] 
          text-gray-900 dark:text-white placeholder-gray-400
          focus:ring-2 focus:ring-emerald-400 focus:border-transparent 
          outline-none transition-all duration-200 resize-none
        `}
      />
    </div>
  </div>
);

const Select = ({ label, name, value, onChange, options, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`
          w-full ${Icon ? "pl-10" : "pl-4"} pr-10 py-3 rounded-xl 
          border border-gray-300 dark:border-gray-700 
          bg-white dark:bg-[#0A0F2C] 
          text-gray-900 dark:text-white
          focus:ring-2 focus:ring-emerald-400 focus:border-transparent 
          outline-none transition-all appearance-none cursor-pointer
        `}
      >
        <option value="" className="text-gray-400">
          Select...
        </option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  </div>
);

const Checkbox = ({ name, checked, onChange, label }) => (
  <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
    <div className="relative flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 checked:bg-emerald-500 checked:border-emerald-500 transition-all"
      />
      <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
    </div>
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
      {label}
    </span>
  </label>
);
