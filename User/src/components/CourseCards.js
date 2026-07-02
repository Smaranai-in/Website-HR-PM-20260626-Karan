import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Clock,
  Target,
  Users,
  CheckCircle,
  BookOpen,
  Award,
  TrendingUp,
  ArrowLeft,
  Tag, // Imported Tag icon for the price
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import CourseSyllabusModal from "./CourseSyllabus";
import { supabase } from "../supabaseClient";

const CourseCards = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const { user, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  const gradients = [
    "from-blue-500 to-cyan-400",
    "from-green-500 to-emerald-400",
    "from-pink-500 to-rose-400",
    "from-orange-500 to-amber-400",
    "from-indigo-500 to-violet-400",
  ];

  const emojis = ["🧠", "💻", "🤖", "📊", "🔗", "🗄️"];

  useEffect(() => window.scrollTo(0, 0), []);

  useEffect(() => {
    const handleGetCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("w_courses")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error(error);
        }


        const fetched = data || [];

        const formatted = fetched.map((c, i) => ({
          ...c,
          title: c.course_name,
          icon: emojis[i % emojis.length],
          gradient: gradients[i % gradients.length],
          rating: "4.8",
          detailsTop: [
            {
              icon: <Target className="w-4 h-4 text-sky-500" />,
              text: c.course_level,
            },
            {
              icon: <Clock className="w-4 h-4 text-emerald-500" />,
              text: `${c.how_many_weeks} Weeks`,
            },
            {
              icon: <Users className="w-4 h-4 text-purple-500" />,
              text: `${c.total_enrolled}+ enrolled`,
            },
          ],
          detailsBottom: Array.isArray(c.course_array)
            ? c.course_array
            : (() => {
                if (typeof c.course_array === "string") {
                  try {
                    return JSON.parse(c.course_array);
                  } catch (e) {
                    return [c.course_array];
                  }
                }
                return [];
              })(),
        }));

        setCourses(formatted);
      } catch (err) {
        console.log("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };

    handleGetCourses();
  }, []);

useEffect(() => {
  if (!loadingUser && !user) {
    navigate("/");
  }
}, [user, loadingUser, navigate]);

  return (
    <div className="pt-16 md:pt-20 bg-white dark:bg-[#0A0F2C] min-h-screen transition-colors duration-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden flex flex-col justify-center items-center bg-gradient-to-b from-green-50 to-green-100 dark:from-[#0A0F2C] dark:via-[#0B1739] dark:to-[#0D102B] py-16 md:py-24 px-4 md:px-6">
        {/* Animated Background Blobs */}
        <div className="absolute top-10 left-4 md:left-16 w-48 h-48 md:w-72 md:h-72 bg-teal-200 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none" />
        <div className="absolute bottom-10 right-4 md:right-16 w-64 h-64 md:w-96 md:h-96 bg-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none" />

        {/* Back Link */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 text-teal-600 dark:text-teal-400 text-sm flex items-center gap-2 z-10">
          <ArrowLeft size={16} />
          <Link to="/" className="hover:underline">
            Back to Home
          </Link>
        </div>

        {/* Logo/Brand */}
        <div className="absolute top-4 right-4 md:top-6 md:right-8 flex items-center gap-3 z-10">
          <div className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
            <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-emerald-700 dark:text-emerald-400 font-semibold text-lg leading-tight">
              SmaranAI
            </h2>
            <p className="text-emerald-600 dark:text-emerald-500 text-xs opacity-80">
              Excellence in Education
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs md:text-sm font-medium">
          ⚡ AI-Powered Micro Courses
        </div>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent text-center leading-tight">
          Master AI & Data Science
        </h1>

        <p className="text-slate-600 dark:text-gray-300 mt-4 text-base md:text-lg text-center max-w-2xl px-2">
          Bite-sized, practical courses designed for busy learners. Learn
          cutting-edge technologies with structured content and real-world
          projects.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full max-w-4xl px-4">
          {[
            {
              icon: (
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ),
              title: "6+",
              sub: "Expert Courses",
            },
            {
              icon: (
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ),
              title: "2500+",
              sub: "Active Learners",
            },
            {
              icon: (
                <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              ),
              title: "95%",
              sub: "Completion Rate",
            },
          ].map((it, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-[#0E1835]/70 p-6 rounded-2xl shadow-md flex flex-col items-center backdrop-blur-sm border border-transparent dark:border-gray-800"
            >
              <div className="mb-2 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-full">
                {it.icon}
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {it.title}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                {it.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES LIST SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="flex flex-col gap-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            courses.map((course, idx) => (
              <div
                key={course.id}
                className="bg-white dark:bg-[#0E1835] border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Top Colored Bar */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${course.gradient}`}
                />

                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* ICON (Left Side) */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-4xl md:text-5xl bg-gradient-to-br ${course.gradient} shadow-lg`}
                      >
                        {course.icon}
                      </div>
                    </div>

                    {/* CONTENT (Right Side) */}
                    <div className="flex-1">
                      {/* Title & Badge Row */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
                            {course.title}
                          </h3>
                          <div className="flex justify-center md:justify-start mt-2">
                            <span
                              className={`px-3 py-1 text-white text-xs font-semibold rounded-full bg-gradient-to-r ${course.gradient}`}
                            >
                              {course.course_domain}
                            </span>
                          </div>
                        </div>

                        {/* Rating & Actions */}
                        <div className="flex items-center gap-4 self-center md:self-auto">
                          <span className="text-yellow-500 text-lg font-medium flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg">
                            ⭐ {course.rating}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mt-4 text-center md:text-left leading-relaxed">
                        {course.description}
                      </p>

                      {/* Info Pills */}
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                        {course.detailsTop.map((d, j) => (
                          <div
                            key={j}
                            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {d.icon}{" "}
                            <span className="font-medium">{d.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mt-6 text-sm">
                        {course.detailsBottom.map((f, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="truncate font-medium text-gray-700 dark:text-gray-300">{f}</span>
                          </div>
                        ))}
                      </div>

                      {/* BUTTON AND FEE SECTION (UPDATED) */}
                      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                        {/* View Syllabus Button (Left) */}
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold text-sm flex items-center gap-2 group transition-colors"
                        >
                          <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          View Complete Syllabus
                        </button>

                        {/* Course Fee (Right) */}
                        <div className="flex items-center gap-2">
                          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-1.5 rounded-lg">
                            <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="text-xl font-bold text-gray-800 dark:text-white">
                            {!course.coursefee || course.coursefee === 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                Free
                              </span>
                            ) : (
                              <span>₹{course.coursefee}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <CourseSyllabusModal
          open={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
          course={selectedCourse}
        />

        {/* AI Recommendation Banner */}
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-[#112240] dark:via-[#0e2a47] dark:to-[#0A0F2C] rounded-3xl shadow-inner border border-emerald-100 dark:border-emerald-900/30 p-8 md:p-12 mt-16 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/30">
              <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Not Sure Where to Start?
            </h2>
            <p className="max-w-2xl text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              Let our AI engine guide you to the perfect course based on your
              skills and goals.
            </p>
            <button
            onClick={() => toast.info("AI Recommendation coming soon")}
             className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-emerald-500/30 hover:scale-105 transition-all font-semibold">
              Get AI Recommendations
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseCards;
