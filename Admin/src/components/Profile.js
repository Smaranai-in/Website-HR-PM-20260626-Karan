import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaLinkedin, FaGithub, FaGlobe, FaPhoneAlt } from "react-icons/fa";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  GraduationCap,
  Loader2,
  Mail,
  FileText,
  User,
  FaCamera,
  ExternalLink,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useAuthModal } from "../context/AuthModalContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

function Profile() {
  const { user, setProfile, profile, loadingUser, loginbool } = useAuthModal();
  const [loading, setLoading] = useState(true);
  const [internData, setInternData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        if (!profile?.id) return;
        if (!profile?.id) return;
        const { data, error } = await supabase
          .from("w_internship_applications")
          .select("*")
          .eq("user_id", profile.id)
          .maybeSingle();

        setInternData(data || null);
      } catch (error) {
        console.error("Error fetching intern details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInternDetails();
  }, [profile]);



  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser, navigate]);

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
      const { error: dbError } = await supabase.from("w_users").update({ profile_url: imageUrl }).eq("id", user.id);
      if (dbError) throw dbError;
      setProfile({ ...profile, profile_url: imageUrl });
      toast.success("Profile image updated!");
    } catch (err) {
      toast.error("Image update failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ================= HEADER SECTION (Unchanged) ================= */}
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

        {/* ================= INTERNSHIP APPLICATION DETAILS ================= */}
        <div className="max-w-5xl mx-auto mt-10">
          {internData ? (
            <div className="bg-white dark:bg-[#112240] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-emerald-500" />
                  SmaranAI Internship Details
                </h2>
                <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                  Applied
                </span>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Academic Info */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap size={14} /> Education & Personal
                  </h3>
                  <Detail label="Full Name" value={internData.full_name} />
                  <Detail label="University" value={internData.university} />
                  <Detail label="Degree & Branch" value={`${internData.program_type} - ${internData.branch}`} />
                  <Detail label="Graduation Year" value={internData.graduation_year} />
                </div>

                {/* Role & Availability */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Role & Availability
                  </h3>
                  <Detail label="Priority Role" value={internData.top_priority_role} />
                  <Detail label="Availability" value={internData.availability} />
                  <Detail label="Ready to Join" value={internData.available_to_join} />
                  <Detail label="Working Hours" value={`${internData.start_time} - ${internData.end_time}`} />
                </div>

                {/* Contact & Professional Links */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={14} /> Contact & Links
                  </h3>
                  <Detail label="Phone" value={internData.phone_number} />
                  <div className="flex flex-wrap gap-3 pt-2">
                    {internData.linkedin_profile && (
                      <a href={internData.linkedin_profile} target="_blank" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-blue-600 hover:scale-110 transition-transform">
                        <FaLinkedin size={20} />
                      </a>
                    )}
                    {internData.github_url && (
                      <a href={internData.github_url} target="_blank" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-slate-800 dark:text-white hover:scale-110 transition-transform">
                        <FaGithub size={20} />
                      </a>
                    )}
                    {internData.portfolio_url && (
                      <a href={internData.portfolio_url} target="_blank" className="p-2 bg-slate-100 dark:bg-[#0a192f] rounded-lg text-emerald-600 hover:scale-110 transition-transform">
                        <FaGlobe size={20} />
                      </a>
                    )}
                  </div>
                  {internData.cv_url && (
                    <a
                      href={internData.cv_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-600/20"
                    >
                      <FileText size={16} /> View Resume
                    </a>
                  )}
                </div>
              </div>

              {/* Experience Description Footer */}
              {internData.work_experience_desc && (
                <div className="px-8 pb-8 pt-4">
                  <div className="bg-slate-50 dark:bg-[#0a192f] p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Work/Internship Description</p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                      "{internData.work_experience_desc}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#112240] p-12 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Internship Application
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                You are not applied for the internship in <span className="text-emerald-500 font-semibold">SmaranAI</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean detail rendering
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{label}</p>
      <p className="text-slate-700 dark:text-slate-200 font-medium">{value || "N/A"}</p>
    </div>
  );
}

export default Profile;