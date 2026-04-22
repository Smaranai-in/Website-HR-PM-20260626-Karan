import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MessageCircle,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  UploadCloud,
  Send,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";

const ResearchSupport = () => {
  const bgImage = process.env.PUBLIC_URL + "/research.jpg";

  const [form, setForm] = useState({
    user_id: "",
    full_name: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    college: "",
    grad_year: "",
    role: "",
    topic: "",
    stage: "",
    description: "",
    support_needed: "",
    document: null,
  });

  const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, document: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser]);

  const submitFormDetails = async (documentUrl = null) => {
    const { data, error } = await supabase
      .from("w_research_enrollments")
      .insert([
        {
          user_id: user.id, // ✅ MUST be auth user id
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          country: form.country,
          state: form.state,
          city: form.city,
          college: form.college,
          grad_year: form.grad_year,
          role: form.role,
          topic: form.topic,
          stage: form.stage,
          description: form.description,
          support_needed: form.support_needed,
          document_url: documentUrl,
          status: "pending",
        },
      ])
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  };

  useEffect(() => window.scrollTo(0, 0), []);

  const uploadDocumentUsingID = async () => {
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

    const filePath = `${user.id}/research_${Date.now()}.pdf`;

    // upload
    const { error } = await supabase.storage
      .from("research_documents")
      .upload(filePath, form.document, { upsert: true });

    if (error) throw error;

    // get URL
    const { data } = supabase.storage
      .from("research_documents")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const validateForm = () => {
    if (!form.full_name) return "Full name is required";
    if (!form.phone) return "Phone number is required";
    if (!form.email) return "Email is required";
    if (!form.topic) return "Research topic is required";
    if (!form.stage) return "Research stage is required";
    if (!form.description) return "Description is required";
    if (!form.support_needed) return "Support needed is required";
    return null;
  };

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
      // 1️⃣ Upload document
      const documentUrl = await uploadDocumentUsingID();

      // 2️⃣ Insert DB data
      await submitFormDetails(documentUrl);

      toast.success("Enrollment submitted successfully 🎉");

      // 3️⃣ Reset form
      setForm({
        full_name: "",
        phone: "",
        email: "",
        country: "",
        state: "",
        city: "",
        college: "",
        grad_year: "",
        role: "",
        topic: "",
        stage: "",
        description: "",
        support_needed: "",
        document: null,
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
      {/* 🎨 Consistent Background Glow */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[140%] bg-[radial-gradient(circle_at_70%_30%,rgba(0,255,180,0.15)_0%,transparent_70%)] blur-3xl"></div>
      </div>

      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        {/* Left Content */}
        <div className="space-y-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium shadow-md border border-emerald-100 dark:border-emerald-900/50">
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Research Excellence</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0D1B2A] dark:text-white leading-tight">
            End-to-End <br />
            <span className="bg-gradient-to-r from-[#00A884] via-[#00C6B1] to-[#00D4FF] text-transparent bg-clip-text">
              Research Guidance
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Get complete support from topic selection to journal publication.
            Our expert mentors guide you through every step of your research
            journey.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Topic Selection & Review",
              "Methodology & Data",
              "Statistical Analysis",
              "Publication Support",
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_rgba(0,255,200,0.05)] border border-gray-100 dark:border-gray-700">
            <img
              src={bgImage}
              alt="Research Support"
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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Research Enrollment Form
            </h2>
            <p className="text-emerald-50 text-sm md:text-base">
              Provide your details to get matched with a specialized research
              mentor.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. PERSONAL DETAILS */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    value={form.email}
                    onChange={handleChange}
                    icon={Mail}
                    placeholder="email@example.com"
                    type="email"
                  />
                </div>
              </div>

              {/* 2. LOCATION & ACADEMIC */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Academic & Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Input
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    icon={Globe}
                    placeholder="India"
                    optional
                  />
                  <Input
                    label="State"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    icon={MapPin}
                    placeholder="State"
                    optional
                  />
                  <Input
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    icon={MapPin}
                    placeholder="City"
                    optional
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="College / University"
                    name="college"
                    value={form.college}
                    onChange={handleChange}
                    icon={Building2}
                    placeholder="University Name"
                    optional
                  />
                  <Input
                    label="Graduation Year"
                    name="grad_year"
                    value={form.grad_year}
                    onChange={handleChange}
                    icon={GraduationCap}
                    placeholder="2025"
                    optional
                  />
                </div>
              </div>

              {/* 3. CURRENT ROLE (Radio Group) */}
              <div className="bg-gray-50 dark:bg-[#0A0F2C] p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-4">
                  You are a: <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-4">
                  {["Student", "Research Scholar", "Working Professional"].map(
                    (r) => (
                      <label
                        key={r}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="radio"
                            name="role"
                            value={r}
                            checked={form.role === r}
                            onChange={handleChange}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 dark:border-gray-600 checked:border-emerald-500 checked:bg-emerald-500 transition-all"
                          />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {r}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* 4. RESEARCH SPECIFICS */}
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Research Details
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Research Topic"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    icon={BookOpen}
                    placeholder="e.g. AI in Healthcare"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                      label="Current Stage"
                      name="stage"
                      value={form.stage}
                      onChange={handleChange}
                      icon={Layers}
                      options={[
                        "Topic Selection",
                        "Literature Review",
                        "Methodology Design",
                        "Data Collection",
                        "Data Analysis",
                        "Manuscript Writing",
                        "Publication Assistance",
                      ]}
                    />

                    <Select
                      label="Support Needed"
                      name="support_needed"
                      value={form.support_needed}
                      onChange={handleChange}
                      icon={HelpCircle}
                      options={[
                        "Topic Selection Guidance",
                        "Literature Review Support",
                        "Survey / Questionnaire Preparation",
                        "Methodology Design",
                        "Statistical Analysis",
                        "Coding / ML Implementation",
                        "Report Writing",
                        "Proofreading",
                        "Journal Publication Assistance",
                      ]}
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <FileText className="w-4 h-4 text-emerald-500" /> Brief
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      rows="5"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Explain your research background and specific requirements..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0A0F2C] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* 5. FILE UPLOAD */}
              <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-[#0A0F2C] hover:bg-gray-100 dark:hover:bg-[#111a2e] transition-colors">
                <label className="cursor-pointer flex flex-col items-center justify-center gap-2 w-full h-full">
                  <UploadCloud className="w-10 h-10 text-emerald-500" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Upload Related Document{" "}
                    <span className="font-normal text-gray-500">
                      (Optional)
                    </span>
                  </span>
                  <span className="text-xs text-gray-500">
                    Synopsis, Draft, or Reference Papers
                  </span>
                  <input
                    type="file"
                    name="document"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {form.document && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 py-2 px-4 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" /> {form.document.name}
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Enrollment Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          Select Option...
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

export default ResearchSupport;
