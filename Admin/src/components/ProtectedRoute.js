import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";

const ProtectedRoute = ({ children }) => {
  const { user, loadingUser, isAdmin } = useAuthModal();

  // 1. Still loading — show spinner, prevent any content flash
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  // 2. Not authenticated — redirect to show login
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Admin Login Required
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Please log in with an admin account to access this page.
          </p>
        </div>
      </div>
    );
  }

  // 3. Authenticated but NOT admin — redirect to unauthorized
  if (isAdmin === false) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. isAdmin still null (shouldn't happen if loading resolved, but safety net)
  if (isAdmin !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">
            Verifying permissions...
          </p>
        </div>
      </div>
    );
  }

  // 5. ✅ Verified admin — render protected content
  return children;
};

export default ProtectedRoute;