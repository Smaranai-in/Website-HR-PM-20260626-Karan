// w_edge_controller.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/* ------------------ CORS ------------------ */
// Only allow requests from our own domains
const ALLOWED_ORIGINS = [
    "https://smaranai.in",
    "https://www.smaranai.in",
    "http://localhost:3001",
    "http://localhost:3002",
];

const getCorsHeaders = (origin: string | null) => ({
    "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
});

const respond = (body: unknown, status = 200, origin: string | null = null) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { ...getCorsHeaders(origin), "Content-Type": "application/json" },
    });

/* ------------------ RATE LIMITING ------------------ */
// Simple in-memory rate limiter: 60 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

const checkRateLimit = (ip: string): boolean => {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return true; // allowed
    }
    if (entry.count >= RATE_LIMIT) return false; // blocked
    entry.count++;
    return true; // allowed
};

/* ------------------ INPUT SANITIZATION ------------------ */
// Strip HTML tags and trim whitespace to prevent stored XSS
const sanitizeString = (val: unknown): string => {
    if (typeof val !== "string") return String(val ?? "");
    return val.replace(/<[^>]*>/g, "").trim();
};

const sanitizeBody = (body: Record<string, unknown>, fields: string[]): void => {
    for (const field of fields) {
        if (typeof body[field] === "string") {
            body[field] = sanitizeString(body[field] as string);
        }
    }
};

const sanitizeAllStringsInObject = (obj: any): any => {
    if (!obj || typeof obj !== "object") return obj;
    for (const key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
            obj[key] = sanitizeAllStringsInObject(obj[key]);
        }
    }
    return obj;
};


