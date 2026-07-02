import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { useAssessment } from "../context/AssessmentContext";
import {
  ArrowRight,
  Clock,
  Zap,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Send,
  Link as LinkIcon,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";

const AssessmentOutlines = () => {
  const { internshipId } = useParams();
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useAuthModal();
  const {
    assessmentOutlines,
    loading,
    studentAssessment,
    fetchAssessmentOutlines,
    fetchInternshipApplication,
    fetchStudentAssessment,
    submitAssessment,
    isAssessmentExpired,
    getRemainingTime,
    selectTask,
  } = useAssessment();

  const [role, setRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true); // ✅ NEW: controls initial load

  // Submission State
  const [submissionsList, setSubmissionsList] = useState([]);
  const [linkInput, setLinkInput] = useState("");
  const [linkName, setLinkName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [submittingFinal, setSubmittingFinal] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!loadingUser && !user) navigate("/");
  }, [user, loadingUser, navigate]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Parse existing submission if any
  useEffect(() => {
    if (studentAssessment?.submission_url) {
      try {
        const val = studentAssessment.submission_url;
        if (val.startsWith("[")) {
          setSubmissionsList(JSON.parse(val));
        } else {
          setSubmissionsList([{ type: "link", name: "Submission Link", url: val }]);
        }
      } catch (e) {
        setSubmissionsList([{ type: "link", name: "Submission Link", url: studentAssessment.submission_url }]);
      }
    }
  }, [studentAssessment]);

  // ✅ FIX: Fetch data — always reset studentAssessment first before fetching
  // This prevents old assessment state from showing while new data loads
  useEffect(() => {
    const loadData = async () => {
      if (!internshipId || !user?.id) {
        if (!internshipId) fetchAssessmentOutlines();
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      try {
        // ✅ Always fetch fresh for THIS internship — context resets null if not found
        await fetchStudentAssessment(user.id, internshipId);

        // Fetch role from application
        const appData = await fetchInternshipApplication(internshipId);
        if (appData?.top_priority_role) {
          setRole(appData.top_priority_role);
          await fetchAssessmentOutlines(appData.top_priority_role);
        } else {
          await fetchAssessmentOutlines();
        }
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [internshipId, user?.id]);

  const handleSelectOutline = async (outline) => {
    if (!user?.id || !internshipId) {
      toast.error("Missing required information");
      return;
    }

    setSelectedId(outline.source_id || outline.id);
    setSubmitting(true);
    try {
      await selectTask(user.id, internshipId, {
        title: outline.title,
        role: outline.domain,
        outline: outline.description,
        details: outline.description,
      });
    } catch (err) {
      console.error(err);
      setSelectedId(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const filePath = `assessment_submissions/${user.id}/${studentAssessment.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("Interview_Resumes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("Interview_Resumes")
        .getPublicUrl(filePath);

      setSubmissionsList(prev => [...prev, { type: "file", name: file.name, url: data.publicUrl }]);
      toast.success(`Uploaded ${file.name} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalSubmission = async () => {
    if (submissionsList.length === 0) {
      toast.error("Please add at least one submission file or link.");
      return;
    }

    setSubmittingFinal(true);
    try {
      const submissionValue = JSON.stringify(submissionsList);
      await submitAssessment(studentAssessment.id, submissionValue);
      toast.success("Assessment submitted successfully!");
      setTimeout(() => {
        navigate("/profile", { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setSubmittingFinal(false);
    }
  };

  // ✅ FIX: Show loader during initial page load, not just context loading
  if (loadingUser || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0F2C]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 1: ACTIVE ASSESSMENT
  // ----------------------------------------------------------------------
  if (
    studentAssessment &&
    studentAssessment.internship_application_id === internshipId
  ) {
    const isExpired = isAssessmentExpired(studentAssessment.due_date);
    const remainingTime = getRemainingTime(studentAssessment.due_date);
    const outline = studentAssessment.assessment_outlines;
    const isSubmitted = studentAssessment.status === "submitted";

    return (
      <div className="pt-24 pb-12 px-4 md:px-16 bg-white dark:bg-[#0A0F2C] min-h-screen transition-colors duration-700">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Assessment Task
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Internship Application ID: {internshipId}
              </p>
            </div>

            {!isSubmitted && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold w-fit ${
                  isExpired
                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>{remainingTime} remaining</span>
              </div>
            )}
          </div>

          {/* Task Details */}
          <div className="bg-white dark:bg-[#0E1835] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {outline?.title || "Assessment Task"}
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold rounded-full">
                {outline?.domain || "General"}
              </span>
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-semibold rounded-full">
                {outline?.difficulty_level || "Intermediate"}
              </span>
            </div>

            {/* ✅ Task Image */}
            {outline?.hasimage && outline?.taskimage && (
              <div className="flex justify-center mb-6">
                <img
                  src={outline.taskimage}
                  alt="Task Reference"
                  className="max-h-64 w-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl"
                />
              </div>
            )}

            {/* ✅ Rich text rendered correctly */}
            <div
              className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: outline?.description || "" }}
            />
          </div>

          {/* Submission Section */}
          <div className="bg-white dark:bg-[#0E1835] rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Send className="w-6 h-6 text-emerald-500" />
              Submit Your Work
            </h3>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Assessment Submitted!
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You have successfully submitted your work.
                </p>
                <div className="space-y-2 max-w-md mx-auto">
                  {submissionsList.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-[#0A0F2C] rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold break-all text-sm transition-all"
                    >
                      <LinkIcon className="w-4 h-4 shrink-0" />
                      <span>{item.name || `Submission ${idx + 1}`} ({item.type})</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>Instructions:</strong> Complete the task in your preferred environment. Upload files (assessments, videos, reports) and add live links below.
                  </p>
                </div>

                {/* Submissions List */}
                {submissionsList.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Added Submissions
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {submissionsList.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-[#0A0F2C] border border-slate-200 dark:border-slate-800 rounded-xl text-sm">
                          <a href={item.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline truncate mr-2">
                            <LinkIcon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{item.name} ({item.type})</span>
                          </a>
                          <button 
                            type="button"
                            onClick={() => setSubmissionsList(prev => prev.filter((_, i) => i !== idx))}
                            className="text-xs text-rose-500 hover:text-rose-600 font-bold shrink-0"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Submissions Form */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Upload File (Assessment source/zip, videos, or PDF reports)
                    </label>
                    <input 
                      type="file" 
                      id="assessment-file-upload"
                      className="hidden" 
                      onChange={e => handleFileUpload(e.target.files?.[0])}
                      disabled={isUploading || submittingFinal}
                    />
                    <label 
                      htmlFor="assessment-file-upload"
                      className={`inline-flex items-center gap-2 px-5 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors w-full justify-center bg-gray-50 dark:bg-transparent ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                      ) : (
                        <Upload className="w-5 h-5 text-gray-500" />
                      )}
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {isUploading ? "Uploading file..." : "Click to select and upload a file"}
                      </span>
                    </label>
                  </div>

                  {/* Add Live Link */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Add Live Link (GitHub, Figma, Google Drive, Vercel host, etc.)
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Link Label (e.g. GitHub Repository)"
                        className="w-1/3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#0A0F2C] text-gray-900 dark:text-white text-sm"
                        value={linkName}
                        onChange={e => setLinkName(e.target.value)}
                      />
                      <input 
                        type="url"
                        placeholder="https://example.com"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-[#0A0F2C] text-gray-900 dark:text-white text-sm"
                        value={linkInput}
                        onChange={e => setLinkInput(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!linkInput.trim()) return toast.error("Please enter a link URL.");
                          const label = linkName.trim() || "Live Link";
                          setSubmissionsList(prev => [...prev, { type: "link", name: label, url: linkInput.trim() }]);
                          setLinkInput("");
                          setLinkName("");
                        }}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 shadow transition-colors"
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinalSubmission}
                  disabled={isExpired || submittingFinal || submissionsList.length === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
                    isExpired || submissionsList.length === 0
                      ? "bg-gray-400 cursor-not-allowed text-gray-200"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  }`}
                >
                  {submittingFinal ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Assessment"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // VIEW 2: SELECTION LIST
  // ----------------------------------------------------------------------
  return (
    <div className="pt-24 pb-12 px-4 md:px-16 bg-white dark:bg-[#0A0F2C] min-h-screen transition-colors duration-700">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[140%] bg-[radial-gradient(circle_at_20%_30%,rgba(0,255,180,0.1)_0%,transparent_70%)] blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium shadow-md border border-emerald-100 dark:border-emerald-900/50 mb-6">
            <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Assessment Selection</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0D1B2A] dark:text-white leading-tight mb-6">
            Choose Your <br />
            <span className="bg-gradient-to-r from-[#00A884] via-[#00C6B1] to-[#00D4FF] text-transparent bg-clip-text">
              Assessment Outline
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select any assessment outline that matches your expertise. You'll
            have total time of{" "}
            <span className="font-bold text-emerald-600">
              <u>3 days</u>
            </span>{" "}
            to complete it.
          </p>

          {role && (
            <div className="mt-6 animate-fade-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full font-medium border border-blue-100 dark:border-blue-800">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Showing assessments for: <strong>{role}</strong>
              </span>
            </div>
          )}
        </div>

        {/* INFO BANNER */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 mb-12 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>✓ You have 3 days to complete the selected assessment</li>
              <li>✓ Once Assessment is selected, you cannot change it</li>
              <li>✓ Your submission will be evaluated by our team</li>
              <li>✓ Results will be shared within 5-7 business days</li>
            </ul>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading assessment outlines...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedId
              ? assessmentOutlines.filter(
                  (o) => (o.source_id || o.id) === selectedId
                )
              : assessmentOutlines
            ).map((outline, idx) => (
              <div
                key={outline.source_id || `${outline.title}-${idx}`}
                className="group bg-white dark:bg-[#0E1835] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Top Colored Bar */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${
                    [
                      "from-emerald-500 to-teal-500",
                      "from-blue-500 to-cyan-500",
                      "from-purple-500 to-pink-500",
                      "from-orange-500 to-red-500",
                      "from-indigo-500 to-blue-500",
                    ][idx % 5]
                  }`}
                />

                <div className="p-6 md:p-8">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {outline.title}
                  </h3>

                  {/* Domain Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-full">
                      {outline.domain}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                      {outline.difficulty_level}
                    </span>
                  </div>

                  {/* Rich Text Preview */}
                  

                  {/* Meta Info */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>
                        <strong>{outline.estimated_hours}</strong> estimated
                      </span>
                    </div>

                    {outline.skills_required &&
                      outline.skills_required.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {outline.skills_required.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {outline.skills_required.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
                              +{outline.skills_required.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                  </div>

                  {/* Select Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectOutline(outline)}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        Select Assessment
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
            {assessmentOutlines.length === 0 && (
              <div className="col-span-full bg-white dark:bg-[#0E1835] rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Assessments Available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Please check back soon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentOutlines;