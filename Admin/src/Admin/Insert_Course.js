import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  Trash2, Plus, Save, Layers, BookOpen, 
  Calendar, FileText, LayoutList, CheckCircle2 
} from "lucide-react";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";




function Insert_Course() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    course_name: "",
    course_domain: "",
    description: "",
    course_level: "Beginner",
    courseFee: "", // Already existed in your state, now connected to UI
    how_many_weeks: "",
    total_enrolled: "",
    course_array: [""],
    course_week_array: [
      {
        week: "",
        description: "",
        week_array: [""],
      },
    ],
  });

const navigate = useNavigate();
const { profile, loadingUser } = useAuthModal();

useEffect(() => {
  if (!loadingUser && (!profile || profile.role !== "admin")) {
    navigate("/");
  }
}, [profile, loadingUser, navigate]);

  // 🔹 Update input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => window.scrollTo(0, 0), []);

  // ================== FEATURES ==================
  const handleCourseArrayChange = (idx, value) => {
    const updated = [...formData.course_array];
    updated[idx] = value;
    setFormData({ ...formData, course_array: updated });
  };

  const addCourseArrayField = () => {
    setFormData({
      ...formData,
      course_array: [...formData.course_array, ""],
    });
  };

  const deleteCourseFeature = (idx) => {
    const updated = [...formData.course_array];
    updated.splice(idx, 1);
    setFormData({ ...formData, course_array: updated });
  };

  // ================== WEEK SECTION ==================
  const handleWeekChange = (index, field, value) => {
    const updated = [...formData.course_week_array];
    updated[index][field] = value;
    setFormData({ ...formData, course_week_array: updated });
  };

  const handleWeekArrayChange = (weekIndex, topicIndex, value) => {
    const updated = [...formData.course_week_array];
    updated[weekIndex].week_array[topicIndex] = value;
    setFormData({ ...formData, course_week_array: updated });
  };

  const addWeekTopic = (weekIndex) => {
    const updated = [...formData.course_week_array];
    updated[weekIndex].week_array.push("");
    setFormData({ ...formData, course_week_array: updated });
  };

  const deleteTopic = (weekIndex, topicIndex) => {
    const updated = [...formData.course_week_array];
    updated[weekIndex].week_array.splice(topicIndex, 1);
    setFormData({ ...formData, course_week_array: updated });
  };

  const addWeekSection = () => {
    setFormData({
      ...formData,
      course_week_array: [
        ...formData.course_week_array,
        { week: "", description: "", week_array: [""] },
      ],
    });
  };

  const deleteWeekSection = (weekIndex) => {
    const updated = [...formData.course_week_array];
    updated.splice(weekIndex, 1);
    setFormData({ ...formData, course_week_array: updated });
  };

  useEffect(() => {
  if (!loadingUser && profile?.role !== "admin") {
    navigate("/");
  }
}, [profile, loadingUser, navigate]);

  // ================== SUBMIT ==================
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

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
      action: "create_course",

      course_name: formData.course_name,
      course_domain: formData.course_domain,
      description: formData.description,
      course_level: formData.course_level,
      how_many_weeks: Number(formData.how_many_weeks) || 0,
      total_enrolled: Number(formData.total_enrolled) || 0,
      course_array: formData.course_array,
      course_week_array: formData.course_week_array,
      coursefee: Number(formData.courseFee) || 0,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error || "Failed to create course");
}


    toast.success("Course added successfully!");

    setFormData({
      course_name: "",
      course_domain: "",
      description: "",
      course_level: "Beginner",
      courseFee: "",
      how_many_weeks: "",
      total_enrolled: "",
      course_array: [""],
      course_week_array: [
        {
          week: "",
          description: "",
          week_array: [""],
        },
      ],
    });
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Something went wrong!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-12 px-4 md:px-8 transition-colors duration-300 font-sans">
      
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Layers className="w-8 h-8 text-emerald-500" />
              Create New Course
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Fill in the details below to add a new course to the catalog.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. BASIC INFO CARD */}
          <div className="bg-white dark:bg-[#0A0F2C] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              Course Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Course Name" name="course_name" value={formData.course_name} onChange={handleChange} placeholder="e.g. Advanced React Patterns" />
              <InputGroup label="Domain" name="course_domain" value={formData.course_domain} onChange={handleChange} placeholder="e.g. Web Development" />
              
              {/* Level and Duration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Course Level
                  </label>
                  <div className="flex gap-4 items-center bg-slate-50 dark:bg-[#112240] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3">
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <label key={level} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="course_level"
                          value={level}
                          checked={formData.course_level === level}
                          onChange={handleChange}
                          className="w-4 h-4 text-emerald-500 bg-slate-100 border-slate-300 focus:ring-emerald-500 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
                <InputGroup label="Duration (Weeks)" name="how_many_weeks" value={formData.how_many_weeks} onChange={handleChange} placeholder="8" />
              </div>
              
              {/* Fee and Enrolled Row - ADDED HERE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup 
                  label="Course Fee (₹)" 
                  name="courseFee" 
                  value={formData.courseFee} 
                  onChange={handleChange} 
                  placeholder="e.g. 4999" 
                  type="number"
                />
                <InputGroup 
                  label="Total Enrolled" 
                  name="total_enrolled" 
                  value={formData.total_enrolled} 
                  onChange={handleChange} 
                  placeholder="0" 
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="4" 
                  placeholder="Detailed course description..." 
                  className="w-full bg-slate-50 dark:bg-[#112240] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. FEATURES CARD */}
          <div className="bg-white dark:bg-[#0A0F2C] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Key Features
              </h2>
              <button 
                type="button" 
                onClick={addCourseArrayField}
                className="text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {formData.course_array.map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <input
                    value={item}
                    onChange={(e) => handleCourseArrayChange(i, e.target.value)}
                    placeholder={`Feature highlight ${i + 1}`}
                    className="flex-1 min-w-0 bg-slate-50 dark:bg-[#112240] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => deleteCourseFeature(i)} 
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. CURRICULUM (WEEKS) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <LayoutList className="w-6 h-6 text-emerald-500" />
                Curriculum Structure
              </h2>
              <button 
                type="button" 
                onClick={addWeekSection} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Week
              </button>
            </div>

            {formData.course_week_array.map((week, wIndex) => (
              <div key={wIndex} className="bg-white dark:bg-[#0A0F2C] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Week Header */}
                <div className="bg-slate-50 dark:bg-[#112240] p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-white dark:bg-[#0A0F2C] border border-slate-200 dark:border-slate-600 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-emerald-500" />
                    </div>
                    <input 
                      value={week.week} 
                      onChange={(e) => handleWeekChange(wIndex, "week", e.target.value)} 
                      placeholder="e.g. Week 1 - Introduction" 
                      className="bg-transparent border-none text-lg font-semibold text-slate-800 dark:text-white placeholder-slate-400 focus:ring-0 p-0 w-full"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => deleteWeekSection(wIndex)} 
                    className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Week Body */}
                <div className="p-6">
                  <div className="mb-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
                    <input 
                      value={week.description} 
                      onChange={(e) => handleWeekChange(wIndex, "description", e.target.value)} 
                      placeholder="Brief summary of this week's content" 
                      className="w-full bg-slate-50 dark:bg-[#112240] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0d1b33] rounded-xl p-4 border border-slate-100 dark:border-slate-800/50">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Topics
                      </h4>
                      <button 
                        type="button" 
                        onClick={() => addWeekTopic(wIndex)} 
                        className="text-xs bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        + Add Topic
                      </button>
                    </div>

                    <div className="space-y-2">
                      {week.week_array.map((topic, tIndex) => (
                        <div key={tIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                          <input
                            value={topic}
                            onChange={(e) => handleWeekArrayChange(wIndex, tIndex, e.target.value)}
                            placeholder="Topic title"
                            className="flex-1 min-w-0 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 focus:outline-none py-1 text-slate-700 dark:text-slate-300 text-sm transition-colors"
                          />
                          <button 
                            type="button" 
                            onClick={() => deleteTopic(wIndex, tIndex)} 
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 pb-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/25 transform active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Course...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Publish Course
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Reusable Input Component
const InputGroup = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 dark:bg-[#112240] border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-slate-400"
    />
  </div>
);

export default Insert_Course;