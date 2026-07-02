import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, Sparkles, Monitor, LogOut } from "lucide-react";
import { useAuthModal } from "../context/AuthModalContext";
import { toast } from "react-toastify";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setActivePage, profile, logout, loginbool } = useAuthModal();

  // 🌟 PAGES CONFIG
  const pages = [
    { name: "Home", type: "scroll", targetId: "home" },
    { name: "Services", type: "scroll", targetId: "services" },
    { name: "Courses", type: "page", path: "/courses" },
    { name: "About", type: "page", path: "/about" },
    { name: "My Page", type: "page", path: "/mypage", requiresAuth: true },
    { name: "Contact", type: "scroll", targetId: "contact" },
  ];

  // 🌗 Load theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 🌗 Toggle theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 🧭 Scroll or Navigate
  const scrollToSection = (id) => {
    const offset = 100;
    const performScroll = () => {
      if (id) {
        const section = document.getElementById(id);
        if (section) {
          const topPos =
            section.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: topPos, behavior: "smooth" });
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(performScroll, 500);
    } else {
      performScroll();
    }
    setMobileOpen(false); // Close mobile menu after click
  };

  // 🚪 Logout
  const handleLogout = async () => {
    try {

      await logout();
      toast.success("Logged out successfully!");
      navigate("/", { replace: true });
    } catch (error) {
    }
  };

  if (location.pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 1️⃣ LOGO AREA */}
            <button
              onClick={() => scrollToSection(null)}
              className="flex items-center gap-3 group shrink-0"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-emerald-400 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  SmaranAI.in
                </h2>
                <p className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold hidden sm:block">
                  Excellence in Education
                </p>
              </div>
            </button>

            {/* 2️⃣ DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {pages.map((page) => (
                <button
                  key={page.name}
                  onClick={() => {
                    if ((page.name === "Courses" || page.requiresAuth) && !profile) {
                      setActivePage("login");
                      return;
                    }
                    if (page.type === "page") navigate(page.path);
                    else scrollToSection(page.targetId);
                  }}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors relative group"
                >
                  {page.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </nav>

            {/* 3️⃣ RIGHT ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 transition-all"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Mobile Profile Icon (Visible only on Mobile when logged in) */}
              {loginbool && profile && (
                <button
                  onClick={() => navigate("/profile")}
                  className="lg:hidden w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden ml-1"
                >
                  {profile.profile_url ? (
                    <img
                      src={profile.profile_url}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 font-bold text-xs">
                      {profile?.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              )}

              {/* Desktop Profile / Login */}
              <div className="hidden lg:flex items-center gap-3 ml-2">
                {loginbool && profile ? (
                  <>
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-10 h-10 rounded-full border-2 border-emerald-500/30 p-0.5 hover:border-emerald-500 transition-colors"
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                        {profile.profile_url ? (
                          <img
                            src={profile.profile_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-600 font-bold">
                            {profile?.email?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActivePage("login")}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transform hover:-translate-y-0.5 transition-all text-sm"
                  >
                    Get Started
                  </button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ml-1"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* 📱 MOBILE MENU (Scrollable) */}
        <div
          className={`lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0B1120] border-t border-gray-100 dark:border-gray-800 shadow-xl transition-all duration-300 ease-in-out ${mobileOpen
            ? "max-h-[calc(100vh-80px)] opacity-100"
            : "max-h-0 opacity-0"
            } overflow-y-auto`}
        >
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Nav Links */}
            <div className="grid grid-cols-1 gap-2">
              {pages.map((page) => (
                <button
                  key={page.name}
                  onClick={() => {
                    if ((page.name === "Courses" || page.requiresAuth) && !profile) {
                      setActivePage("login");
                      setMobileOpen(false);
                      return;
                    }
                   if (page.type === "page") {
  setMobileOpen(false);
  navigate(page.path);
} else {
  scrollToSection(page.targetId);
}
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span className="font-medium">{page.name}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30"></div>
                </button>
              ))}
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {profile ? (
                <div className="space-y-3">
                  {/* Info Row (User details + Logout) */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          Logged in as
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActivePage("login");
                    setMobileOpen(false);
                  }}
                  className="w-full px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
