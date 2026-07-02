import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Loader2, Mail, User } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Profile() {
  const { user, setProfile, profile, loadingUser } = useAuthModal();
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser, navigate]);

  const callEdge = async (action, payload) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Please login again");
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }
    try {
      setUploading(true);
      const ext = file.name.split(".").pop();
      const filePath = `${profile.id}/avatars_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const imageUrl = urlData?.publicUrl;

      await callEdge("update_profile_image", { profile_url: imageUrl });
      setProfile({ ...profile, profile_url: imageUrl });
      toast.success("Profile image updated!");
    } catch (err) {
      toast.error("Image update failed");
    } finally {
      setUploading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ================= HEADER SECTION ================= */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-800 h-48 sm:h-52 mb-32 shadow-xl">
          <div className="absolute -bottom-24 left-6 sm:left-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 w-full sm:w-auto">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1.5 bg-white dark:bg-[#020c1b] shadow-2xl">
                {profile?.profile_url ? (
                  <img src={profile.profile_url} alt="Profile" className="w-full h-full rounded-full object-cover bg-slate-200" />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-emerald-500 text-white text-5xl font-bold">
                    {profile?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-2.5 bg-violet-600 text-white rounded-full cursor-pointer hover:bg-violet-700 shadow-lg border-2 border-white dark:border-[#020c1b]">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
            <div className="mb-1 text-center sm:text-left pb-2">

              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-600 dark:text-slate-300 font-medium mt-1">
                <Mail size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span>{profile?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;