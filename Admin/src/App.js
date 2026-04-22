import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";


import { AuthModalProvider } from "./context/AuthModalContext";
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
import Profile from "./components/Profile";
import SupportChat from "./Admin/SupportChat";

// Project Management Pages
import DashboardPage from "./pages/ProjectManagement/Dashboard";
import NewProjectPage from "./pages/ProjectManagement/NewProjectPage";
import DevelopersListPage from "./pages/ProjectManagement/DevelopersList";
import DeveloperDetailsPage from "./pages/ProjectManagement/DeveloperDetails";
import ProjectDetailsPage from "./pages/ProjectManagement/ProjectDetails";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);



  useEffect(() => {
    // Detect system dark mode preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <Router>
      <AuthModalProvider>
        <Header />
        <Routes>


          <Route path="/insertCourse" element={<Insert_Course />} />

          <Route path="/" element={<AdminDashboard />} />
          <Route path="/internapplicationList" element={<ApplicantsList />} />
          <Route path="/admincourseenrollment" element={<AdminCourseEnrollments />} />


          <Route path="/ResearchSupportProjectList" element={<ResearchApplicantsList />} />
          <Route path="/AcademicProjectsList" element={<AcademicProjectsList />} />
          <Route path="/ai-interviews" element={<AIInterviewsList />} />
          <Route path="/Profile" element={<Profile />} />

          {/* Support Chat Route */}
          <Route path="/support-chat" element={<SupportChat />} />

          {/* Project Management Routes */}
          <Route path="/projects" element={<DashboardPage />} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/developers" element={<DevelopersListPage />} />
          <Route path="/projects/developers/:id" element={<DeveloperDetailsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route
            path="*"
            element={
              <div className="text-center mt-40 text-gray-600 text-xl">
                404 – Page Not Found
              </div>
            }
          />
        </Routes>

        {/* ✅ Toast container updates automatically with dark/light mode */}
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
          theme={isDarkMode ? "dark" : "light"} // 👈 auto theme switching
        />
      </AuthModalProvider>
    </Router>
  );
}

export default App;