/* ------------------ SERVER ------------------ */
Deno.serve(async (req) => {
    const origin = req.headers.get("Origin");

    const respond = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), {
            status,
            headers: { ...getCorsHeaders(origin), "Content-Type": "application/json" },
        });

    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: getCorsHeaders(origin) });
    }

    if (req.method !== "POST") {
        return respond({ error: "Only POST allowed" }, 405, origin);
    }

    // Rate limit by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(clientIp)) {
        return respond({ error: "Too many requests. Please slow down." }, 429, origin);
    }

    try {
        const body = await req.json();
        const { action } = body;

        if (!action) return respond({ error: "action is required" }, 400, origin);

        const authHeader = req.headers.get("Authorization");

        /* ---------- Clients ---------- */
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        // const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

        const admin = createClient(
            supabaseUrl,
            supabaseServiceRoleKey
        );
const userClient = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
        global: {
            headers: {
                Authorization: authHeader ?? "",
            },
        },
    }
);
        /* ---------- Helpers ---------- */
        const requireAuth = async () => {
            if (!authHeader) throw new Error("Missing Authorization");

            const authClient = createClient(
                supabaseUrl,
                Deno.env.get("SUPABASE_ANON_KEY") ?? "",
                {
                    global: {
                        headers: {
                            Authorization: authHeader,
                        },
                    },
                }
            );

            const { data } = await authClient.auth.getUser();
            if (!data?.user) throw new Error("Invalid JWT");
            return data.user;
        };

        const requireAdmin = async () => {
            const user = await requireAuth();

            // Check role in w_users (assuming this auth table remains source of truth for roles)
            const { data: profile } = await admin
                .from("w_users")
                .select("role")
                .eq("id", user.id)
                .single();

            if (profile?.role !== "admin") throw new Error("Admins only");
            return { user, role: profile.role };
        };
        /* ---------- ACTION ROUTER ---------- */
        switch (action) {

            /* ===== INTERNSHIP APPLICATIONS (NEW SCHEMA) ===== */

            case "get_applications":
            case "list-applications": {
                await requireAdmin();
                const { status, limit } = body;

                let q = admin
                    .from("w_internship_applications")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (status && status !== "All") q = q.eq("current_status", status);
                if (limit) q = q.limit(limit);

                const { data, error } = await q;
                if (error) throw error;

                return respond({
                    success: true,
                    total: data.length,
                    applications: data
                });
            }

            case "update_application":
            case "update-application": {
                const { user, role } = await requireAdmin();
                const { id, ...updates } = body;

                if (!id) return respond({ error: "id required" }, 400);

                // 1. Fetch current state
                const { data: current, error: fetchError } = await admin
                    .from("w_internship_applications")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (fetchError || !current) throw new Error("Application not found");

                // 2. Prepare Updates and Logs
                const dbUpdates: any = {};
                const activityLogs: any[] = [];
                const fieldLogs: any[] = [];

                // MAPPING: Handle legacy 'is_select' if sent by frontend, map to 'current_status'
                if (updates.is_select && updates.is_select !== current.current_status) {
                    updates.current_status = updates.is_select;
                }

                // Handle Status Change
                if (updates.current_status && updates.current_status !== current.current_status) {
                    dbUpdates.current_status = updates.current_status;

                    activityLogs.push({
                        application_id: id,
                        action_type: "STATUS_CHANGE",
                        old_status: current.current_status,
                        new_status: updates.current_status,
                        old_sub_status: current.current_sub_status,
                        new_sub_status: updates.current_sub_status || current.current_sub_status, // Maintain sub-status or update if provided
                        remark_text: updates.review_text || "Status updated", // detailed remark
                        created_by: user.id,
                        actor_role: role,
                        created_at: new Date().toISOString()
                    });
                }

                // Handle Sub-Status Change
                if (updates.current_sub_status && updates.current_sub_status !== current.current_sub_status) {
                    dbUpdates.current_sub_status = updates.current_sub_status;
                    // If status didn't change, we still log this as an activity
                    if (!activityLogs.find(l => l.action_type === "STATUS_CHANGE")) {
                        activityLogs.push({
                            application_id: id,
                            action_type: "SUB_STATUS_CHANGE",
                            old_status: current.current_status,
                            new_status: current.current_status,
                            old_sub_status: current.current_sub_status,
                            new_sub_status: updates.current_sub_status,
                            remark_text: updates.review_text || "Sub-status updated",
                            created_by: user.id,
                            actor_role: role,
                            created_at: new Date().toISOString()
                        });
                    }
                }

                // Handle Field Changes (Generic)
                // Fields to track: doj_expected, interview_date, etc.
                const trackableFields = ["doj_expected", "interview_date", "full_name", "email", "phone_number", "cv_url"];
                for (const field of trackableFields) {
                    if (updates[field] !== undefined && updates[field] !== current[field]) {
                        dbUpdates[field] = updates[field];
                        fieldLogs.push({
                            application_id: id,
                            field_name: field,
                            old_value: String(current[field] || ""),
                            new_value: String(updates[field]),
                            changed_by: user.id,
                            change_role: role,
                            change_reason: updates.change_reason || "Update",
                            changed_at: new Date().toISOString()
                        });
                    }
                }

                // Handle complex JSON arrays specifically
                if (updates.status_history !== undefined) {
                    dbUpdates.status_history = updates.status_history;
                }

                // Handle reviews and reviewtimestamps arrays
                if (updates.review !== undefined) {
                    dbUpdates.review = updates.review;
                }
                if (updates.reviewtimestamp !== undefined) {
                    dbUpdates.reviewtimestamp = updates.reviewtimestamp;
                }

                // 3. Execute Updates
                // Update Main Table
                if (Object.keys(dbUpdates).length > 0) {
                    const { error: updateError } = await admin
                        .from("w_internship_applications")
                        .update(dbUpdates)
                        .eq("id", id);
                    if (updateError) throw updateError;
                }

                // Insert Logs
                if (activityLogs.length > 0) {
                    await admin.from("internship_activity_log").insert(activityLogs);
                }
                if (fieldLogs.length > 0) {
                    await admin.from("internship_field_change_log").insert(fieldLogs);
                }

                return respond({ success: true, updates: dbUpdates });
            }

            case "update_academic_project_status": {
                await requireAdmin();
                const { id, status } = body;

                if (!id || !status) {
                    return respond({ error: "id and status are required" }, 400);
                }

                const { error } = await admin
                    .from("w_academic_projects")
                    .update({ status })
                    .eq("id", id);

                if (error) throw error;

                return respond({ success: true });
            }

            case "update_research_enrollment_status": {
                await requireAdmin();
                const { id, status } = body;

                if (!id || !status) {
                    return respond({ error: "id and status are required" }, 400);
                }

                const { error } = await admin
                    .from("w_research_enrollments")
                    .update({ status })
                    .eq("id", id);

                if (error) throw error;

                return respond({ success: true });
            }

            case "add_trait": {
                const { user, role } = await requireAdmin();
                const { application_id, trait_id, notes } = body;

                if (!application_id || !trait_id) return respond({ error: "Missing fields" }, 400);

                const { error } = await admin.from("application_traits").insert([{
                    application_id,
                    trait_id, // Assuming ID is passed, or name if logic requires lookup
                    added_by: user.id,
                    actor_role: role,
                    notes,
                    added_at: new Date().toISOString()
                }]);

                if (error) throw error;
                return respond({ success: true });
            }

            case "add_review": {
                const { user, role } = await requireAdmin();
                const { application_id, review_period, technical_rating, communication_rating, remarks } = body;

                const { error } = await admin.from("internship_performance_reviews").insert([{
                    application_id,
                    review_period,
                    technical_rating,
                    communication_rating,
                    overall_rating: (Number(technical_rating) + Number(communication_rating)) / 2, // Simple Logic
                    reviewer: user.id,
                    actor_role: role,
                    remarks,
                    review_date: new Date().toISOString()
                }]);

                if (error) throw error;
                return respond({ success: true });
            }

            case "delete_application": {
                await requireAdmin();
                const { id } = body;
                if (!id) return respond({ error: "id required" }, 400);

                const { error } = await admin
                    .from("w_internship_applications")
                    .delete()
                    .eq("id", id);

                if (error) throw error;
                return respond({ success: true });
            }

            case "delete_academic_project": {
                await requireAdmin();
                const { id } = body;

                if (!id) return respond({ error: "id required" }, 400);

                const { error } = await admin
                    .from("w_academic_projects")
                    .delete()
                    .eq("id", id);

                if (error) throw error;

                return respond({ success: true });
            }

            case "delete_research_enrollment": {
                await requireAdmin();
                const { id } = body;

                if (!id) return respond({ error: "id required" }, 400);

                const { error } = await admin
                    .from("w_research_enrollments")
                    .delete()
                    .eq("id", id);

                if (error) throw error;

                return respond({ success: true });
            }

            case "get_academic_projects": {
                await requireAdmin();
                const { data, error } = await admin
                    .from("w_academic_projects")
                    .select("*");

                if (error) throw error;
                return respond({ data });
            }

            case "get_research_enrollments": {
                await requireAdmin();
                const { data, error } = await admin
                    .from("w_research_enrollments")
                    .select("*");

                if (error) throw error;
                return respond({ data });
            }

            case "get_admin_course_enrollments": {
                await requireAdmin();
                const { data, error } = await admin
                    .from("w_course_enrollments")
                    .select(`
                        *,
                        course_details:w_courses (
                            id,
                            course_name,
                            course_domain
                        )
                    `);

                if (error) throw error;
                return respond({ data });
            }

            case "get_ai_interviews": {
                await requireAdmin();
                const { data: interviews, error: dbError } = await admin
                    .from("interviews")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (dbError) throw dbError;

                const { data: users, error: usersError } = await admin
                    .from("w_internship_applications")
                    .select("user_id, full_name, email");

                if (usersError) throw usersError;

                return respond({ interviews, users });
            }

            case "get_admin_intern_detail": {
                await requireAdmin();
                const { id } = body;
                if (!id) return respond({ error: "id required" }, 400);

                const { data: appData, error: appError } = await admin
                    .from("w_internship_applications")
                    .select("*")
                    .eq("user_id", id)
                    .single();

                if (appError && appError.code !== 'PGRST116') throw appError;

                const { data: attData, error: attError } = await admin
                    .from("intern_attendance")
                    .select("*")
                    .eq("user_id", id)
                    .order("check_in", { ascending: false });

                if (attError) throw attError;

                const { data: asmData, error: asmError } = await admin
                    .from("internship_student_assessments")
                    .select("id, status, due_date, submitted_at, created_at, submission_url, internship_assessments(heading, role)")
                    .eq("user_id", id)
                    .order("created_at", { ascending: false });

                if (asmError) throw asmError;

                return respond({
                    intern: appData || null,
                    attendance: attData || [],
                    assessments: asmData || []
                });
            }

            case "get_admin_user_activity": {
                await requireAdmin();

                const { data: apps, error: appError } = await admin
                    .from("w_internship_applications")
                    .select("*");
                if (appError) throw appError;

                const { data: attendance, error: attError } = await admin
                    .from("intern_attendance")
                    .select("id, user_id, date, check_in, check_out, created_at")
                    .order("check_in", { ascending: false })
                    .limit(200);
                if (attError) throw attError;

                const { data: assessments, error: asmError } = await admin
                    .from("internship_student_assessments")
                    .select("id, user_id, status, due_date, submitted_at, created_at, internship_assessments(heading, role)")
                    .order("created_at", { ascending: false })
                    .limit(100);
                if (asmError) throw asmError;

                return respond({
                    apps: apps || [],
                    attendance: attendance || [],
                    assessments: assessments || []
                });
            }

            case "get_admin_chat_users": {
                await requireAdmin();

                const { data: admins, error: adminErr } = await admin
                    .from("w_users")
                    .select("id")
                    .eq("role", "admin");

                if (adminErr) throw adminErr;
                const adminIds = (admins || []).map(a => a.id);

                if (adminIds.length === 0) {
                    return respond({ interns: [] });
                }

                const { data: messages, error: msgError } = await admin
                    .from("w_messages")
                    .select("sender_id, receiver_id")
                    .in("receiver_id", adminIds);

                if (msgError) throw msgError;

                const clientIds = new Set();
                messages?.forEach(m => {
                    if (!adminIds.includes(m.sender_id)) {
                        clientIds.add(m.sender_id);
                    }
                });

                const uniqueClientIds = Array.from(clientIds);
                if (uniqueClientIds.length === 0) {
                    return respond({ interns: [] });
                }

                const { data: clients, error: clientsError } = await admin
                    .from("w_users")
                    .select("*")
                    .in("id", uniqueClientIds);

                if (clientsError) throw clientsError;

                return respond({ interns: clients || [] });
            }

            case "get_all_project_data": {
                await requireAdmin();

                const [
                    { data: projects, error: pError },
                    { data: tasks, error: tError },
                    { data: projDevs, error: pdError },
                    { data: allDevs, error: dError }
                ] = await Promise.all([
                    admin.from("p_projects").select("*"),
                    admin.from("p_tasks").select("*"),
                    admin.from("p_project_developers").select("*"),
                    admin.from("w_internship_applications").select("id, user_id, full_name, top_priority_role"),
                ]);

                if (pError) throw pError;
                if (tError) throw tError;
                if (pdError) throw pdError;
                if (dError) throw dError;

                return respond({
                    projects: projects || [],
                    tasks: tasks || [],
                    projDevs: projDevs || [],
                    allDevs: allDevs || []
                });
            }

            case "get_developers": {
                await requireAdmin();
                const { data, error } = await admin
                    .from("w_internship_applications")
                    .select("id, user_id, full_name, top_priority_role");
                if (error) throw error;
                return respond({ data });
            }

            case "get_project_by_id": {
                await requireAdmin();
                const { id } = body;
                if (!id) return respond({ error: "id required" }, 400);

                const { data: project, error: pError } = await admin
                    .from("p_projects")
                    .select("*")
                    .eq("id", id)
                    .maybeSingle();

                if (pError) throw pError;
                if (!project) return respond({ project: null });

                const [
                    { data: tasks, error: tError },
                    { data: projDevs, error: pdError }
                ] = await Promise.all([
                    admin.from("p_tasks").select("*").eq("project_id", id),
                    admin.from("p_project_developers").select("*").eq("project_id", id),
                ]);

                if (tError) throw tError;
                if (pdError) throw pdError;

                return respond({
                    project,
                    tasks: tasks || [],
                    projDevs: projDevs || []
                });
            }

            case "get_projects": {
                const { intern_id } = body;
                const { data, error } = await admin
                    .from("w_intern_projects")
                    .select("*")
                    .eq("intern_id", intern_id);
                if (error) throw error;
                return respond({ projects: data });
            }

            case "add_project": {
                const { user, role } = await requireAdmin();
                const { intern_id, project_name, assigned_task } = body;

                if (!intern_id || !project_name) return respond({ error: "Missing fields" }, 400);

                const { error } = await admin.from("w_intern_projects").insert([{
                    intern_id,
                    project_name,
                    assigned_task,
                    status: "Assigned",
                    created_at: new Date().toISOString()
                }]);

                if (error) throw error;
                return respond({ success: true });
            }

            case "delete_project": {
                await requireAdmin();
                const { id } = body;
                if (!id) return respond({ error: "id required" }, 400);

                const { error } = await admin.from("w_intern_projects").delete().eq("id", id);
                if (error) throw error;
                return respond({ success: true });
            }

            case "add_weekly_update": {
                const { user, role } = await requireAdmin();
                const { project_id, update_text } = body;

                if (!project_id || !update_text) return respond({ error: "Missing fields" }, 400);

                // Fetch current project to get existing updates
                const { data: project, error: fetchErr } = await admin
                    .from("w_intern_projects")
                    .select("weekly_update")
                    .eq("id", project_id)
                    .single();

                if (fetchErr || !project) throw new Error("Project not found");

                const updates = Array.isArray(project.weekly_update) ? project.weekly_update : [];
                updates.push({
                    id: crypto.randomUUID(),
                    text: update_text,
                    date: new Date().toISOString(),
                    added_by: user.id
                });

                const { error } = await admin
                    .from("w_intern_projects")
                    .update({ weekly_update: updates })
                    .eq("id", project_id);

                if (error) throw error;
                return respond({ success: true });
            }

            case "delete_weekly_update": {
                await requireAdmin();
                const { project_id, update_id } = body;

                if (!project_id || !update_id) return respond({ error: "project_id and update_id are required" }, 400);

                // Fetch current project to get existing updates
                const { data: proj, error: fetchErr } = await admin
                    .from("w_intern_projects")
                    .select("weekly_update")
                    .eq("id", project_id)
                    .single();

                if (fetchErr || !proj) throw new Error("Project not found");

                const currentUpdates = Array.isArray(proj.weekly_update) ? proj.weekly_update : [];
                const filtered = currentUpdates.filter((u: any) => u.id !== update_id);

                const { error } = await admin
                    .from("w_intern_projects")
                    .update({ weekly_update: filtered })
                    .eq("id", project_id);

                if (error) throw error;
                return respond({ success: true });
            }

            case "create_course": {
    await requireAdmin();

    const {
        course_name,
        course_domain,
        description,
        course_level,
        how_many_weeks,
        total_enrolled,
        course_array,
        course_week_array,
        coursefee
    } = body;

    const { error } = await admin
        .from("w_courses")
        .insert([{
            course_name,
            course_domain,
            description,
            course_level,
            how_many_weeks,
            total_enrolled,
            course_array,
            course_week_array,
            coursefee
        }]);

    if (error) throw error;

    return respond({
        success: true
    });
}
case "get_user": {
    const user = await requireAuth();

    const { data, error } = await admin
        .from("w_users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (error) throw error;

    return respond({
        success: true,
        user: data,
    });
}
case "get_all_users": {
    await requireAdmin();

    const { data, error } = await admin
        .from("w_users")
        .select("id, name, email, role, profile_url, created_at")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return respond({
        success: true,
        users: data,
    });
}
case "update_user_role": {
    const { user } = await requireAdmin();
    const targetUserId = body.target_user_id;
    const newRole = body.new_role;

    if (!targetUserId || !newRole) {
        return respond({ error: "target_user_id and new_role are required" }, 400);
    }
    if (newRole !== "admin" && newRole !== "client") {
        return respond({ error: "Invalid role value" }, 400);
    }
    if (targetUserId === user.id) {
        return respond({ error: "Admins cannot change their own role" }, 400);
    }

    const { error } = await admin
        .from("w_users")
        .update({ role: newRole })
        .eq("id", targetUserId);

    if (error) throw error;

    return respond({
        success: true,
    });
}
case "create_user": {
    const authUser = await requireAuth();

    const name = sanitizeString(body.name || "User");

    const { error } = await admin
      .from("w_users")
      .insert([
        {
          id: authUser.id,
          email: authUser.email,
          name: name,
          role: "client",
          user_verify: true,
        },
      ]);

  if (error) throw error;

  return respond({
    success: true,
  });
}
case "update_user": {
    const user = await requireAuth();

    const name = sanitizeString(body.name);

    const { error } = await admin
        .from("w_users")
        .update({
            name,
        })
        .eq("id", user.id);

    if (error) throw error;

    return respond({
        success: true,
    });
}
case "update_profile_image": {
    const user = await requireAuth();
    const { profile_url } = body;

    if (!profile_url) {
        return respond({ error: "profile_url is required" }, 400);
    }

    const { error } = await admin
        .from("w_users")
        .update({ profile_url })
        .eq("id", user.id);

    if (error) throw error;

    return respond({ success: true });
}
case "update_task_status": {
    const user = await requireAuth();
    const { taskId, status, completed_at } = body;

    if (!taskId || !status) {
        return respond({ error: "taskId and status are required" }, 400);
    }

    const { data: task, error: taskError } = await admin
        .from("p_tasks")
        .select("id, assignee_id")
        .eq("id", taskId)
        .single();

    if (taskError || !task) {
        return respond({ error: "Task not found" }, 404);
    }

    if (task.assignee_id !== user.id) {
        return respond({ error: "Forbidden" }, 403);
    }

    const nextCompletedAt = status === "done"
        ? (completed_at ?? new Date().toISOString())
        : null;

    const { error } = await admin
        .from("p_tasks")
        .update({
            status,
            completed_at: nextCompletedAt,
        })
        .eq("id", taskId);

    if (error) throw error;

    return respond({ success: true });
}
case "update_interview_record": {
    const user = await requireAuth();
    const { interviewId, updates } = body;

    if (!interviewId || !updates || typeof updates !== "object") {
        return respond({ error: "interviewId and updates are required" }, 400);
    }

    const { data: interview, error: interviewError } = await admin
        .from("interviews")
        .select("id, user_id")
        .eq("id", interviewId)
        .single();

    if (interviewError || !interview) {
        return respond({ error: "Interview not found" }, 404);
    }

    if (interview.user_id !== user.id) {
        return respond({ error: "Forbidden" }, 403);
    }

    const { error } = await admin
        .from("interviews")
        .update(updates)
        .eq("id", interviewId);

    if (error) throw error;

    return respond({ success: true });
}
case "create_project": {
    await requireAdmin();

    const {
        name,
        description,
        status,
        start_date,
        deadline,
        developers
    } = body;

 const { data: projectData, error: projectError } = await admin
    .from("p_projects")
    .insert([{
        id: crypto.randomUUID(),

        name,
        description,
        status,
        start_date,
        deadline,
        progress: 0,
        tags: ["New"]
    }])
    .select()
    .single();

    if (projectError) throw projectError;

    if (developers?.length > 0) {
        const devInserts = developers.map((devId: string) => ({
            project_id: projectData.id,
            developer_id: devId
        }));

        const { error: devError } = await admin
            .from("p_project_developers")
            .insert(devInserts);

        if (devError) throw devError;
    }

    return respond({
        success: true,
        project: projectData
    });
}

case "create_internship_application": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    // Sanitize all input values
    const applicationData = sanitizeAllStringsInObject({ ...body });

    delete applicationData.action;
    delete applicationData.user_id;

    const { error } = await admin
        .from("w_internship_applications")
        .insert([{
            id: crypto.randomUUID(),
            user_id: data.user.id,
            ...applicationData
        }]);

    if (error) throw error;

    return respond({
        success: true
    });
}
case "update_internship_application": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    // Sanitize all input values
    const { id, ...applicationData } = sanitizeAllStringsInObject(body);

    const { error } = await admin
        .from("w_internship_applications")
        .update(applicationData)
        .eq("id", id)
        .eq("user_id", data.user.id);

    if (error) throw error;

    return respond({ success: true });
}
case "create_research_enrollment": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    // Sanitize all input values
    const enrollmentData = sanitizeAllStringsInObject({ ...body });

    delete enrollmentData.action;
    delete enrollmentData.user_id;

    const { error } = await admin
        .from("w_research_enrollments")
        .insert([
            {
                user_id: data.user.id,
                ...enrollmentData,
            },
        ]);

    if (error) throw error;

    return respond({
        success: true,
    });
}
case "create_daily_report": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const { report_date, report_text, hours_logged, blockers } = body;

    const { data: report, error } = await admin
        .from("intern_daily_reports")
        .insert([
            {
                user_id: data.user.id,
                report_date,
                report_text,
                hours_logged: hours_logged !== undefined ? hours_logged : null,
                blockers: blockers !== undefined ? blockers : null,
            },
        ])
        .select()
        .single();

    if (error) throw error;

    return respond({
        success: true,
        report,
    });
}
case "update_daily_report": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const { id, report_text, hours_logged, blockers } = body;

    const { data: report, error } = await admin
        .from("intern_daily_reports")
        .update({
            report_text,
            hours_logged: hours_logged !== undefined ? hours_logged : null,
            blockers: blockers !== undefined ? blockers : null,
        })
        .eq("id", id)
        .eq("user_id", data.user.id)
        .select()
        .single();

    if (error) throw error;

    return respond({
        success: true,
        report,
    });
}
case "apply_leave": {
    const user = await requireAuth();
    const { leave_type, start_date, end_date, reason, attachment_url } = body;
    
    if (!leave_type || !start_date || !end_date || !reason) {
        return respond({ error: "Missing required fields" }, 400);
    }
    
    const { data: leave, error } = await admin
        .from("w_leaves")
        .insert([{
            user_id: user.id,
            leave_type: sanitizeString(leave_type),
            start_date,
            end_date,
            reason: sanitizeString(reason),
            attachment_url: attachment_url ? sanitizeString(attachment_url) : null,
            status: "Pending",
            remarks: ""
        }])
        .select()
        .single();
        
    if (error) throw error;
    return respond({ success: true, leave });
}
case "get_my_leaves": {
    const user = await requireAuth();
    
    const { data: leaves, error } = await admin
        .from("w_leaves")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
    if (error) throw error;
    return respond({ success: true, leaves });
}
case "get_all_leaves": {
    await requireAdmin();
    
    const { data: leaves, error } = await admin
        .from("w_leaves")
        .select(`
            *,
            w_users:user_id (name, email)
        `)
        .order("created_at", { ascending: false });
        
    if (error) throw error;
    return respond({ success: true, leaves });
}
case "update_leave_status": {
    await requireAdmin();
    const { leave_id, status, remarks } = body;
    
    if (!leave_id || !status) {
        return respond({ error: "leave_id and status are required" }, 400);
    }
    
    const { data: leave, error } = await admin
        .from("w_leaves")
        .update({
            status: sanitizeString(status),
            remarks: remarks ? sanitizeString(remarks) : ""
        })
        .eq("id", leave_id)
        .select()
        .single();
        
    if (error) throw error;
    return respond({ success: true, leave });
}
case "edit_chat_message": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const { id, content } = body;

    const { data: message, error } = await admin
        .from("w_messages")
        .update({
            content,
            is_edited: true,
        })
        .eq("id", id)
        .eq("sender_id", data.user.id)
        .select()
        .single();

    if (error) throw error;

    return respond({
        success: true,
        message,
    });
}
case "delete_chat_message": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const { id } = body;

    const { error } = await admin
        .from("w_messages")
        .update({
            is_deleted: true,
            content: "This message was deleted",
        })
        .eq("id", id)
        .eq("sender_id", data.user.id);

    if (error) throw error;

    return respond({
        success: true,
    });
}
case "mark_messages_read": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const { ids } = body;

    const { error } = await admin
        .from("w_messages")
        .update({
            status: "read",
        })
        .in("id", ids)
        .eq("receiver_id", data.user.id);

    if (error) throw error;

    return respond({
        success: true,
    });
}
case "send_chat_message": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const {
        receiver_id,
        content,
        reply_to_id
    } = body;

    const { data: message, error } = await admin
        .from("w_messages")
        .insert([
            {
                sender_id: data.user.id,
                receiver_id,
                content,
                reply_to_id,
                status: "sent",
            },
        ])
        .select()
        .single();

    if (error) throw error;

    return respond({
        success: true,
        message,
    });
}
case "create_interview": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const {
        resume_url,
        job_role,
        skill_rating,
    } = body;

    const { data: interview, error } = await admin
        .from("interviews")
        .insert([
            {
                user_id: data.user.id,
                resume_text: null,
                resume_url,
                job_role,
                skill_rating,
                status: "in_progress",
            },
        ])
        .select()
        .single();

    if (error) throw error;

    return respond({
        success: true,
        interview,
    });
}
case "update_project_tasks": {
    await requireAdmin();

    const { projectId, tasks } = body;

    if (!projectId || !tasks) {
        return respond({ error: "projectId and tasks required" }, 400);
    }

    const { error } = await admin
        .from("p_tasks")
        .upsert(tasks);

    if (error) throw error;

    return respond({
        success: true
    });
}
case "update_project_team": {
    await requireAdmin();

    const { projectId, developerIds } = body;

    if (!projectId) {
        return respond({ error: "projectId required" }, 400);
    }

    const { error: deleteError } = await admin
        .from("p_project_developers")
        .delete()
        .eq("project_id", projectId);

    if (deleteError) throw deleteError;

    if (developerIds?.length) {
        const inserts = developerIds.map((devId: string) => ({
            project_id: projectId,
            developer_id: devId,
        }));

        const { error: insertError } = await admin
            .from("p_project_developers")
            .insert(inserts);

        if (insertError) throw insertError;
    }

    return respond({
        success: true
    });
}
case "update_message_reactions": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const { id, reactions } = body;

    const { error } = await admin
        .from("w_messages")
        .update({ reactions })
        .eq("id", id);

    if (error) throw error;

    return respond({
        success: true,
    });
}
case "create_course_enrollment": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const {
        name,
        email,
        phno,
        city,
        state,
        country,
        college_university,
        degree_program,
        year_of_study,
        field_of_study,
        prior_experience,
        how_did_you_hear_about_us,
        reason_for_taking_course,
        course_id,
    } = sanitizeAllStringsInObject({ ...body });

    const { data: enrollment, error } = await admin
        .from("w_course_enrollments")
        .insert([
            {
                user_id: data.user.id,
                name,
                email,
                phno,
                city,
                state,
                country,
                college_university,
                degree_program,
                year_of_study,
                field_of_study,
                prior_experience,
                how_did_you_hear_about_us,
                reason_for_taking_course,
                course_id,
            },
        ])
        .select()
        .single();

    if (error) throw error;

    return respond({
        success: true,
        enrollment,
    });
}
case "create_academic_project": {
    const user = await requireAuth();

    const {
        full_name,
        phone,
        email,
        project_domain,
        project_title,
        description,
        document_url,
        country,
        state,
        city,
        college,
        grad_year,
    } = sanitizeAllStringsInObject({ ...body });

    const { data: project, error } = await admin
        .from("w_academic_projects")
        .insert([
            {
                user_id: user.id,
                full_name,
                phone,
                email,
                project_domain,
                project_title,
                description,
                document_url,
                country,
                state,
                city,
                college,
                grad_year,
                status: "pending",
            },
        ])
        .select("id")
        .single();

    if (error) throw error;

    return respond({
        success: true,
        project,
    });
}
case "create_contact_message": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const {
        name,
        email,
        message,
    } = sanitizeAllStringsInObject({ ...body });

    const { data: contactMessage, error } = await admin
        .from("w_contact_messages")
        .insert([
            {
                user_id: data.user.id,
                name,
                email,
                message,
            },
        ])
        .select()
        .single();

    if (error) throw error;

    return respond({
        success: true,
        contactMessage,
    });
}
case "submit_assessment": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const {
        assessmentId,
        submissionUrl
    } = body;

    const { data: assessment, error } = await admin
        .from("internship_student_assessments")
        .update({
            status: "submitted",
            submission_url: submissionUrl,
            submitted_at: new Date().toISOString(),
        })
        .eq("id", assessmentId)
        .eq("user_id", data.user.id)
        .select(`
            *,
            internship_assessments (
                heading,
                role,
                details,
                difficulty,
                taskimage,
                hasimage
            )
        `)
        .single();

    if (error) throw error;

    return respond({
        success: true,
        assessment
    });
}
     case "select_assessment_task": {
    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const userClient = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data } = await userClient.auth.getUser();

    if (!data?.user) {
        throw new Error("Invalid JWT");
    }

    const {
        internshipAppId,
        task
    } = body;

  const { data: outline, error: outlineError } = await admin
    .from("internship_assessments")
    .select("id")
    .eq("heading", task.title)
    .eq("role", task.role)
    .single();

