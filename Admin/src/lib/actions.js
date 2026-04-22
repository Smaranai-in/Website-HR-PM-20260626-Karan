import { supabase } from "../supabaseClient";

export async function updateProjectTasks(projectId, tasks) {
    if (!tasks.length) return { success: true };

    try {
        const updates = tasks.map((t) => {
            // Validate UUIDs.
            const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

            const statusMap = {
                'in_progress': 'in_progress',
                'done': 'completed',
                'todo': 'pending'
            };

            const dbStatus = statusMap[t.status] || t.status;

            return {
                id: isUUID(t.id) ? t.id : undefined, // If not UUID, let DB gen ID
                project_id: projectId,
                title: t.title,
                description: t.description,
                status: dbStatus,
                assignee_id: t.assigneeId,
                created_at: t.createdAt,
                start_date: t.startDate,
                deadline: t.deadline,
                completed_at: t.completedAt,
            };
        });

        const { error } = await supabase.from("p_tasks").upsert(updates);

        if (error) {
            console.error("Error updating tasks:", error);
            return { success: false, error: error.message, details: error };
        }

        return { success: true };
    } catch (error) {
        console.error("Action error:", error);
        return { success: false, error: "Unexpected error", details: error };
    }
}
