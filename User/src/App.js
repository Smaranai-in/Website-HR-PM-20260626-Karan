import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import CourseCards from "./components/CourseCards";
import CourseSyllabus from "./components/CourseSyllabus";
import CourseEnrollmentForm from "./components/CourseEnrollmentForm";
import { AuthModalProvider } from "./context/AuthModalContext";
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
    <Router basename="/user">
      <AuthModalProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CourseCards />} />
          <Route path="/coursesyllabus" element={<CourseSyllabus />} />
          <Route path="/courceenrollment" element={<CourseEnrollmentForm />} />

          <Route path="/internapplication" element={<ApplyInternship />} />

          <Route path="/ResearchSupport" element={<ResearchSupport />} />
          <Route path="/AcademicProjects" element={<AcademicProjects />} />
          <Route path="/About" element={<AboutPage />} />

          <Route path="/Profile" element={<Profile />} />
          <Route path="/reset-password" element={<ForgotOtpVerify />} />
          <Route path="/ai-interview" element={<AiInterviewApp />} />
          <Route path="/mypage" element={<MyPage />} />

          <Route
            path="*"
            element={
              <div className="text-center mt-40 text-gray-600 text-xl">
                404 – Page Not Foundknlk
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
        <GlobalChat />
      </AuthModalProvider>
    </Router>
  );
}

export default App;
