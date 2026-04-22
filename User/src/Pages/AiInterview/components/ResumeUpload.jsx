import React, { useState, useEffect } from 'react';
import { Upload, FileText, Briefcase, ChevronRight, Sparkles, FileCheck, Settings, Sparkle } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export default function ResumeUpload({ userId, userName, userEmail, onNext, onLogout }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [skillRating, setSkillRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const [isHoveringFile, setIsHoveringFile] = useState(false);
  const [existingResumeUrl, setExistingResumeUrl] = useState(null);
  const [useExisting, setUseExisting] = useState(false);
  const [fetchingResume, setFetchingResume] = useState(true);

  // Fetch previous resume if user already provided one
  useEffect(() => {
    const fetchExistingResume = async () => {
      try {
        setFetchingResume(true);
        // First check internship applications
        const { data: internshipData } = await supabase
          .from('internship_applications')
          .select('cv_url')
          .eq('user_id', userId)
          .maybeSingle();

        if (internshipData?.cv_url) {
          setExistingResumeUrl(internshipData.cv_url);
          setUseExisting(true);
          return;
        }

        // If not found, check previous interviews
        const { data: interviewData } = await supabase
          .from('interviews')
          .select('resume_url')
          .eq('user_id', userId)
          .not('resume_url', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (interviewData?.resume_url) {
          setExistingResumeUrl(interviewData.resume_url);
          setUseExisting(true);
        }
      } catch (error) {
        console.error('Error fetching existing resume:', error);
      } finally {
        setFetchingResume(false);
      }
    };

    if (userId) {
      fetchExistingResume();
    }
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError('');
    } else {
      setError('Please upload a PDF file');
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      let resumeUrl = null;
      if (useExisting && existingResumeUrl) {
        resumeUrl = existingResumeUrl;
      } else if (resumeFile) {
        setUploadProgress('Uploading resume (optional)...');

        const fileName = `${userId}-${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('Interview_Resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('Interview_Resumes')
          .getPublicUrl(fileName);

        resumeUrl = urlData.publicUrl;
      }

      setUploadProgress('Creating interview session...');

      const { data: interview, error: dbError } = await supabase
        .from('interviews')
        .insert({
          user_id: userId,
          resume_text: null,
          resume_url: resumeUrl,
          job_role: jobRole,
          skill_rating: skillRating,
          status: 'in_progress',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      onNext({
        interviewId: interview.id,
        resumeText: null,
        jobRole,
        skillRating,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] relative overflow-hidden font-sans transition-colors duration-300 text-slate-900 dark:text-white pb-20 pt-10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-10" />

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-500/30 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-500/20 rounded-full animate-float animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-indigo-500/30 rounded-full animate-float animation-delay-4000" />
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-500/20 rounded-full animate-float animation-delay-1000" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6 text-emerald-700 dark:text-emerald-400">
              <Sparkle className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Interview Preparation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
              Prepare Your Interview
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Upload your resume and tell us about the role you're targeting. We'll generate personalized questions just for you.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden animate-fade-in-up animation-delay-200">

            {/* Progress Steps */}
            <div className="px-8 pt-8 pb-4">
              <div className="flex items-center justify-between">
                {[
                  { icon: FileCheck, label: 'Resume', active: !!resumeFile || !!useExisting },
                  { icon: Briefcase, label: 'Role', active: !!jobRole },
                  { icon: Settings, label: 'Skills', active: skillRating > 0 },
                ].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`relative group`}>
                      <div className={`absolute inset-0 rounded-xl blur-lg transition-all duration-300 ${step.active ? 'bg-emerald-500/30 dark:bg-emerald-500/50' : 'bg-slate-200 dark:bg-slate-500/20'
                        }`} />
                      <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${step.active
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'
                        }`}>
                        <step.icon className={`w-5 h-5 transition-colors duration-300 ${step.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                          }`} />
                      </div>
                    </div>
                    <span className={`ml-3 font-medium text-sm hidden sm:block transition-colors duration-300 ${step.active ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                      }`}>
                      {step.label}
                    </span>
                    {index < 2 && (
                      <div className={`w-16 lg:w-24 h-0.5 mx-4 transition-all duration-500 ${step.active && (index === 0 ? (resumeFile || useExisting) : index === 1 ? jobRole : true)
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : 'bg-slate-200 dark:bg-white/10'
                        }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Resume Upload */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Resume <span className="text-slate-500 font-normal">(PDF format)</span>
                </label>

                {fetchingResume ? (
                  <div className="flex justify-center items-center py-6 text-emerald-500">
                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="ml-3 text-sm font-medium">Checking for existing resume...</span>
                  </div>
                ) : existingResumeUrl && useExisting ? (
                  <div className="relative border-2 border-emerald-300 dark:border-emerald-500/30 rounded-2xl p-6 text-center bg-emerald-50/50 dark:bg-emerald-500/10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-500/30">
                        <FileCheck className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-800 dark:text-white">Existing Resume Selected</p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mt-1">
                          We found a resume from your profile/previous applications.
                        </p>
                      </div>
                      <div className="flex gap-4 mt-2">
                        <a
                          href={existingResumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/60 transition-colors"
                        >
                          View Resume
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setUseExisting(false);
                            setResumeFile(null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 dark:text-slate-300 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                        >
                          Upload New Resume
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative group cursor-pointer transition-all duration-500 ${isHoveringFile ? 'scale-[1.02]' : ''
                      }`}
                    onMouseEnter={() => setIsHoveringFile(true)}
                    onMouseLeave={() => setIsHoveringFile(false)}
                  >
                    <div className={`absolute -inset-0.5 rounded-2xl opacity-0 transition-all duration-300 ${isHoveringFile ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 blur-lg' : ''
                      }`} />
                    <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${resumeFile
                      ? 'bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30'
                      : isHoveringFile
                        ? 'bg-slate-50 dark:bg-white/10 border-emerald-300 dark:border-white/30'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-300 dark:border-white/10'
                      }`}>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          handleFileChange(e);
                          setUseExisting(false);
                        }}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer block">
                        {resumeFile ? (
                          <div className="flex flex-col items-center gap-4 animate-fade-in text-slate-900 dark:text-white">
                            <div className="relative">
                              <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/30 blur-xl rounded-full" />
                              <div className="relative bg-emerald-100 dark:bg-emerald-500/20 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-500/30">
                                <FileText className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            </div>
                            <div>
                              <p className="font-bold text-lg text-slate-800 dark:text-white">{resumeFile.name}</p>
                              <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm mt-1">
                                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                              </p>
                            </div>
                            <span className="text-slate-500 text-sm hover:text-slate-700 dark:hover:text-slate-400 transition-colors">
                              Click to change file
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4 transition-all duration-300">
                            <div className="relative group-hover:-translate-y-2 transition-transform duration-300">
                              <div className="absolute inset-0 bg-emerald-500/20 dark:bg-emerald-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative bg-white dark:bg-white/10 shadow-sm dark:shadow-none p-5 rounded-2xl border border-slate-200 dark:border-white/20">
                                <Upload className="w-10 h-10 text-emerald-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                              </div>
                            </div>
                            <div>
                              <p className="text-slate-800 dark:text-white font-medium text-lg">
                                Drop your resume here or <span className="text-emerald-600 dark:text-emerald-400 font-bold">browse</span>
                              </p>
                              <p className="text-slate-500 text-sm mt-1">
                                Supports PDF files up to 10MB
                              </p>
                            </div>
                            {existingResumeUrl && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setUseExisting(true);
                                }}
                                className="mt-4 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/60 transition-colors"
                              >
                                Or use your previously uploaded resume
                              </button>
                            )}
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Role Input */}
              <div className="space-y-4">
                <label htmlFor="jobRole" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Target Job Role</span>
                  </div>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-20 transition duration-300 blur" />
                  <input
                    id="jobRole"
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    required
                    className="relative w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 shadow-inner"
                    placeholder="e.g., Full Stack Developer, Data Scientist, Product Manager"
                  />
                </div>

                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {['Frontend Developer', 'Backend Developer', 'Full Stack', 'Data Scientist', 'Product Manager'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setJobRole(role)}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-all duration-200 font-medium ${jobRole === role
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400'
                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Rating */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>How well do you know these skills?</span>
                    </div>
                  </label>

                  <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-6 mb-6">
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium w-20">Beginner</span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={skillRating}
                          onChange={(e) => setSkillRating(parseInt(e.target.value))}
                          className="w-full h-3 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer relative z-10"
                          style={{
                            background: `linear-gradient(to right, #10b981 ${(skillRating - 1) * 11.11}%, transparent ${(skillRating - 1) * 11.11}%)`
                          }}
                        />
                        {/* Skill badges */}
                        <div className="flex justify-between mt-3">
                          {[
                            { label: 'Novice', icon: '🌱' },
                            { label: 'Learning', icon: '📚' },
                            { label: 'Skilled', icon: '💪' },
                            { label: 'Expert', icon: '🚀' },
                            { label: 'Master', icon: '👑' },
                          ].map((badge, i) => {
                            const rangeValue = (i + 1) * 2;
                            const isActive = skillRating >= rangeValue - 1;
                            return (
                              <div
                                key={badge.label}
                                className={`text-center transition-all duration-300 ${isActive ? 'opacity-100 transform scale-100 grayscale-0' : 'opacity-40 transform scale-90 grayscale'
                                  }`}
                              >
                                <span className="text-lg">{badge.icon}</span>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">{badge.label}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 text-sm font-medium w-20 text-right">Expert</span>
                    </div>

                    {/* Rating Display */}
                    <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-full blur-lg transition-all duration-500 ${skillRating >= 8 ? 'bg-indigo-500/30' : skillRating >= 5 ? 'bg-emerald-500/30' : 'bg-slate-500/30'
                          }`} />
                        <div className={`relative px-6 py-3 rounded-full border bg-white dark:bg-transparent transition-all duration-500 ${skillRating >= 8
                          ? 'dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/50'
                          : skillRating >= 5
                            ? 'dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/50'
                            : 'dark:bg-slate-500/20 border-slate-300 dark:border-slate-500/50'
                          }`}>
                          <span className={`text-2xl font-bold ${skillRating >= 8
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : skillRating >= 5
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-600 dark:text-slate-400'
                            }`}>
                            {skillRating}/10
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-slate-800 dark:text-white font-bold capitalize text-lg">
                          {skillRating <= 2 ? 'Novice' : skillRating <= 4 ? 'Beginner' : skillRating <= 6 ? 'Intermediate' : skillRating <= 8 ? 'Advanced' : 'Expert'}
                        </p>
                        <p className="text-slate-500 text-sm font-medium">Skill Level Assessment</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress/Error Messages */}
              <div className="space-y-4">
                {uploadProgress && (
                  <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-fade-in">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500 blur-lg rounded-full opacity-50 animate-pulse" />
                      <div className="relative w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <span className="text-blue-400 text-sm font-medium">{uploadProgress}</span>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500 blur-lg rounded-full opacity-50" />
                      <svg className="relative w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-red-400 text-sm font-medium">{error}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !jobRole.trim()}
                className={`group relative w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 border-2 ${loading || !jobRole.trim()
                  ? 'bg-slate-100 dark:bg-white/5 border-transparent text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1'
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 bg-white blur-lg rounded-full opacity-50 animate-pulse" />
                        <svg className="relative w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Generate Interview Questions
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>

              {/* Footer Note */}
              <p className="text-center text-slate-500 text-sm">
                Your resume is optional and only used for interview personalization
              </p>
            </form>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-fade-in-up animation-delay-400">
            {[
              { icon: '🎯', title: 'Personalized Questions', desc: 'Tailored to your targeted industry and skills' },
              { icon: '⏱️', title: 'Real-time Analysis', desc: 'Instant AI-driven feedback provided upon completion' },
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data and recordings stay strictly yours' },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center hover:shadow-lg dark:hover:bg-white/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  {feature.icon}
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-blob {
          animation: blob 15s infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-float {
          animation: float 8s infinite ease-in-out;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Custom Range Input Styling */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dark input[type="range"]::-webkit-slider-thumb {
          border-color: #020c1b;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.6);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }
      `}</style>
    </div>
  );
}
