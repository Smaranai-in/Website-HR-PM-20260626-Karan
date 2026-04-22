import React from "react";

export function AnalyticsCharts({ created, completed, developers }) {
    const maxCreated = Math.max(...created.map((d) => d.count), 1);
    const maxCompleted = Math.max(...completed.map((d) => d.count), 1);

    return (
        <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <h3 className="text-sm font-medium">Tasks created per day</h3>
                <div className="flex items-end gap-1 h-24 w-full overflow-hidden">
                    {created.map((d) => (
                        <div key={d.date} className="flex-1 text-center group relative">
                            <div
                                className="mx-0.5 rounded bg-sky-500 hover:bg-sky-600 transition-colors"
                                style={{ height: `${(d.count / maxCreated) * 100}%` }}
                                title={`${d.date}: ${d.count}`}
                            />
                            <div className="text-[10px] mt-1 text-muted-foreground font-medium">{d.count > 0 ? d.count : ""}</div>
                            {/* Tooltip for date on hover */}
                            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-popover text-popover-foreground text-xs px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 left-1/2 -translate-x-1/2 border">
                                {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium">Tasks completed per day</h3>
                <div className="flex items-end gap-1 h-24 w-full overflow-hidden">
                    {completed.map((d) => (
                        <div key={d.date} className="flex-1 text-center group relative">
                            <div
                                className="mx-0.5 rounded bg-emerald-500 hover:bg-emerald-600 transition-colors"
                                style={{ height: `${(d.count / maxCompleted) * 100}%` }}
                                title={`${d.date}: ${d.count}`}
                            />
                            <div className="text-[10px] mt-1 text-muted-foreground font-medium">{d.count > 0 ? d.count : ""}</div>
                            {/* Tooltip for date on hover */}
                            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-popover text-popover-foreground text-xs px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 left-1/2 -translate-x-1/2 border">
                                {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2">
                <h3 className="text-sm font-medium">Developer performance</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {developers.map((d) => (
                        <div key={d.developerId} className="flex gap-4 rounded-lg border border-border p-4 shadow-sm bg-card/50">
                            <div className="flex flex-col justify-between space-y-2 w-full">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-sm">{d.developerName}</div>
                                        <div className="text-xs text-muted-foreground font-mono">{d.employeeId ?? "-"}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-foreground">{d.progress}%</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Efficiency</div>
                                    </div>
                                </div>

                                <div className="space-y-2 mt-2">
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>Completed</span>
                                        <span className="font-medium text-foreground">{d.completed}/{d.total} tasks</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${d.progress}%` }} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                                        <div className="bg-slate-50 rounded px-2 py-1 border border-slate-100">
                                            <span className="block text-[10px] text-muted-foreground">Assigned</span>
                                            <span className="font-medium">{d.total}</span>
                                        </div>
                                        <div className="bg-emerald-50/50 rounded px-2 py-1 border border-emerald-100/50">
                                            <span className="block text-[10px] text-emerald-600/70">Delivered</span>
                                            <span className="font-medium text-emerald-700">{d.completed}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
