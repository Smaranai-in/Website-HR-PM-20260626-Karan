import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import { toast } from 'react-toastify';

/**
 * 🛡️ ProtectedRoute Component
 * Ensures that only authenticated users can access the route.
 * Waits for authentication to initialize before making a decision.
 * Preserves the attempted URL so we can redirect back after login.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loadingUser, setActivePage } = useAuthModal();
  const location = useLocation();

  // ⌛ While auth is resolving, show nothing (App.js splash handles it)
  if (loadingUser) {
    return null;
  }

  // 🚪 If no user is found after loading, redirect to home and open login
  if (!user) {
    // Show a toast so the user understands why they were redirected
    toast.info("Please log in to access that page.", {
      toastId: "auth-redirect", // prevent duplicate toasts
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
