import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Central logout helper used across the app
export function logout() {
  try {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
  } catch (e) {
    // ignore storage errors
  }
  // redirect to login page
  if (typeof window !== "undefined") {
    window.location.href = "/user/dashboard/login";
  }
}
