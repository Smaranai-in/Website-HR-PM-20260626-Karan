// w_edge_controller.ts
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

/* ------------------ CORS ------------------ */
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

/* ------------------ SERVER ------------------ */
Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return respond({ error: "Only POST allowed" }, 405);
    }

    try {
        const body = await req.json();
        const { action } = body;

        if (!action) return respond({ error: "action is required" }, 400);

        const authHeader = req.headers.get("Authorization");

        /* ---------- Clients ---------- */
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
        // const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

        const admin = createClient(
            supabaseUrl,
            supabaseServiceRoleKey
        );

        /* ---------- Helpers ---------- */
        const requireAdmin = async () => {
            if (!authHeader) throw new Error("Missing Authorization");
            const userClient = createClient(
                supabaseUrl,
                Deno.env.get("SUPABASE_ANON_KEY") ?? "",
                { global: { headers: { Authorization: authHeader } } }
            );

            const { data } = await userClient.auth.getUser();
            if (!data?.user) throw new Error("Invalid JWT");

            // Check role in w_users (assuming this auth table remains source of truth for roles)
            const { data: profile } = await admin
                .from("w_users")
                .select("role")
                .eq("id", data.user.id)
                .single();

            if (profile?.role !== "admin") throw new Error("Admins only");
            return { user: data.user, role: profile.role };
        };

        /* ---------- ACTION ROUTER ---------- */
        switch (action) {

            /* ===== INTERNSHIP APPLICATIONS (NEW SCHEMA) ===== */

            case "get_applications":
            case "list-applications": {
                await requireAdmin();
                const { status, limit } = body;

                let q = admin
                    .from("internship_applications")
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
                    .from("internship_applications")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (fetchError || !current) throw new Error("Application not found");

                // 2. Prepare Updates and Logs
                const dbUpdates: any = { updated_at: new Date().toISOString(), updated_by: user.id };
                const activityLogs: any[] = [];
                const fieldLogs: any[] = [];

                // MAPPING: Handle legacy 'is_select' if sent by frontend, map to 'current_status'
                if (updates.is_select && updates.is_select !== current.current_status) {
                    updates.current_status = updates.is_select;
                }

                // Handle Status Change
                if (updates.current_status && updates.current_status !== current.current_status) {
                    dbUpdates.current_status = updates.current_status;
                    dbUpdates.status_updated_at = new Date().toISOString();
                    dbUpdates.status_updated_by = user.id;
                    dbUpdates.status_updated_role = role;

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

                // 3. Execute Updates
                // Update Main Table
                if (Object.keys(dbUpdates).length > 2) { // more than just updated_at/by
                    const { error: updateError } = await admin
                        .from("internship_applications")
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

            // Keep Project Mgmt endpoints for now (pointing to w_intern_projects) until those tables are migrated/replaced
            case "get_projects":
                const { intern_id } = body;
                const { data: pData, error: pError } = await admin
                    .from("w_intern_projects")
                    .select("*")
                    .eq("intern_id", intern_id);
                if (pError) throw pError;
                return respond({ projects: pData });



            default:
                return respond({ error: `Invalid action: ${action}` }, 400);
        }
    } catch (err: any) {
        return respond({ error: err.message ?? "Server error" }, 500);
    }
});
