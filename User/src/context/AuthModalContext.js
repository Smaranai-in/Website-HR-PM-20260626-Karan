import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [loginbool, setLoginbool] = useState(false);

  const [initialized, setInitialized] = useState(false);
  const profileFetchedForId = useRef(null);

  // ─── Fetch / create user profile from DB via edge function ─────────────────
  const ensureProfile = async (authUser) => {
    try {
      const googleName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        null;

      if (!authUser?.id) {
        return null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session");
      }

      // Try to get existing user
      const getResponse = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: "get_user" }),
        }
      );

      const getResult = await getResponse.json();

      if (getResponse.ok && getResult.user) {
        return getResult.user;
      }

      // User doesn't exist — create them
      const createResponse = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            action: "create_user",
            id: authUser.id,
            email: authUser.email,
            name: googleName || "User",
            role: "client",
            user_verify: true,
          }),
        }
      );

      const createResult = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createResult.error || "Failed to create user profile");
      }

      return {
        id: authUser.id,
        email: authUser.email,
        name: googleName || "User",
        role: "client",
        user_verify: true,
      };
    } catch (error) {
      console.error("[Auth] ensureProfile error:", error);
      return null;
    }
  };

  // ─── Core Session Handler ──────────────────────────────────────────
  const handleSession = async (session, isInitial = false) => {
    const authUser = session?.user || null;

    if (!authUser) {
      setUser(null);
      setProfile(null);
      setLoginbool(false);
      localStorage.removeItem("isAuthenticated");
      profileFetchedForId.current = null;
      setLoading(false);
      setInitialized(true);
      return;
    }

    // Restore user state immediately so UI can render
    setUser(authUser);
    setLoginbool(true);
    localStorage.setItem("isAuthenticated", "true");

    // Resolve loading state so routes can render
    setLoading(false);
    setInitialized(true);

    // If we already fetched for this user, skip re-fetch
    if (profileFetchedForId.current === authUser.id) {
      return;
    }

    profileFetchedForId.current = authUser.id;

    // Fetch/create real profile from DB in background
    try {
      const dbProfile = await ensureProfile(authUser);
      if (dbProfile) {
        setProfile(dbProfile);
      } else {
        // Fallback: set minimal profile so UI still works
        setProfile({
          id: authUser.id,
          email: authUser.email,
          name: authUser.user_metadata?.name || "User",
          role: "client",
        });
      }
    } catch (e) {
      console.error("[Auth] Background profile fetch error:", e);
      // Fallback
      setProfile({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || "User",
        role: "client",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("[Auth] getSession error:", error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (session) {
          if (mounted) await handleSession(session, true);
        } else {
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
        }
      } catch (err) {
        console.error("[Auth] Initialization crash:", err);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "INITIAL_SESSION") {
          if (session && mounted) await handleSession(session, true);
          return;
        }

        if (event === "SIGNED_IN") {
          if (mounted) await handleSession(session, false);
          return;
        }

        if (event === "SIGNED_OUT") {
          if (mounted) {
            setUser(null);
            setProfile(null);
            setLoginbool(false);
            localStorage.removeItem("isAuthenticated");
            profileFetchedForId.current = null;
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (event === "TOKEN_REFRESHED") {
          if (mounted) await handleSession(session, false);
          return;
        }

        if (event === "PASSWORD_RECOVERY") {
          if (mounted) {
            setRecoveryMode(true);
            setActivePage("resetpassword");
            if (session) await handleSession(session, false);
            setLoading(false);
            setInitialized(true);
          }
          return;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ─── EMAIL LOGIN ──────────────────────────────────────────────────────────
  const login = async (email, password) => {
    if (!email || !password) throw new Error("Email or password missing");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      toast.error("Please verify your email before logging in");
      throw new Error("Email not verified");
    }

    return data.user;
  };

  // ─── EMAIL SIGNUP ─────────────────────────────────────────────────────────
  const signup = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  // ─── GOOGLE LOGIN ─────────────────────────────────────────────────────────
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/user` },
    });
    if (error) throw error;
  };

  // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────
  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/user/reset-password`,
    });
    if (error) throw error;
  };

  // ─── RESET PASSWORD ───────────────────────────────────────────────────────
  const resetPassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    await supabase.auth.signOut();
    setRecoveryMode(false);
  };

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = async () => {
    setUser(null);
    setProfile(null);
    setLoginbool(false);
    localStorage.removeItem("isAuthenticated");
    profileFetchedForId.current = null;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthModalContext.Provider
      value={{
        user,
        profile,
        loading,
        loadingUser: loading,
        loginbool,
        recoveryMode,
        activePage,
        setActivePage,
        setProfile,
        isAuthenticated: !!user,

        login,
        signup,
        loginWithGoogle,
        logout,

        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => useContext(AuthModalContext);
