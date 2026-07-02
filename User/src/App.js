import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import CourseCards from "./components/CourseCards";
import CourseSyllabus from "./components/CourseSyllabus";
import CourseEnrollmentForm from "./components/CourseEnrollmentForm";
import { AuthModalProvider, useAuthModal } from "./context/AuthModalContext";
import { AssessmentProvider } from "./context/AssessmentContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import ApplyInternship from "./Pages/ApplyInternship";


import ResearchSupport from "./Pages/ResearchSupport";
import AcademicProjects from "./Pages/AcademicProjects";
import AboutPage from "./Pages/AboutPage";

import Profile from "./components/Profile";
import ForgotOtpVerify from "./components/ForgotOtpVerify";
import AiInterviewApp from "./Pages/AiInterview/AiInterviewApp";
import MyPage from "./Pages/MyPage";
import GlobalChat from "./components/GlobalChat";
import AssessmentOutlines from "./Pages/AssessmentOutlines";
import AssessmentConfirmation from "./Pages/AssessmentConfirmation";
import InternActivity from "./Pages/InternActivity";
import InternPortal from "./Pages/InternPortal";
import InternTasks from "./Pages/InternTasks";
import InternDailyReport from "./Pages/InternDailyReport";
import AuthApp from "./Dashboard/modules/authentication/App";
import ProtectedRoute from "./components/ProtectedRoute";

// 🛡️ Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
    <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Restoring your session...</p>
  </div>
);

function AppContent() {
  const { loadingUser } = useAuthModal();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // 🚀 CRITICAL: Do not render routes until auth is resolved
  if (loadingUser) return <LoadingScreen />;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<CourseCards />} />
        <Route path="/coursesyllabus" element={<CourseSyllabus />} />
        <Route path="/courceenrollment" element={<CourseEnrollmentForm />} />
        <Route path="/internapplication" element={<ApplyInternship />} />
        <Route path="/ResearchSupport" element={<ResearchSupport />} />
        <Route path="/AcademicProjects" element={<AcademicProjects />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/reset-password" element={<ForgotOtpVerify />} />
        <Route path="/ai-interview" element={<ProtectedRoute><AiInterviewApp /></ProtectedRoute>} />
        <Route path="/intern-activity" element={<Navigate to="/mypage?tab=overview" replace />} />
        <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/assessment/:internshipId" element={<ProtectedRoute><AssessmentOutlines /></ProtectedRoute>} />
        <Route path="/assessment-confirmation" element={<ProtectedRoute><AssessmentConfirmation /></ProtectedRoute>} />
        <Route path="/intern-portal" element={<ProtectedRoute><InternPortal /></ProtectedRoute>} />
        <Route path="/intern-tasks" element={<ProtectedRoute><InternTasks /></ProtectedRoute>} />
        <Route path="/intern-report" element={<ProtectedRoute><InternDailyReport /></ProtectedRoute>} />
        <Route path="/dashboard/*" element={<ProtectedRoute><AuthApp /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
      <GlobalChat />
    </>
  );
}

function App() {
  return (
    <Router basename="/user">
      <AuthModalProvider>
        <AssessmentProvider>
          <AppContent />
        </AssessmentProvider>
      </AuthModalProvider>
    </Router>
  );
}

export default App;
