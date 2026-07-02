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

  const callEdge = async (action, payload = {}) => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error("No active session token");
    }

    const response = await fetch(
      `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action, ...payload }),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result?.error) {
      throw new Error(result?.error || "Edge request failed");
    }

    return result;
  };

  // 🔹 Ensure profile exists
  const ensureProfile = async (authUser) => {
    const googleName =
      authUser.user_metadata?.full_name || authUser.user_metadata?.name || null;

    try {
      const result = await callEdge("get_user");
      const existingUser = result.user;

      // Create profile
      if (!existingUser) {
        await callEdge("create_user", {
          name: googleName || "User",
        });
        return;
      }

      // Update name if missing or default
      if (googleName && (!existingUser.name || existingUser.name === "User")) {
        await callEdge("update_user", {
          name: googleName,
        });
      }
    } catch (err) {
      console.error("Error in ensureProfile:", err);
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

      let profileData = null;
      try {
        const result = await callEdge("get_user");
        profileData = result.user;
      } catch (err) {
        console.error("Error getting profile:", err);
      }



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

        callEdge("get_user")
          .then((result) => {
            setProfile(result.user || null);
          })
          .catch((err) => {
            console.error("Error fetching user profile:", err);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔐 EMAIL LOGIN
  const login = async (email, password) => {


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

  const isAdmin = loading ? null : (profile?.role === "admin");

  return (
    <AuthModalContext.Provider
      value={{
        user,
        profile,
        isAdmin,
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
