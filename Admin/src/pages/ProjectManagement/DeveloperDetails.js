import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { getDevelopers, getDevelopersProgress, getTasksByDeveloper, getDeveloperDailyStats } from "../../lib/data";
import { ArrowLeft, CheckCircle2, Circle, Clock, Layout, Shield, User } from "lucide-react";

export default function DeveloperDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [developers, progressData, tasksByDev, dailyStats] = await Promise.all([
                    getDevelopers(),
                    getDevelopersProgress(),
                    getTasksByDeveloper(),
                    getDeveloperDailyStats(id)
                ]);

                const developer = developers.find((d) => d.id === id);
                const stats = progressData.find((p) => p.developerId === id);
                const tasks = tasksByDev[id] || [];

                if (developer) {
                    setData({ developer, stats, tasks, dailyStats });
                } else {
                    setData(null);
                }
            } catch (error) {
                console.error("Error fetching developer details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) return <div className="p-8 text-center pt-40">Loading developer details...</div>;
    if (!data) return <div className="p-8 text-center pt-40">Developer not found</div>;

    const { developer, stats, tasks, dailyStats } = data;

    // Get initials
    const initials = developer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-24 pb-10 px-6 transition-colors duration-300 text-slate-800 dark:text-slate-200">
            <div className="flex flex-col gap-6">
                <div>
                    <Link
                        to="/projects/developers"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
                    </Link>

                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <Avatar
                                initials={initials}
                                colorClass={developer.avatarColor}
                                className="h-20 w-20 text-xl border-4 border-background shadow-md"
                            />
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{developer.name}</h1>
                                <div className="flex items-center gap-3 text-muted-foreground mt-1">
                                    <Badge variant="outline" className="flex items-center gap-1 font-normal">
                                        <Shield className="h-3 w-3" /> {developer.role}
                                    </Badge>
                                    {developer.employeeId && (
                                        <span className="text-sm flex items-center gap-1">
                                            <User className="h-3 w-3" /> ID: {developer.employeeId}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
                            <Circle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
                            <p className="text-xs text-muted-foreground">Tasks across all projects</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.completed || 0}</div>
                            <p className="text-xs text-muted-foreground">Successfully delivered</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(stats?.total || 0) - (stats?.completed || 0)}</div>
                            <p className="text-xs text-muted-foreground">Remaining workload</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <Layout className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.progress || 0}%</div>
                            <Progress value={stats?.progress || 0} className="h-2 mt-2" />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daily Task Completion</CardTitle>
                        <CardDescription>Tasks completed over the last 14 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] w-full flex items-end gap-2 pt-4">
                            {dailyStats.map((stat) => {
                                const max = Math.max(...dailyStats.map(s => s.count), 1);
                                const height = (stat.count / max) * 100;
                                return (
                                    <div key={stat.date} className="flex-1 flex flex-col items-center justify-end gap-2 group relative">
                                        <div
                                            className="w-full bg-emerald-500 rounded-t-sm min-h-[4px] transition-all group-hover:bg-emerald-600"
                                            style={{ height: `${height}%` }}
                                        />
                                        <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                                            {new Date(stat.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </span>
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md whitespace-nowrap z-10">
                                            {new Date(stat.date).toLocaleDateString()}: {stat.count} tasks
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Task Assignment History</CardTitle>
                        <CardDescription>
                            A list of all tasks assigned to {developer.name}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Task</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground"></th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {tasks.length === 0 ? (
                                        <tr className="border-b transition-colors hover:bg-muted/50">
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                                No tasks assigned yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        tasks.map((task) => (
                                            <tr key={task.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-middle font-medium">
                                                    <div>{task.title}</div>
                                                    {task.description && (
                                                        <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                            {task.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle">
                                                    <Badge
                                                        variant={task.status === "done" ? "success" : task.status === "in_progress" ? "warning" : "outline"}
                                                    >
                                                        {task.status === "done" ? "Completed" : task.status === "in_progress" ? "In Progress" : "To Do"}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 align-middle text-muted-foreground">
                                                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "—"}
                                                </td>
                                                <td className="p-4 align-middle text-right">

                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
