
import { supabase } from "../supabaseClient";

// Helper to map DB task to frontend Task
function mapTaskFromDb(t) {
    const statusMap = {
        'completed': 'done',
        'in_progress': 'in_progress',
        'pending': 'todo',
        'todo': 'todo'
    };
    return {
        ...t,
        status: statusMap[t.status] || t.status,
        assigneeId: t.assignee_id || t.assigneeId,
        createdAt: t.created_at || t.createdAt,
        startDate: t.start_date || t.startDate,
        completedAt: t.completed_at || t.completedAt
    };
}

export async function getProjects() {
    if (!supabase) return [];

    try {
        console.log("Fetching projects (manual join)...");
        // 1. Fetch all projects
        const { data: projects, error: pError } = await supabase.from("p_projects").select("*");
        if (pError) throw pError;

        if (!projects || projects.length === 0) return [];

        // 2. Fetch all tasks
        const { data: tasks, error: tError } = await supabase.from("p_tasks").select("*");
        if (tError) console.error("Error fetching tasks:", tError);

        // 3. Fetch project_developers pivot
        const { data: projDevs, error: pdError } = await supabase.from("p_project_developers").select("*");
        if (pdError) console.error("Error fetching project_developers:", pdError);

        // 4. Fetch all developers
        const { data: allDevs, error: dError } = await supabase.from("p_developers").select("*");
        if (dError) console.error("Error fetching developers:", dError);

        // Map data
        const developersMap = new Map((allDevs || []).map(d => [d.id, d]));

        return projects.map((p) => {
            // Filter tasks for this project
            const projectTasks = (tasks || []).filter(t => t.project_id === p.id);

            // Filter developers for this project
            const projectDevIds = (projDevs || [])
                .filter(pd => pd.project_id === p.id)
                .map(pd => pd.developer_id);

            const team = projectDevIds
                .map(devId => developersMap.get(devId))
                .filter(Boolean)
                .map(d => ({
                    ...d,
                    role: "Developer",
                    avatarColor: "bg-gray-500",
                    employeeId: "N/A"
                }));

            return {
                ...p,
                startDate: p.start_date || p.startDate,
                deadline: p.deadline,
                status: ["on_track", "at_risk", "off_track"].includes(p.status) ? p.status : "on_track",
                team: team,
                tasks: projectTasks.map(mapTaskFromDb)
            };
        });

    } catch (err) {
        console.error("Supabase projects fetch failed:", err);
        return [];
    }
}

export async function getProjectById(id) {
    if (!supabase) return undefined;

    try {
        // 1. Fetch project
        const { data: project, error: pError } = await supabase
            .from("p_projects")
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (pError) throw pError;
        if (!project) return undefined;

        // 2. Fetch tasks for this project
        const { data: tasks, error: tError } = await supabase
            .from("p_tasks")
            .select("*")
            .eq("project_id", id);

        // 3. Fetch project developers
        const { data: projDevs, error: pdError } = await supabase
            .from("p_project_developers")
            .select("*")
            .eq("project_id", id);

        // 4. Fetch relevant developers
        let team = [];
        if (projDevs && projDevs.length > 0) {
            const devIds = projDevs.map(pd => pd.developer_id);
            const { data: devs } = await supabase
                .from("p_developers")
                .select("*")
                .in("id", devIds);

            team = (devs || []).map(d => ({
                ...d,
                role: "Developer",
                avatarColor: "bg-gray-500",
                employeeId: "N/A"
            }));
        }

        return {
            ...project,
            startDate: project.start_date || project.startDate,
            deadline: project.deadline,
            status: project.status || "on_track",
            team: team,
            tasks: (tasks || []).map(mapTaskFromDb)
        };

    } catch (err) {
        console.error("Supabase getProjectById failed:", err);
        return undefined;
    }
}

export async function getSummaryStats() {
    const realProjects = await getProjects();
    const allTasks = realProjects.flatMap((p) => p.tasks || []);
    const completedTasks = allTasks.filter((t) => t.status === "done").length;
    const activeTasks = allTasks.filter((t) => t.status !== "done").length;

    return {
        totalProjects: realProjects.length,
        activeTasks,
        completedTasks
    };
}

export async function getDevelopers() {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase.from("p_developers").select("*");
        if (error) {
            console.error("Supabase developers fetch error:", error);
            return [];
        }
        if (data) return data.map((d) => ({
            ...d,
            role: "Developer",
            avatarColor: "bg-gray-500",
            employeeId: "N/A"
        }));
    } catch (err) {
        console.error("Supabase developers fetch failed:", err);
    }

    return [];
}

function formatDateISO(date) {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return d.toISOString();
}

export async function getTaskCountsByDay(days = 14) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const map = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        map.set(formatDateISO(d), 0);
    }

    const realProjects = await getProjects();
    const allTasks = realProjects.flatMap((p) => p.tasks);
    for (const t of allTasks) {
        if (t.createdAt) {
            const key = formatDateISO(new Date(t.createdAt));
            if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
        }
    }

    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}

export async function getCompletedTasksByDay(days = 14) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const map = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        map.set(formatDateISO(d), 0);
    }

    const realProjects = await getProjects();
    const allTasks = realProjects.flatMap((p) => p.tasks);
    for (const t of allTasks) {
        if (t.completedAt) {
            const key = formatDateISO(new Date(t.completedAt));
            if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
        }
    }

    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}


export async function getDevelopersProgress() {
    const [allProjects, allDevelopers] = await Promise.all([
        getProjects(),
        getDevelopers()
    ]);

    const allTasks = allProjects.flatMap((p) => p.tasks);
    const byDev = new Map();

    for (const d of allDevelopers) {
        byDev.set(d.id, { name: d.name, employeeId: d.employeeId, total: 0, completed: 0 });
    }

    for (const t of allTasks) {
        if (!t.assigneeId) continue;
        const entry = byDev.get(t.assigneeId);
        if (!entry) continue;

        entry.total++;
        if (t.status === "done" || t.completedAt) entry.completed++;
    }

    const result = [];
    for (const [id, v] of byDev) {
        const progress = v.total === 0 ? 0 : Math.round((v.completed / v.total) * 100);
        result.push({ developerId: id, developerName: v.name, employeeId: v.employeeId, total: v.total, completed: v.completed, progress });
    }

    return result;
}

export async function getTasksByDeveloper() {
    const [allProjects, allDevelopers] = await Promise.all([
        getProjects(),
        getDevelopers()
    ]);

    const result = {};
    for (const d of allDevelopers) {
        result[d.id] = [];
    }

    for (const p of allProjects) {
        for (const t of p.tasks) {
            if (t.assigneeId) {
                if (!result[t.assigneeId]) result[t.assigneeId] = [];
                result[t.assigneeId].push({ ...t });
            }
        }
    }

    return result;
}


export async function getDeveloperDailyStats(developerId, days = 14) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const map = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        map.set(formatDateISO(d), 0);
    }

    const realProjects = await getProjects();
    const allTasks = realProjects.flatMap((p) => p.tasks);
    for (const t of allTasks) {
        if (t.assigneeId === developerId && t.completedAt) {
            const key = formatDateISO(new Date(t.completedAt));
            if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
        }
    }

    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}
