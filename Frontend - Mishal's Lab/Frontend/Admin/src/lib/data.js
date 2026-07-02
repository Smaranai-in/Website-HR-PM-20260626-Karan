import { supabase } from "../supabaseClient";

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

// ─────────────────────────────────────────────────────────────────────────────
// CORE FETCH: All four tables in PARALLEL — only ever called ONCE per page load
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchAllProjectData() {
    if (!supabase) return { projects: [], tasks: [], projDevs: [], allDevs: [] };

    try {
        const res = await callEdge("get_all_project_data");
        return {
            projects: res.projects || [],
            tasks: res.tasks || [],
            projDevs: res.projDevs || [],
            allDevs: res.allDevs || [],
        };
    } catch (err) {
        console.error("fetchAllProjectData failed:", err);
        return { projects: [], tasks: [], projDevs: [], allDevs: [] };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// BUILD: Assembles project objects from pre-fetched raw data (no extra DB hits)
// ─────────────────────────────────────────────────────────────────────────────
function buildProjects({ projects, tasks, projDevs, allDevs }) {
    // Map developers using user_id instead of id if available, fallback to id
    const developersMap = new Map((allDevs || []).map(d => [d.user_id || d.id, d]));

    return projects.map((p) => {
        const projectTasks = (tasks || []).filter(t => t.project_id === p.id);

        const projectDevIds = (projDevs || [])
            .filter(pd => pd.project_id === p.id)
            .map(pd => pd.developer_id);

        const team = projectDevIds
            .map(devId => developersMap.get(devId))
            .filter(Boolean)
            .map(d => ({
                ...d,
                id: d.user_id || d.id, // Ensure id points to user_id for assignment
                name: d.full_name || d.name || "Unknown Intern",
                role: d.top_priority_role || d.role || "Intern",
                avatarColor: d.avatar_color || "bg-indigo-500",
                employeeId: d.employee_id || d.employeeId || "—"
            }));

        return {
            ...p,
            startDate: p.start_date || p.startDate,
            deadline: p.deadline,
            status: ["on_track", "at_risk", "off_track"].includes(p.status) ? p.status : "on_track",
            team,
            tasks: projectTasks.map(mapTaskFromDb)
        };
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API — these now accept pre-fetched data (rawData) to avoid re-fetching
// ─────────────────────────────────────────────────────────────────────────────

// Sync version — use when rawData is already in memory (no extra DB calls)
export function getProjects(rawData) {
    return buildProjects(rawData);
}

// Async standalone version — fetches fresh data
export async function fetchProjects() {
    const data = await fetchAllProjectData();
    return buildProjects(data);
}

// Sync version — use when rawData is already in memory
export function getDevelopers(rawData) {
    return (rawData?.allDevs || []).map(d => ({
        ...d,
        id: d.user_id || d.id,
        name: d.full_name || d.name || "Unknown Intern",
        role: d.top_priority_role || d.role || "Intern",
        avatarColor: d.avatar_color || "bg-indigo-500",
        employeeId: d.employee_id || d.employeeId || "—"
    }));
}

// Async standalone version — fetches fresh data
export async function fetchDevelopers() {
    if (!supabase) return [];
    try {
        const res = await callEdge("get_developers");
        return (res.data || []).map(d => ({
            ...d,
            id: d.user_id || d.id, // Map user_id to id for tasks and projects
            name: d.full_name || d.name || "Unknown Intern",
            role: d.top_priority_role || d.role || "Intern",
            avatarColor: d.avatar_color || "bg-indigo-500",
            employeeId: d.employee_id || d.employeeId || "—"
        }));
    } catch (err) {
        console.error("Supabase intern fetch failed:", err);
        return [];
    }
}

// Derived stats — all computed from pre-fetched projects (zero extra DB calls)
export function getSummaryStats(projects) {
    const allTasks = projects.flatMap(p => p.tasks || []);
    return {
        totalProjects: projects.length,
        activeTasks: allTasks.filter(t => t.status !== "done").length,
        completedTasks: allTasks.filter(t => t.status === "done").length,
    };
}

function formatDateISO(date) {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return d.toISOString();
}

export function getTaskCountsByDay(projects, days = 14) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const map = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        map.set(formatDateISO(d), 0);
    }

    const allTasks = projects.flatMap(p => p.tasks);
    for (const t of allTasks) {
        if (t.createdAt) {
            const key = formatDateISO(new Date(t.createdAt));
            if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
        }
    }

    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}

export function getCompletedTasksByDay(projects, days = 14) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const map = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        map.set(formatDateISO(d), 0);
    }

    const allTasks = projects.flatMap(p => p.tasks);
    for (const t of allTasks) {
        if (t.completedAt) {
            const key = formatDateISO(new Date(t.completedAt));
            if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
        }
    }

    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}

export function getDevelopersProgress(projects, developers) {
    const allTasks = projects.flatMap(p => p.tasks);
    const byDev = new Map();

    for (const d of developers) {
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

export function getTasksByDeveloper(projects, developers) {
    const result = {};
    for (const d of developers) result[d.id] = [];

    for (const p of projects) {
        for (const t of p.tasks) {
            if (t.assigneeId) {
                if (!result[t.assigneeId]) result[t.assigneeId] = [];
                result[t.assigneeId].push({ ...t });
            }
        }
    }
    return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET PROJECT BY ID — tasks and developers fetched in PARALLEL
// ─────────────────────────────────────────────────────────────────────────────
export async function getProjectById(id) {
    if (!supabase) return undefined;

    try {
        const res = await callEdge("get_project_by_id", { id });
        if (!res.project) return undefined;

        const project = res.project;
        const tasks = res.tasks || [];
        const projDevs = res.projDevs || [];

        let team = [];
        if (projDevs && projDevs.length > 0) {
            const devIds = projDevs.map(pd => pd.developer_id);
            const allDevs = await fetchDevelopers();
            team = allDevs.filter(d => devIds.includes(d.id));
        }

        return {
            ...project,
            startDate: project.start_date || project.startDate,
            deadline: project.deadline,
            status: project.status || "on_track",
            team,
            tasks: tasks.map(mapTaskFromDb)
        };

    } catch (err) {
        console.error("Supabase getProjectById failed:", err);
        return undefined;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEVELOPER DAILY STATS — single call, uses getProjectById data if available
// ─────────────────────────────────────────────────────────────────────────────
export async function getDeveloperDailyStats(developerId, days = 14, projects = null) {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - (days - 1));

    const map = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        map.set(formatDateISO(d), 0);
    }

    let allProjects = projects;
    if (!allProjects) {
        const raw = await fetchAllProjectData();
        allProjects = buildProjects(raw);
    }

    const allTasks = allProjects.flatMap(p => p.tasks);
    for (const t of allTasks) {
        if (t.assigneeId === developerId && t.completedAt) {
            const key = formatDateISO(new Date(t.completedAt));
            if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
        }
    }

    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}
