import React, { useEffect } from "react";
import { X, ArrowRight, Download, BookOpen, Clock, Layers } from "lucide-react";
import EnrollmentForm from "./CourseEnrollmentForm";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";

const CourseSyllabus = ({ open, onClose, course }) => {
  const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser, navigate]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0D1229] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slideUp relative flex flex-col max-h-[90vh]">
        
        {/* Sticky Header with Close Button */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-[#0D1229]/90 backdrop-blur-md p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white truncate pr-8">
            Course Details
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar">
          
          {/* Hero Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-transparent bg-clip-text drop-shadow-sm leading-tight">
              {course.title}
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Course Tags */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            <span className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium rounded-full text-sm flex items-center gap-2">
              <Layers size={16} /> Level: {course.course_level}
            </span>
            <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium rounded-full text-sm flex items-center gap-2">
              <BookOpen size={16} /> Domain: {course.course_domain}
            </span>
            <span className="px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-medium rounded-full text-sm flex items-center gap-2">
              <Clock size={16} /> Duration: {course.how_many_weeks} Weeks
            </span>
          </div>

          {/* What You Will Learn */}
          {course.course_array?.length > 0 && (
            <div className="mb-14">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                ✨ What You Will Learn
              </h2>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.course_array.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-gray-50 dark:bg-[#121b3a] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
                  >
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Syllabus */}
          <div className="mb-14">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              📚 Detailed Syllabus
            </h2>

            <div className="space-y-6">
              {course.course_week_array?.map((week, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-[#161f40] p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded text-xs uppercase tracking-wider">
                      Week {week.week}
                    </span>
                    {week.description}
                  </p>

                  <ul className="ml-2 space-y-2 border-l-2 border-emerald-100 dark:border-emerald-900/50 pl-4 mt-2">
                    {week.week_array.map((topic, j) => (
                      <li key={j} className="text-gray-600 dark:text-gray-400 text-sm">
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button 
              onClick={() => document.getElementById("enroll-form")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
            >
              Enroll Now <ArrowRight size={18} />
            </button>

            <button className="flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download size={18} /> Brochure
            </button>
          </div>

          {/* Enrollment Form Section */}
          <div id="enroll-form" className="bg-gray-50 dark:bg-[#12182e] p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-inner">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Start?
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Complete the form below to secure your spot.
              </p>
            </div>
            <EnrollmentForm courseId={course.id} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseSyllabus;

/* ------ Animations (Global Styles) ------ */
const styles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
.animate-slideUp { animation: slideUp 0.3s ease-out forwards; }

/* Custom Scrollbar for Modal Content */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);