if (outlineError) throw outlineError;

if (!outline) {
    throw new Error("Assessment outline not found");
}

    const { data: existing } = await admin
        .from("internship_student_assessments")
        .select(`
            *,
            internship_assessments (
                heading,
                role,
                details,
                difficulty,
                taskimage,
                hasimage
            )
        `)
        .eq("user_id", data.user.id)
        .eq("internship_application_id", internshipAppId)
        .maybeSingle();

    if (existing) {
        return respond({
            success: true,
            assessment: existing
        });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const { data: assessment, error } = await admin
        .from("internship_student_assessments")
        .insert([
            {
                user_id: data.user.id,
                internship_application_id: internshipAppId,
                assessment_outline_id: outline.id,
                status: "assigned",
                due_date: dueDate.toISOString(),
            },
        ])
        .select(`
            *,
            internship_assessments (
                heading,
                role,
                details,
                difficulty,
                taskimage,
                hasimage
            )
        `)
        .single();

    if (error) throw error;

    return respond({
        success: true,
        assessment
    });
}
case "get_my_intern_application": {
   const user = await requireAuth();

   const { data, error } = await admin
      .from("w_internship_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

   if (error) throw error;

   return respond({
      success: true,
      application: data
   });
}
case "get_intern_application_by_user_id": {
   const user = await requireAuth();
   const { user_id } = body;
   const targetUserId = user_id || user.id;

   if (targetUserId !== user.id) {
      await requireAdmin();
   }

   const { data, error } = await admin
      .from("w_internship_applications")
      .select("*")
      .eq("user_id", targetUserId)
      .maybeSingle();

   if (error) throw error;

   return respond({
      success: true,
      application: data,
   });
}
case "get_my_attendance": {
   const user = await requireAuth();

   const { data, error } = await admin
      .from("intern_attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(30);

   if (error) throw error;

   return respond({
      success: true,
      attendance: data
   });
}
case "check_in": {
   const user = await requireAuth();
   const today = new Date().toISOString().split("T")[0];

   const { data: existingToday } = await admin
      .from("intern_attendance")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

   if (existingToday?.id) {
      return respond({ success: true, attendance_id: existingToday.id });
   }

   const { data, error } = await admin
      .from("intern_attendance")
      .insert([
        {
           user_id: user.id,
           date: today,
           check_in: new Date().toISOString()
        }
      ])
      .select("id")
      .single();

   if (error) throw error;

   return respond({ success: true, attendance_id: data?.id });
}
case "check_out": {
   const user = await requireAuth();
   const { attendance_id } = body;

   if (!attendance_id) {
      return respond({ error: "attendance_id required" }, 400);
   }

   const { error } = await admin
      .from("intern_attendance")
      .update({
          check_out: new Date().toISOString()
      })
      .eq("id", attendance_id)
      .eq("user_id", user.id);

   if (error) throw error;

   return respond({ success: true });
}
case "start_break": {
   const user = await requireAuth();
   const { attendance_id } = body;

   if (!attendance_id) {
      return respond({ error: "attendance_id required" }, 400);
   }

   const { error } = await admin
      .from("intern_attendance")
      .update({
         on_break: true,
         break_start: new Date().toISOString()
      })
      .eq("id", attendance_id)
      .eq("user_id", user.id);

   if (error) throw error;

   return respond({ success: true });
}
case "end_break": {
   const user = await requireAuth();
   const { attendance_id } = body;

   if (!attendance_id) {
      return respond({ error: "attendance_id required" }, 400);
   }

   const { data: record, error: fetchError } = await admin
      .from("intern_attendance")
      .select("break_start, total_break_ms")
      .eq("id", attendance_id)
      .eq("user_id", user.id)
      .single();

   if (fetchError || !record) {
      throw new Error("Attendance record not found");
   }

   const now = Date.now();
   const breakStart = record.break_start ? new Date(record.break_start).getTime() : null;
   const diffMs = breakStart ? Math.max(0, now - breakStart) : 0;

   const { error } = await admin
      .from("intern_attendance")
      .update({
         on_break: false,
         break_start: null,
         total_break_ms: (record.total_break_ms || 0) + diffMs
      })
      .eq("id", attendance_id)
      .eq("user_id", user.id);

   if (error) throw error;

   return respond({ success: true });
}
default:
                return respond({ error: `Invalid action: ${action}` }, 400);
        }
    } catch (err: any) {
        return respond({ error: err.message ?? "Server error" }, 500);
    }
});
