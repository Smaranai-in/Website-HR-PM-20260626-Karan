import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import { useAuthModal } from "./AuthModalContext";

const AssessmentContext = createContext();

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const ASSESSMENT_SELECT = `
  *,
  internship_assessments (
    heading,
    role,
    details,
    difficulty,
    taskimage,
    hasimage
  )
`;

const normalizeAssessment = (data) => ({
  ...data,
  assessment_outlines: {
    title: data.internship_assessments?.heading,
    domain: data.internship_assessments?.role,
    description: data.internship_assessments?.details,
    difficulty_level: data.internship_assessments?.difficulty || "Intermediate",
    taskimage: data.internship_assessments?.taskimage || null,
    hasimage: data.internship_assessments?.hasimage || false,
  },
});

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export const AssessmentProvider = ({ children }) => {
  const { user } = useAuthModal();
  const [assessmentOutlines, setAssessmentOutlines] = useState([]);
  const [studentAssessment, setStudentAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ FIX: Only clear state on logout
  // The old syncAssessment was fetching by user_id only (no internshipId)
  // which caused it to show OLD submitted assessments when navigating back
  useEffect(() => {
    if (!user?.id) {
      setStudentAssessment(null);
      setAssessmentOutlines([]);
    }
  }, [user?.id]);

  // Fetch internship application details (Role)
  const fetchInternshipApplication = async (internshipId) => {
    try {
      const { data, error } = await supabase
        .from("w_internship_applications")
        .select("top_priority_role")
        .eq("id", internshipId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching internship application:", err);
      return null;
    }
  };

  // Fetch assessment outlines from ashish_assessments
  const fetchAssessmentOutlines = async (domain = null) => {
    setLoading(true);
    try {
      let query = supabase
        .from("internship_assessments")
        .select("id, role, heading, details, days, hrs, difficulty, isactive, taskimage, hasimage")
        .eq("isactive", true);

      if (domain) {
        query = query.ilike("role", `%${domain}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const mapped = (data || []).map((row) => ({
        source_id: row.id,
        title: row.heading,
        domain: row.role,
        description: row.details,
        difficulty_level: row.difficulty || "Intermediate",
        estimated_hours: row.hrs
          ? `${row.hrs} hrs`
          : row.days
          ? `${row.days} days`
          : "Max 72hrs",
        skills_required: [],
        taskimage: row.taskimage || null,
        hasimage: row.hasimage || false,
      }));

      setAssessmentOutlines(mapped);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load assessment outlines");
    } finally {
      setLoading(false);
    }
  };

  // Submit assessment
  const submitAssessment = async (assessmentId, submissionUrl) => {
    setLoading(true);
    try {
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
    body: JSON.stringify({
      action: "submit_assessment",
      assessmentId,
      submissionUrl,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

const normalized = normalizeAssessment(result.assessment);
      setStudentAssessment(normalized);
      toast.success("Assessment submitted successfully!");
      return { data: normalized, error: null };
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit assessment");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Select a task
  const selectTask = async (userId, internshipAppId, task) => {
    setLoading(true);
    try {
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
    body: JSON.stringify({
      action: "select_assessment_task",
      internshipAppId,
      task,
    }),
  }
);

const result = await response.json();

if (!response.ok) {
  throw new Error(result.error);
}

const normalized = normalizeAssessment(result.assessment);

setStudentAssessment(normalized);

return normalized;
  } catch (err) {
      console.error("selectTask error:", err);
      setError(err.message);
      toast.error("Failed to assign assessment");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Always filters by BOTH userId AND internshipAppId
  // This ensures going back never shows wrong/old assessment
  const fetchStudentAssessment = async (userId, internshipAppId) => {
    try {
      const { data, error } = await supabase
        .from("internship_student_assessments")
        .select(ASSESSMENT_SELECT)
        .eq("user_id", userId)
        .eq("internship_application_id", internshipAppId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const normalized = normalizeAssessment(data);
        setStudentAssessment(normalized);
        return normalized;
      }

      // ✅ Always reset to null if no assessment found for THIS internship
      setStudentAssessment(null);
      return null;
    } catch (err) {
      console.error("Error fetching student assessment:", err);
      setStudentAssessment(null);
      return null;
    }
  };

  // Check if assessment is expired
  const isAssessmentExpired = (dueDate) => new Date() > new Date(dueDate);

  // Get remaining time
  const getRemainingTime = (dueDate) => {
    const diff = new Date(dueDate) - new Date();
    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessmentOutlines,
        studentAssessment,
        loading,
        error,
        fetchStudentAssessment,
        fetchInternshipApplication,
        fetchAssessmentOutlines,
        isAssessmentExpired,
        getRemainingTime,
        selectTask,
        submitAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return context;
};