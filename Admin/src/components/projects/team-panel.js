import React from "react";

export function TeamPanel({ team = [] }) {
    const members = team || [];
    return (
        <div className="space-y-3 rounded-lg border border-dashed border-border bg-background/60 p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Project team</span>
                <span>{members.length} member{members.length === 1 ? "" : "s"}</span>
            </div>

            <div className="space-y-2">
                {members.map((dev) => {
                    return (
                        <div
                            key={dev.id}
                            className="flex items-center justify-between rounded-md border border-transparent px-1 py-1.5 text-xs hover:border-border"
                        >
                            <div className="flex items-center gap-2">
                                <div>
                                    <div className="font-medium text-[12px]">{dev.name}</div>
                                    <p className="text-[11px] text-muted-foreground">{dev.role} • <span className="font-mono text-[11px] text-muted-foreground">{dev.employeeId ?? "—"}</span></p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
