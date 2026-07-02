import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";

const EnrollmentForm = ({ courseId }) => {

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    college: "",
    degree: "",
    year: "",
    major: "",
    experience: "",
    referral: "",
    goals: "",
  });

  const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    const required = [
      "fullName", "email", "phone", "city", "state", "country",
      "college", "degree", "year", "major", "experience", "goals",
    ];

    const missing = required.filter((f) => !formData[f]);

    if (missing.length > 0) {
      toast.error("Please fill all required fields!");
      return;
    }

    if (!user) {
      toast.error("Please login to enroll");
      return;
    }

    try {
      setLoading(true);

    const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error("Please login again");
}

const response = await fetch(
  `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      action: "create_course_enrollment",

      name: formData.fullName,
      email: formData.email,
      phno: formData.phone,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      college_university: formData.college,
      degree_program: formData.degree,
      year_of_study: formData.year,
      field_of_study: formData.major,
      prior_experience: formData.experience,
      how_did_you_hear_about_us: formData.referral,
      reason_for_taking_course: formData.goals,
      course_id: courseId,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

      toast.success("🎓 Enrolled Successfully!");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        country: "",
        college: "",
        degree: "",
        year: "",
        major: "",
        experience: "",
        referral: "",
        goals: "",
      });

    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error(err.message || "Failed to submit enrollment form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Personal Details Section */}
      <div>
        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name *" />
          <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email Address *" />
          <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number *" />
          <Input name="city" value={formData.city} onChange={handleChange} placeholder="City *" />
          <Input name="state" value={formData.state} onChange={handleChange} placeholder="State *" />
          <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country *" />
        </div>
      </div>

      {/* Academic Section */}
      <div>
        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Academic Background
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input name="college" value={formData.college} onChange={handleChange} placeholder="College/University *" />
          <Input name="degree" value={formData.degree} onChange={handleChange} placeholder="Degree Program *" />
          <Input name="year" value={formData.year} onChange={handleChange} placeholder="Year of Study *" />
          <Input name="major" value={formData.major} onChange={handleChange} placeholder="Major/Specialization *" />
        </div>
      </div>

      {/* Course Specifics */}
      <div>
        <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Additional Details
        </h3>
        <div className="grid grid-cols-1 gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input name="experience" value={formData.experience} onChange={handleChange} placeholder="Prior Experience *" />
            <Input name="referral" value={formData.referral} onChange={handleChange} placeholder="Referral Code (Optional)" />
          </div>
          <textarea
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="Why do you want to take this course? *"
            rows="3"
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0F2C] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Complete Enrollment"}
      </button>
    </form>
  );
};

/* Reusable Input Component for cleaner code */
const Input = ({ name, value, onChange, placeholder, type = "text" }) => (
  <input
    name={name}
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    className="w-full p-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A0F2C] text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
  />
);

export default EnrollmentForm;