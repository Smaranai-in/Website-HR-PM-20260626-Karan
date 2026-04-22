import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MessageCircle, User, Phone, Mail, Globe, MapPin,
  Building2, GraduationCap, Layers, Type, FileText,
  UploadCloud, Send, CheckCircle2, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";

const AcademicProjects = () => {
  const bgImage = process.env.PUBLIC_URL + "/projects.jpg";

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    project_domain: "",
    project_title: "",
    description: "",
    document: null,
    country: "",
    state: "",
    city: "",
    college: "",
    grad_year: "",
  });

  const { user, loadingUser, profile } = useAuthModal();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser]);

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setForm({ ...form, document: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ------------------------------
  // 1️⃣ Submit form details
  // ------------------------------
  const submitProjectDetails = async (documentUrl) => {
    console.log("project details");

    const { data, error } = await supabase
      .from("w_academic_projects")
      .insert([
        {
          user_id: user.id, // ✅ MUST be auth user id
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          project_domain: form.project_domain,
          project_title: form.project_title,
          description: form.description,
          document_url: documentUrl,
          country: form.country,
          state: form.state,
          city: form.city,
          college: form.college,
          grad_year: form.grad_year,
          status: "pending",
        },
      ])
      .select("id")
      .single();

    console.log("status data uploaded");

    if (error) throw error;
    return data.id;
  };



  // ------------------------------
  // 2️⃣ Upload document using ID
  // ------------------------------
  const uploadDocument = async () => {
    if (!form.document) return null;

    // validations
    if (form.document.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return null;
    }

    if (form.document.size > 5 * 1024 * 1024) {
      toast.error("File must be less than 5MB");
      return null;
    }
    const USERID = profile.id
    const filedoc = form.document


    const filePath = `${USERID}/project_${Date.now()}.pdf`;

    // 1️⃣ Upload to bucket

    const { error: uploadError } = await supabase.storage
      .from("academic_project_docs")
      .upload(filePath, filedoc);

    if (uploadError) throw uploadError;

    // 2️⃣ Get public URL
    const { data } = supabase.storage
      .from("academic_project_docs")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };


  // ------------------------------
  // 3️⃣ Validate the form
  // ------------------------------
  const validateForm = () => {
    if (!form.full_name) return "Full name is required";
    if (!form.phone) return "Phone number is required";
    if (!form.email) return "Email is required";
    if (!form.country) return "Country is required";
    if (!form.state) return "State is required";
    if (!form.city) return "City is required";
    if (!form.college) return "College name is required";
    if (!form.grad_year) return "Graduation year is required";
    if (!form.project_domain) return "Project domain is required";
    if (!form.project_title) return "Project title is required";
    if (!form.description) return "Project description is required";
    return null;
  };


  // ------------------------------
  // 4️⃣ Handle Submit
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) return toast.error(error);

    if (!user) {
      toast.error("Please login to submit");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload file

      const documentUrl = await uploadDocument();


      // 2️⃣ Insert data
      await submitProjectDetails(documentUrl);

      toast.success("Project enrollment submitted successfully 🎉");

      // 3️⃣ Reset form
      setForm({
        full_name: "",
        phone: "",
        email: "",
        project_domain: "",
        project_title: "",
        description: "",
        document: null,
        country: "",
        state: "",
        city: "",
        college: "",
        grad_year: "",
      });

    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="pt-24 pb-12 px-4 md:px-16 bg-white dark:bg-[#0A0F2C] min-h-screen transition-colors duration-700 font-sans relative overflow-hidden">

      {/* 🎨 Consistent Background Glow (Same as Home) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[120%] h-[140%] bg-[radial-gradient(circle_at_30%_40%,rgba(0,255,180,0.15)_0%,transparent_70%)] blur-3xl"></div>
      </div>

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        {/* Left Content */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium shadow-md border border-emerald-100 dark:border-emerald-900/50">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Academic Excellence</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0D1B2A] dark:text-white leading-tight">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-[#00A884] via-[#00C6B1] to-[#00D4FF] text-transparent bg-clip-text">
              Project Potential
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            From conceptualization to final presentation, we provide expert mentorship to help you design, develop, and deliver high-impact academic projects using cutting-edge tech.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Idea Conceptualization",
              "Web, App, AI & IoT Support",
              "Code Review & Optimization",
              "Report & Presentation Prep"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative group">
          {/* Soft glow behind image */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_rgba(0,255,200,0.05)] border border-gray-100 dark:border-gray-700">
            <img
              src={bgImage}
              alt="Academic Projects"
              className="w-full h-[400px] object-cover transform transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white dark:bg-[#0E1835]/90 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">

          {/* Form Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Enroll Your Project</h2>
            <p className="text-emerald-50 text-sm md:text-base">Fill in the details below to get started with our expert mentorship.</p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* --- Personal Details --- */}
              <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <User className="w-5 h-5 text-emerald-500" />
                <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Student Information</span>
              </div>

              <Input
                label="Full Name"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                icon={User}
                placeholder="John Doe"
              />

              <Input
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="+91 98765 43210"
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                icon={Mail}
                placeholder="student@example.com"
                full
              />

              {/* --- Location Details --- */}
              <div className="md:col-span-2 flex items-center gap-2 mt-6 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Location & College</span>
              </div>

              <Input label="Country" name="country" value={form.country} onChange={handleChange} icon={Globe} placeholder="India" />
              <Input label="State" name="state" value={form.state} onChange={handleChange} icon={MapPin} placeholder="Telangana" />
              <Input label="City" name="city" value={form.city} onChange={handleChange} icon={Building2} placeholder="Hyderabad" />

              <Input label="Graduation Year" name="grad_year" value={form.grad_year} onChange={handleChange} icon={GraduationCap} placeholder="2025" />

              <Input
                label="College Name"
                name="college"
                value={form.college}
                onChange={handleChange}
                icon={Building2}
                full
                placeholder="Institute of Technology..."
              />

              {/* --- Project Details --- */}
              <div className="md:col-span-2 flex items-center gap-2 mt-6 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <Layers className="w-5 h-5 text-emerald-500" />
                <span className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">Project Specification</span>
              </div>

              <Select
                label="Project Domain"
                name="project_domain"
                value={form.project_domain}
                onChange={handleChange}
                icon={Layers}
                options={[
                  "Web Development",
                  "Mobile App Development",
                  "AI / Machine Learning",
                  "IoT / Robotics",
                  "Data Science",
                  "Cyber Security",
                  "Cloud / DevOps",
                ]}
              />

              <Input
                label="Project Title"
                name="project_title"
                value={form.project_title}
                onChange={handleChange}
                icon={Type}
                placeholder="e.g. Smart Attendance System"
              />

              {/* Description TextArea */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-500" /> Brief Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your project idea in a few lines..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F2C] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>

              {/* File Upload */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                  <UploadCloud className="w-4 h-4 text-emerald-500" /> Upload Document <span className="text-xs font-normal text-gray-500">(Upload PDF only)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="document"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-emerald-50 file:text-emerald-700
                      dark:file:bg-emerald-900/20 dark:file:text-emerald-400
                      hover:file:bg-emerald-100 dark:hover:file:bg-emerald-900/40
                      cursor-pointer border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-[#0A0F2C]
                    "
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Project Enrollment
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------- */
/* REUSABLE UI COMPONENTS (Design System Applied) */
/* ------------------------------------------- */

const Input = ({ label, name, value, onChange, type = "text", full = false, icon: Icon, placeholder }) => (
  <div className={`flex flex-col gap-2 ${full ? "md:col-span-2" : ""}`}>
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {label} <span className="text-red-500">*</span>
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
        <option value="" className="text-gray-400">Select Domain</option>
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

export default AcademicProjects;