import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect user to their correct home
    if (userRole === "hr") return <Navigate to="/dashboard/hr" replace />;
    if (userRole === "supervisor") return <Navigate to="/dashboard/supervisor" replace />;
    if (userRole === "program-manager") return <Navigate to="/dashboard/program-manager" replace />;
    if (userRole === "ai-interview") return <Navigate to="/dashboard/ai-interview" replace />;
    if (userRole === "certificates") return <Navigate to="/dashboard/certificates" replace />;

    return <Navigate to="/dashboard/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;