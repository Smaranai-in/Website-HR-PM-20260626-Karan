import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [activePage, setActivePage] = useState("");
  const [loginbool, setLoginbool] = useState(true);

  // 🔹 Ensure profile exists
  const ensureProfile = async (authUser) => {
    const googleName =
      authUser.user_metadata?.full_name || authUser.user_metadata?.name || null;


    const { data: existingUser } = await supabase
      .from("w_users")
      .select("id")
      .eq("id", authUser.id)
      .maybeSingle();

    // Create profile
    if (!existingUser) {
      await supabase.from("w_users").insert({
        id: authUser.id,
        email: authUser.email,
        name: googleName || "User",
        role: "client",
        user_verify: true,
      });
      return;
    }

    // Update name if missing or default
    if (googleName && (!existingUser.name || existingUser.name === "User")) {
      await supabase
        .from("w_users")
        .update({ name: googleName })
        .eq("id", authUser.id);
    }
  };


  useEffect(() => {
    const logincheck = async () => {
      try {
        const logindetails = localStorage.getItem("Login");

        if (logindetails == "True") {
          setLoginbool(false);
        }
      } catch (error) {
        console.error("Error fetching :", error);
      }
    };
    logincheck();
  }, []);

  // 🔁 INITIAL AUTH + REFRESH DEBUG
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      const { data: sessionData, error } = await supabase.auth.getSession();

      if (!sessionData?.session?.user) {
        console.warn("❌ No session on refresh");
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const authUser = sessionData.session.user;

      if (!authUser.email_confirmed_at) {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(authUser);
      await ensureProfile(authUser);

      const { data: profileData, error: profileError } = await supabase
        .from("w_users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      setProfile(profileData || null);
      setLoading(false);
    };

    initAuth();

    // 🔄 AUTH STATE LISTENER
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryMode(true);
        setActivePage("resetpassword");
        return;
      }

      if (!session?.user) {
        setUser(null);
        setProfile(null);
        setRecoveryMode(false);
        return;
      }

      if (event === "SIGNED_IN") {
        const authUser = session.user;
        setUser(authUser);

        supabase
          .from("w_users")
          .select("*")
          .eq("id", authUser.id)
          .single()
          .then(({ data, error }) => {
            setProfile(data || null);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔐 EMAIL LOGIN
  const login = async (email, password) => {


    if (!email || !password) {
      throw new Error("Email or password missing");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error);
      throw error;
    }

    if (!data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      toast.error("Please verify your email before logging in");
      throw new Error("Email not verified");
    }

    return data.user;
  };

  // 📝 EMAIL SIGNUP
  const signup = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  // 🔵 GOOGLE LOGIN
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (error) throw error;
  };

  // 📧 FORGOT PASSWORD
  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) throw error;
  };

  // 🔑 RESET PASSWORD
  const resetPassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    await supabase.auth.signOut();
    setRecoveryMode(false);
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRecoveryMode(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        user,
        profile,
        loading,
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
