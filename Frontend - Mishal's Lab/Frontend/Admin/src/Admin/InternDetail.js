import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuthModal } from "../context/AuthModalContext";
import { ArrowLeft, Phone, User, MapPin, FileText, ExternalLink, RefreshCw, Clock, Calendar, CheckCircle2, AlertCircle, Activity } from "lucide-react";
import { toast } from "react-toastify";

export default function InternDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, loadingUser } = useAuthModal();
  
  const [loading, setLoading] = useState(true);
  const [intern, setIntern] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    if (!loadingUser && (!profile || profile.role !== "admin")) navigate("/");
  }, [profile, loadingUser, navigate]);

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

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await callEdge("get_admin_intern_detail", { id });

      setIntern(res.intern);
      setAttendance(res.attendance || []);
      setAssessments(res.assessments || []);
    } catch (err) {
      console.error("Error fetching intern details:", err);
      toast.error("Failed to load intern details: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!intern) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-28 pb-20 px-4 md:px-6 flex flex-col items-center justify-center">
        <AlertCircle size={48} className="text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Intern Not Found</h2>
        <p className="text-slate-500 mb-6">Could not find details for this intern.</p>
        <button onClick={() => navigate("/user-activity")} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-semibold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Calculate stats
  const presentCount = attendance.filter(l => l.check_in).length;
  const sessionsCount = attendance.filter(l => l.check_in && l.check_out).length;
  const totalHours = attendance.reduce((acc, log) => {
    if (log.check_in && log.check_out) {
      return acc + (new Date(log.check_out) - new Date(log.check_in)) / 3600000;
    }
    return acc;
  }, 0);

  const getPerfScore = () => {
    const h = Math.min((totalHours / 40) * 40, 40);
    const latestAsm = assessments[0];
    const a = latestAsm?.status === "submitted" ? 30 : latestAsm?.status === "assigned" ? 10 : 0;
    const d = Math.min((presentCount / 20) * 30, 30);
    return Math.round(h + a + d);
  };
  const score = getPerfScore();
  const scoreColor = score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-red-400";
  const scoreBg = score >= 70 ? "bg-emerald-500" : score >= 40 ? "bg-amber-500" : "bg-red-400";

  const statusColor = (s = "") => {
    if (s.includes("Selected") || s.includes("Onboard") || s.includes("Track")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (s.includes("Reject") || s.includes("Fail")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    if (s.includes("Review") || s.includes("Interview")) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    if (s.includes("Task") || s.includes("Assessment")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const fmtTime = (iso) => iso ? new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-28 pb-20 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/user-activity")} className="p-2 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors">
            <ArrowLeft size={20} className="text-slate-500" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Intern Profile</h1>
          <button onClick={fetchData} className="ml-auto p-2 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-colors">
            <RefreshCw size={16} className="text-slate-500" />
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm relative">
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 w-full" />
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 mb-6">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-[#0a192f] p-1.5 shadow-lg flex-shrink-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-4xl">
                  {(intern.full_name || "?")[0].toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white truncate">{intern.full_name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${statusColor(intern.current_status || "")}`}>
                    {intern.current_status || "Applied"}
                  </span>
                  {intern.top_priority_role && <span className="text-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-semibold">{intern.top_priority_role}</span>}
                </div>
              </div>
              {/* Performance Score */}
              <div className="text-center bg-slate-50 dark:bg-[#0a192f] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 min-w-[120px]">
                <p className={`text-4xl font-black ${scoreColor}`}>{score}</p>
                <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Perf Score</p>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-2 max-w-xl">
              <div className="flex justify-between text-sm text-slate-500 mb-2 font-semibold">
                <span>Overall Performance</span><span className={scoreColor}>{score}/100</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${scoreBg} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${score}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Activity size={18} className="text-emerald-500"/> Engagement Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-[#0a192f] rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{presentCount}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">Days Present</p>
                </div>
                <div className="bg-slate-50 dark:bg-[#0a192f] rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{totalHours.toFixed(1)}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">Total Hours</p>
                </div>
                <div className="col-span-2 bg-slate-50 dark:bg-[#0a192f] rounded-2xl p-4 text-center border border-slate-100 dark:border-slate-800">
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{sessionsCount}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">Completed Sessions</p>
                </div>
              </div>
            </div>

            {/* Contact & Links */}
            <div className="bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2"><User size={18} className="text-blue-500"/> Contact Info</h3>
              <div className="space-y-3 mb-6">
                {intern.email && <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium"><div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#0a192f] flex items-center justify-center flex-shrink-0"><User size={14} className="text-slate-400" /></div><span className="truncate">{intern.email}</span></div>}
                {intern.phone_number && <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium"><div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#0a192f] flex items-center justify-center flex-shrink-0"><Phone size={14} className="text-slate-400" /></div>{intern.phone_number}</div>}
                {(intern.city || intern.state || intern.country) && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300 font-medium">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-[#0a192f] flex items-center justify-center flex-shrink-0"><MapPin size={14} className="text-slate-400" /></div>
                    <span className="truncate">{[intern.city, intern.state, intern.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2"><ExternalLink size={18} className="text-purple-500"/> Web Links</h3>
              <div className="flex flex-col gap-2">
                {intern.cv_url && <a href={intern.cv_url} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-colors"><div className="flex items-center gap-2"><FileText size={16} />Resume / CV</div><ExternalLink size={14}/></a>}
                {intern.linkedin_profile && <a href={intern.linkedin_profile} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"><div className="flex items-center gap-2"><ExternalLink size={16} />LinkedIn Profile</div><ExternalLink size={14}/></a>}
                {intern.github_url && <a href={intern.github_url} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"><div className="flex items-center gap-2"><ExternalLink size={16} />GitHub Portfolio</div><ExternalLink size={14}/></a>}
                {intern.portfolio_url && <a href={intern.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center justify-between px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-xl text-sm font-bold hover:bg-purple-100 transition-colors"><div className="flex items-center gap-2"><ExternalLink size={16} />Personal Portfolio</div><ExternalLink size={14}/></a>}
              </div>
            </div>

            {/* Application Data */}
            <div className="bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2"><FileText size={18} className="text-amber-500"/> Education & App</h3>
              <div className="space-y-4">
                {[
                  { l: "University", v: intern.university },
                  { l: "Branch", v: intern.branch },
                  { l: "Program", v: intern.program_type },
                  { l: "Graduation", v: intern.graduation_year },
                  { l: "Availability", v: intern.availability },
                  { l: "Applied On", v: fmtDate(intern.created_at) }
                ].map((itm, i) => itm.v && (
                  <div key={i} className="flex flex-col">
                    <span className="text-xs text-slate-400 font-semibold mb-0.5">{itm.l}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{itm.v}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Assessments */}
            <div className="bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><CheckCircle2 size={20} className="text-purple-500"/> Assessments</h3>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full">{assessments.length} Total</span>
              </div>
              
              {assessments.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 dark:bg-[#0a192f] rounded-2xl border border-slate-100 dark:border-slate-800">
                  <FileText className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-slate-500 text-sm">No assessments assigned yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {assessments.map(a => (
                    <div key={a.id} className="bg-slate-50 dark:bg-[#0a192f] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-1">{a.internship_assessments?.heading || "Assessment Task"}</h4>
                        <div className="flex items-center gap-3 text-xs">
                          {a.due_date && <span className="text-slate-500 font-medium"><Calendar size={12} className="inline mr-1"/>Due: {fmtDate(a.due_date)}</span>}
                          {a.submitted_at && <span className="text-emerald-500 font-semibold"><CheckCircle2 size={12} className="inline mr-1"/>Submitted: {fmtDate(a.submitted_at)}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          a.status === "submitted" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" :
                          "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"}`}>{a.status}</span>
                        {a.submission_url && (() => {
                          let submissions = [];
                          try {
                            if (a.submission_url.startsWith("[")) {
                              submissions = JSON.parse(a.submission_url);
                            } else {
                              submissions = [{ type: "link", name: "Submission Link", url: a.submission_url }];
                            }
                          } catch (e) {
                            submissions = [{ type: "link", name: "Submission Link", url: a.submission_url }];
                          }
                          return (
                            <div className="flex flex-col gap-1.5 items-start sm:items-end mt-2">
                              {submissions.map((sub, sIdx) => (
                                <a 
                                  key={sIdx}
                                  href={sub.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 border border-blue-200 dark:border-blue-850 rounded-lg px-2.5 py-1 bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                >
                                  <span>{sub.name} ({sub.type})</span> 
                                  <ExternalLink size={10}/>
                                </a>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attendance Logs */}
            <div className="bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2"><Clock size={20} className="text-blue-500"/> Attendance Log</h3>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full">{attendance.length} Records</span>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto p-2">
                {attendance.length === 0 ? (
                  <div className="text-center py-16">
                    <Clock className="mx-auto text-slate-300 mb-2" size={32} />
                    <p className="text-slate-500 text-sm">No attendance records found.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {attendance.map(log => {
                      const dur = log.check_in && log.check_out ? (() => {
                        const d = new Date(log.check_out) - new Date(log.check_in);
                        return `${Math.floor(d / 3600000)}h ${Math.floor((d % 3600000) / 60000)}m`;
                      })() : null;

                      return (
                        <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#0a192f] transition-colors group">
                          <div className="flex items-center gap-4 mb-2 sm:mb-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${log.check_in && log.check_out ? "bg-slate-100 dark:bg-slate-800 text-slate-500" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500"}`}>
                              <Calendar size={18}/>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white text-sm">{fmtDate(log.date)}</p>
                              {log.check_in && !log.check_out && <p className="text-xs text-emerald-500 font-semibold animate-pulse mt-0.5">Currently Online</p>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 sm:ml-auto">
                            <div className="text-left sm:text-right">
                              {log.check_in && <p className="text-xs font-medium text-slate-600 dark:text-slate-300">In: <span className="text-slate-800 dark:text-white font-bold">{fmtTime(log.check_in)}</span></p>}
                              {log.check_out ? (
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Out: <span className="text-slate-800 dark:text-white font-bold">{fmtTime(log.check_out)}</span></p>
                              ) : (
                                <p className="text-xs text-slate-400 italic">No check-out</p>
                              )}
                            </div>
                            
                            <div className="w-20 text-right">
                              {dur ? (
                                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold">{dur}</span>
                              ) : log.check_in ? (
                                <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold">Active</span>
                              ) : <span className="text-slate-400">—</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
