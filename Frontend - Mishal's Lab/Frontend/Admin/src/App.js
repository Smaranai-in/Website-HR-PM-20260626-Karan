import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";


import { AuthModalProvider, useAuthModal } from "./context/AuthModalContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Insert_Course from "./Admin/Insert_Course";

import AdminDashboard from "./Admin/AdminDashboard";
import ApplicantsList from "./Admin/ApplicantsList";
import AdminCourseEnrollments from "./Admin/AdminCourseEnrollments";

import ResearchApplicantsList from "./Admin/ResearchApplicantsList";
import AcademicProjectsList from "./Admin/AcademicProjectsList";
import AIInterviewsList from "./Admin/AIInterviewsList";
import LeaveManagement from "./Admin/LeaveManagement";
import Profile from "./components/Profile";
import SupportChat from "./Admin/SupportChat";

// Project Management Pages
import DashboardPage from "./pages/ProjectManagement/Dashboard";
import NewProjectPage from "./pages/ProjectManagement/NewProjectPage";
import DevelopersListPage from "./pages/ProjectManagement/DevelopersList";
import DeveloperDetailsPage from "./pages/ProjectManagement/DeveloperDetails";
import ProjectDetailsPage from "./pages/ProjectManagement/ProjectDetails";
import UserActivityPage from "./Admin/UserActivity";
import InternDetail from "./Admin/InternDetail";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import SignUpOtp from "./components/SignUpOtp";
import ForgotEmail from "./components/ForgotEmail";
import ForgotOtpVerify from "./components/ForgotOtpVerify";
import UserManagement from "./Admin/UserManagement";

function AppContent() {
  const { loadingUser, activePage, setActivePage } = useAuthModal();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const handleClose = () => setActivePage(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const pageactivity = () => {
    switch (activePage) {
      case "login":
        return (
          <Login
            onClose={handleClose}
            onSignup={() => setActivePage("signup")}
            onForgot={() => setActivePage("forgot")}
          />
        );
      case "signup":
        return (
          <SignUp
            email={signupEmail}
            setemail={setSignupEmail}
            onClose={handleClose}
            onSubmit={() => setActivePage("signupotp")}
            onLogin={() => setActivePage("login")}
          />
        );
      case "signupotp":
        return (
          <SignUpOtp
            email={signupEmail}
            onClose={handleClose}
            onSubmit={() => setActivePage("login")}
          />
        );
      case "forgot":
        return (
          <ForgotEmail
            email={forgotEmail}
            setemail={setForgotEmail}
            onClose={handleClose}
            onSubmit={() => setActivePage("forgotverify")}
          />
        );
      case "forgotverify":
        return (
          <ForgotOtpVerify
            email={forgotEmail}
            onClose={handleClose}
            onSubmit={() => setActivePage("login")}
          />
        );
      default:
        return null;
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Restoring Admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      {activePage && (
        <div className="fixed top-[40px] right-[30px] z-[9999]">
          {pageactivity()}
        </div>
      )}
      <Routes>
        <Route path="/insertCourse" element={<ProtectedRoute><Insert_Course /></ProtectedRoute>} />
        <Route
  path="/"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/internapplicationList" element={<ProtectedRoute><ApplicantsList /></ProtectedRoute>} />
        <Route path="/admincourseenrollment" element={<ProtectedRoute><AdminCourseEnrollments /></ProtectedRoute>} />
        <Route path="/ResearchSupportProjectList" element={<ProtectedRoute><ResearchApplicantsList /></ProtectedRoute>} />
        <Route path="/AcademicProjectsList" element={<ProtectedRoute><AcademicProjectsList /></ProtectedRoute>} />
        <Route path="/ai-interviews" element={<ProtectedRoute><AIInterviewsList /></ProtectedRoute>} />
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/support-chat" element={<ProtectedRoute><SupportChat /></ProtectedRoute>} />
        <Route path="/reset-password" element={<ForgotOtpVerify />} />
        <Route path="/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/admin-leaves" element={<ProtectedRoute><LeaveManagement /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/projects/new" element={<ProtectedRoute><NewProjectPage /></ProtectedRoute>} />
        <Route path="/projects/developers" element={<ProtectedRoute><DevelopersListPage /></ProtectedRoute>} />
        <Route path="/projects/developers/:id" element={<ProtectedRoute><DeveloperDetailsPage /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>} />
        <Route path="/user-activity" element={<ProtectedRoute><UserActivityPage /></ProtectedRoute>} />
        <Route path="/intern-detail/:id" element={<ProtectedRoute><InternDetail /></ProtectedRoute>} />
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                  Access Denied
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  This area is restricted to administrators only. Your account does not have admin privileges.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  If you believe this is an error, contact your system administrator.
                </p>
              </div>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="text-7xl mb-6">🔍</div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
                  404
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">Page Not Found</p>
                <p className="text-gray-400 dark:text-gray-500 mb-8 text-sm">
                  The page you are looking for doesn't exist or has been moved.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  ← Back to Dashboard
                </a>
              </div>
            </div>
          }
        />
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthModalProvider>
        <AppContent />
      </AuthModalProvider>
    </Router>
  );
}

export default App;
