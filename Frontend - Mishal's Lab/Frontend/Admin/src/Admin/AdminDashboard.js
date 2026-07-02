import React from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  FileText,
  ArrowRight,
  Briefcase,
  MonitorPlay,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // 🔐 Auth context (DO NOT TOUCH)
const {
  setActivePage,
  profile,
  logout,
  loginbool,
  activePage,
  loadingUser
} = useAuthModal();

  // ⏳ LOADING
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020c1b] text-slate-800 dark:text-slate-200">
        Loading...
      </div>
    );
  }

  // 🔒 NOT ADMIN / NOT LOGGED IN
  if (!profile || profile.role !== "admin") {
    return (
      <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 
        dark:from-[#020c1b] dark:via-[#020c1b] dark:to-[#051021]
        px-6 pt-40 pb-20 transition-colors duration-300">

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative max-w-md w-full bg-white dark:bg-[#112240]
            rounded-3xl p-10 text-center
            shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-none
            border border-emerald-100 dark:border-gray-800 overflow-hidden">

            {/* Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-300/40 dark:bg-emerald-500/10 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-300/40 dark:bg-cyan-500/10 blur-3xl rounded-full"></div>

            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl 
              bg-gradient-to-br from-emerald-500 to-teal-500
              flex items-center justify-center shadow-lg">
              <Users className="text-white" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Admin Access Required
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please log in with your admin credentials to continue.
            </p>

            <button
              onClick={() => setActivePage("login")}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500
              text-white px-6 py-3 rounded-xl font-medium
              hover:scale-[1.03] transition">
              Login to Continue
            </button>
          </div>
        </div>
      </section>
    );
  }

  // 📊 DASHBOARD CARDS
  const cards = [
    {
      title: "Internship Applicants",
      desc: "View and manage internship applications.",
      icon: <Users size={32} className="text-white" />,
      glow: "bg-emerald-300 dark:bg-emerald-900",
      gradient: "from-emerald-500 to-teal-500",
      navigate: "/internapplicationList",
    },
    {
      title: "Courses Enrolled",
      desc: "Review course enrollments.",
      icon: <BookOpen size={32} className="text-white" />,
      glow: "bg-blue-300 dark:bg-blue-900",
      gradient: "from-blue-500 to-indigo-500",
      navigate: "/admincourseenrollment",
    },
    {
  title: "Create Course",
  desc: "Add new courses to the platform.",
  icon: <BookOpen size={32} className="text-white" />,
  glow: "bg-green-300 dark:bg-green-900",
  gradient: "from-green-500 to-emerald-500",
  navigate: "/insertCourse",
},
    {
      title: "Research Applicants",
      desc: "Manage research applications.",
      icon: <FileText size={32} className="text-white" />,
      glow: "bg-purple-300 dark:bg-purple-900",
      gradient: "from-purple-500 to-fuchsia-500",
      navigate: "/ResearchSupportProjectList",
    },
    {
      title: "Academic Projects",
      desc: "View academic project submissions.",
      icon: <GraduationCap size={32} className="text-white" />,
      glow: "bg-orange-300 dark:bg-orange-900",
      gradient: "from-orange-500 to-rose-500",
      navigate: "/AcademicProjectsList",
    },
    {
      title: "Projects & Tasks",
      desc: "Manage projects and assign tasks.",
      icon: <Briefcase size={32} className="text-white" />,
      glow: "bg-indigo-300 dark:bg-indigo-900",
      gradient: "from-indigo-500 to-violet-500",
      navigate: "/projects",
    },
    {
      title: "AI-Interview",
      desc: "Review user AI interview results.",
      icon: <MonitorPlay size={32} className="text-white" />,
      glow: "bg-pink-300 dark:bg-pink-900",
      gradient: "from-pink-500 to-rose-500",
      navigate: "/ai-interviews",
    },
    {
      title: "User Management",
      desc: "Manage users and assign administrator privileges.",
      icon: <ShieldAlert size={32} className="text-white" />,
      glow: "bg-teal-300 dark:bg-teal-900",
      gradient: "from-teal-500 to-cyan-500",
      navigate: "/user-management",
    },
    {
      title: "Leave Management",
      desc: "View, approve, or reject intern leave applications.",
      icon: <Calendar size={32} className="text-white" />,
      glow: "bg-amber-300 dark:bg-amber-900",
      gradient: "from-amber-500 to-orange-500",
      navigate: "/admin-leaves",
    },
  ];

  const handleNavigate = (card) => {
    if (card.external) {
      window.open(card.external, "_blank");
    } else if (card.navigate) {
      navigate(card.navigate);
    }
  };

  // ✅ ADMIN DASHBOARD
  return (
    <section className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50
      dark:from-[#020c1b] dark:via-[#020c1b] dark:to-[#051021]
      px-6 pt-40 pb-20 transition-colors duration-300 font-sans
      text-slate-800 dark:text-slate-200">

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-16">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {cards.map((card, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-[#112240]
                rounded-3xl shadow-xl dark:shadow-none
                dark:border dark:border-gray-800 p-6 sm:p-10 overflow-hidden">

              <div
                className={`absolute -top-10 -right-10 w-40 h-40 blur-3xl opacity-30 dark:opacity-20 ${card.glow}`}
              />

              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient}
                  flex items-center justify-center shadow-lg`}>
                  {card.icon}
                </div>
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                  {card.title}
                </h2>
              </div>

              <p className="mb-8 text-gray-600 dark:text-gray-400">
                {card.desc}
              </p>

              <button
                onClick={() => handleNavigate(card)}
                className={`flex items-center gap-2 px-6 py-3
                bg-gradient-to-r ${card.gradient}
                text-white rounded-xl hover:scale-105 transition`}>
                <ArrowRight size={18} />
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
