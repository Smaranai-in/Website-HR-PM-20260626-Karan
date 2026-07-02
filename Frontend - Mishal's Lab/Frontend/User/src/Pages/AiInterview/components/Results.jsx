import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { toast } from 'react-toastify';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Award, RefreshCw, LogOut, Sparkles, Target, Shield, Brain, Send, Calendar, Clock, User, Phone, Mail, Code, Database, Cpu, Brain as BrainIcon } from 'lucide-react';

export default function Results({ results, profile, interviewId, onRetake }) {
  const { score, feedback, is_suspicious, tab_switch_count, face_missing_duration = 0, face_visibility_warnings = 0 } = results;
  const [showJobForm, setShowJobForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    daysPerWeek: '',
    dailyTimingFrom: '',
    dailyTimingTo: '',
    weeklyHours: '',
    duration: '',
    joiningDate: '',
    course: '',
    selfRatingReact: 5,
    selfRatingDB: 5,
    selfRatingGenAI: 5,
    selfRatingML: 5,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Pre-fill form with profile data
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.full_name || profile.name || '',
        email: profile.email || '',
        phone: profile.phone_number || profile.phone || '',
      }));
    }
  }, [profile]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-blue-400 to-cyan-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20 text-green-400';
    if (score >= 60) return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    return 'bg-red-500/10 border-red-500/20 text-red-400';
  };

  const getGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'Outstanding!', color: 'text-green-400' };
    if (score >= 80) return { grade: 'A', label: 'Excellent!', color: 'text-green-400' };
    if (score >= 70) return { grade: 'B', label: 'Good Job!', color: 'text-blue-400' };
    if (score >= 60) return { grade: 'C', label: 'Satisfactory', color: 'text-blue-400' };
    if (score >= 50) return { grade: 'D', label: 'Needs Work', color: 'text-yellow-400' };
    return { grade: 'F', label: 'Keep Trying!', color: 'text-red-400' };
  };

  const gradeInfo = getGrade(score);
  const isPassed = score >= 60;

  const callEdge = async (action, payload = {}) => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error('No active session token');
    }

    const response = await fetch(
      `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action, ...payload }),
      }
    );

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result?.error) {
      throw new Error(result?.error || 'Edge request failed');
    }

    return result;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseInt(value)
    }));
  };

  const handleSubmitJobForm = async (e) => {
    e.preventDefault();
    if (!profile?.id) {
      toast.error("Please log in to submit your application");
      return;
    }

    setFormSubmitting(true);

    try {
      const applicationData = {
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        top_priority_role: formData.role,
        availability: formData.daysPerWeek.toString(),
        start_time: formData.dailyTimingFrom,
        end_time: formData.dailyTimingTo,
        current_status: 'Applied',
        current_sub_status: 'Application Received',
        created_at: new Date().toISOString(),
      };

      await callEdge('create_internship_application', applicationData);

      toast.success("Application submitted successfully!");
      setFormSubmitted(true);
      setShowJobForm(false);
    } catch (err) {
      console.error('Quick Apply Error:', err);
      toast.error(err?.message || 'Failed to submit application');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] relative overflow-hidden font-sans transition-colors duration-300 text-slate-900 dark:text-white pb-20 pt-10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-100">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03] dark:opacity-10" />

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500/30 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-500/20 rounded-full animate-float animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-indigo-500/30 rounded-full animate-float animation-delay-4000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isPassed
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
              }`}>
              {isPassed ? (
                <>
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Interview Complete</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 text-sm font-medium">Interview Incomplete</span>
                </>
              )}
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-white dark:to-purple-400 bg-clip-text text-transparent mb-3 tracking-tight">
              {isPassed ? 'Congratulations! You Passed!' : 'Your Results Are In!'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {isPassed
                ? 'Great job! Now let\'s get you started on your journey.'
                : 'Here\'s how you performed in your AI-powered interview'}
            </p>
          </div>

          {/* Results Card */}
          <div className="bg-white/80 dark:bg-[#112240]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 animate-fade-in-up animation-delay-200">

            {/* Score Section */}
            <div className="relative p-8 text-center border-b border-slate-200 dark:border-white/10">
              {/* Animated gradient background behind score */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getScoreColor(score)}/5`} />

              {/* Score Circle Animation */}
              <div className="relative inline-block mb-6">
                {/* Outer glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${getScoreColor(score)} blur-2xl rounded-full opacity-50 animate-pulse`} />

                {/* Circle container */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={`url(#gradient-${score})`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${score * 2.83} 283`}
                      className="transition-all duration-1000 ease-out"
                      style={{
                        strokeDashoffset: 283 - (score * 2.83),
                      }}
                    />
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id={`gradient-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Score content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-5xl font-bold bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
                      {score}%
                    </div>
                    <div className={`text-xl font-semibold mt-1 ${gradeInfo.color}`}>
                      Grade: {gradeInfo.grade}
                    </div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="relative">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getScoreBg(score)}`}>
                  {isPassed ? (
                    <Award className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="font-medium">{gradeInfo.label}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">

                {/* Performance Card */}
                <div className="group relative bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all duration-300 shadow-sm dark:shadow-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-xl">
                        <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-transparent">
                        <span className="text-slate-600 dark:text-slate-400">Overall Score</span>
                        <span className={`font-bold text-lg bg-gradient-to-r ${getScoreColor(score)} bg-clip-text text-transparent`}>
                          {score}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-transparent">
                        <span className="text-slate-600 dark:text-slate-400">Grade</span>
                        <span className={`font-bold text-lg ${gradeInfo.color}`}>
                          {gradeInfo.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Behavior Card */}
                <div className={`group relative rounded-2xl p-6 border transition-all duration-300 shadow-sm dark:shadow-none bg-white dark:bg-transparent ${is_suspicious
                  ? 'border-red-200 dark:border-red-500/20 hover:border-red-300 dark:hover:border-red-500/40'
                  : 'border-green-200 dark:border-green-500/20 hover:border-green-300 dark:hover:border-green-500/40'
                  }`}>
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${is_suspicious ? 'bg-red-50 dark:bg-red-500/5' : 'bg-green-50 dark:bg-green-500/5'
                    }`} />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-xl ${is_suspicious ? 'bg-red-100 dark:bg-red-500/20' : 'bg-green-100 dark:bg-green-500/20'
                        }`}>
                        {is_suspicious ? (
                          <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Proctoring Summary</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-transparent">
                        <span className="text-slate-600 dark:text-slate-400">Tab Switches</span>
                        <span className={`font-bold text-lg ${tab_switch_count >= 3 ? 'text-red-400' : 'text-green-400'
                          }`}>
                          {tab_switch_count}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-transparent">
                        <span className="text-slate-600 dark:text-slate-400">Face Hidden Duration</span>
                        <span className={`font-bold text-lg ${face_missing_duration >= 30 ? 'text-red-400' : face_missing_duration > 0 ? 'text-amber-400' : 'text-green-400'
                          }`}>
                          {face_missing_duration < 60 ? `${face_missing_duration}s` : `${Math.floor(face_missing_duration / 60)}m ${face_missing_duration % 60}s`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-transparent">
                        <span className="text-slate-600 dark:text-slate-400">Face Hidden Warnings</span>
                        <span className={`font-bold text-lg ${face_visibility_warnings > 0 ? 'text-amber-400' : 'text-green-400'
                          }`}>
                          {face_visibility_warnings}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-transparent">
                        <span className="text-slate-600 dark:text-slate-400">Status</span>
                        <span className={`font-semibold px-3 py-1 rounded-full text-sm ${is_suspicious
                          ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400'
                          : 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400'
                          }`}>
                          {is_suspicious ? 'Flagged' : 'Clean'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suspicious Warning */}
              {is_suspicious && (
                <div className="mt-6 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-red-500 blur-lg rounded-full opacity-50 animate-pulse" />
                      <AlertTriangle className="relative w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">Activity Flagged</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {tab_switch_count >= 3 && face_missing_duration >= 30 ? (
                          'Multiple tab switches and prolonged periods of camera blockage/face absence were detected during your interview.'
                        ) : tab_switch_count >= 3 ? (
                          'Multiple tab switches were detected during your interview.'
                        ) : (
                          'Your camera was blocked or your face was not visible for a prolonged period (30+ seconds total) during the interview.'
                        )}{' '}
                        In a real interview setting, this behavior could result in disqualification. Consider retaking the interview with proper focus and environment setup.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-xl">
                    <BrainIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Feedback</h3>
                </div>
                <div className="bg-white dark:bg-gradient-to-br dark:from-white/5 dark:to-white/0 rounded-2xl p-6 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">
                  <div className="relative">
                    <div className="absolute -top-3 -left-2 text-purple-200 dark:text-purple-500/30 text-6xl font-serif">"</div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line relative z-10 pl-4">
                      {feedback}
                    </p>
                    <div className="absolute -bottom-8 right-0 text-purple-500/30 text-6xl font-serif">"</div>
                  </div>
                </div>
              </div>



              {/* Success Message */}
              {formSubmitted && (
                <div className="mt-8 p-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl animate-fade-in shadow-sm dark:shadow-none">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500 blur-lg rounded-full opacity-20 dark:opacity-50 animate-pulse" />
                      <CheckCircle className="relative w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-green-700 dark:text-green-400 font-semibold text-xl mb-1">Application Submitted!</h3>
                      <p className="text-slate-600 dark:text-slate-300">We'll review your application and get back to you soon.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                <div className="flex justify-center">
                  <button
                    onClick={onRetake || (() => window.location.reload())}
                    className="group relative w-full md:w-1/2 py-4 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                      Take Another Interview
                    </span>
                  </button>
                </div>
              </div>

              {/* Tips Section */}
              {!showJobForm && (
                <div className="mt-8 p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-slate-900 dark:text-white font-medium">Tips for Next Time</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-2 shrink-0" />
                      <span>Find a quiet, distraction-free environment</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-2 shrink-0" />
                      <span>Ensure stable internet connection</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-2 shrink-0" />
                      <span>Keep your camera and microphone on</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-2 shrink-0" />
                      <span>Stay focused on the interview window</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-slate-500 text-sm animate-fade-in-up animation-delay-400">
            Thank you for using AI Interview Platform
          </div>
        </div>
      </div>

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
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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
        .animate-pulse {
          animation: pulse 3s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.6);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
        }
        
        /* Select dropdown styling */
        select option {
          background: #0f172a;
          color: white;
        }
        
        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
