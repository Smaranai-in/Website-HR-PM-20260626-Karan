import { supabase } from "../supabaseClient";

export async function updateProjectTasks(projectId, tasks) {
try {
const {
data: { session },
} = await supabase.auth.getSession();


    if (!session) {
        throw new Error("Please login again");
    }

    const updates = tasks.map((t) => {
        const isUUID = (str) =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

        const statusMap = {
            in_progress: "in_progress",
            done: "completed",
            todo: "pending",
        };

        return {
            id: isUUID(t.id) ? t.id : undefined,
            project_id: projectId,
            title: t.title,
            description: t.description,
            status: statusMap[t.status] || t.status,
            assignee_id: t.assigneeId,
            created_at: t.createdAt,
            start_date: t.startDate,
            deadline: t.deadline,
            completed_at: t.completedAt,
        };
    });

    const response = await fetch(
        `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/w_edge`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                action: "update_project_tasks",
                projectId,
                tasks: updates,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return { success: true };
} catch (error) {
    console.error(error);
    return {
        success: false,
        error: error.message,
    };
}


}


export async function updateProjectTeam(projectId, developerIds) {
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
                action: "update_project_team",
                projectId,
                developerIds,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error);
    }

    return { success: true };
} catch (error) {
    console.error(error);
    return {
        success: false,
        error: error.message,
    };
}


}
