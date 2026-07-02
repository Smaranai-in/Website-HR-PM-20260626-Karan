import React, { useState } from "react";
import { Users, ExternalLink, Edit2, X, Search, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { updateProjectTeam } from "../../lib/actions";

const avatarGradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
];

function getGradient(id) {
    if (!id) return avatarGradients[0];
    const sum = String(id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return avatarGradients[sum % avatarGradients.length];
}

function getInitials(name) {
    return (name || "?")
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}

export function TeamPanel({ team = [], onTeamUpdate, projectId, allDevelopers = [] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set(team.map(m => m.id)));
    const [searchQuery, setSearchQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const openEditModal = () => {
        setSelectedIds(new Set(team.map(m => m.id)));
        setSearchQuery("");
        setIsEditing(true);
    };

    const toggleDeveloper = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleSaveTeam = async () => {
        setIsSaving(true);
        try {
            const devIdsArray = Array.from(selectedIds);
            const res = await updateProjectTeam(projectId, devIdsArray);
            if (res.success) {
                // Update local state to reflect new team
                const newTeam = allDevelopers.filter(d => selectedIds.has(d.id));
                if (onTeamUpdate) onTeamUpdate(newTeam);
                setIsEditing(false);
            } else {
                alert("Failed to update team: " + res.error);
            }
        } catch (e) {
            console.error(e);
            alert("Error updating team");
        } finally {
            setIsSaving(false);
        }
    };

    const filteredDevs = allDevelopers.filter(d => 
        (d.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.role || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900/80 shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Project Team</span>
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        {team.length}
                    </span>
                </div>
                {projectId && projectId !== "new" && (
                    <button 
                        onClick={openEditModal}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-slate-500 dark:text-slate-400 hover:text-indigo-600"
                        title="Edit Team"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Members list */}
            <div className="p-3 space-y-2 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                {team.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                            <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">No team members assigned</p>
                    </div>
                ) : (
                    team.map((dev, i) => {
                        const gradient = getGradient(dev.id);
                        const initials = getInitials(dev.name);
                        return (
                            <Link
                                key={dev.id || i}
                                to={`/projects/developers/${dev.id}`}
                                className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700"
                            >
                                {/* Avatar */}
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-sm font-bold text-white shadow-sm`}>
                                    {initials}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {dev.name}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                        {dev.role || "Developer"}
                                    </p>
                                </div>

                                <ExternalLink className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
                            </Link>
                        );
                    })
                )}
            </div>

            {/* Edit Team Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Manage Project Team</h3>
                            <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search developers and interns..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
                            {filteredDevs.map(dev => {
                                const isSelected = selectedIds.has(dev.id);
                                return (
                                    <div 
                                        key={dev.id} 
                                        onClick={() => toggleDeveloper(dev.id)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                                            isSelected 
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/50' 
                                            : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className={`flex items-center justify-center w-5 h-5 rounded border ${
                                            isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                        }`}>
                                            {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                                        </div>
                                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${getGradient(dev.id)} text-xs font-bold text-white`}>
                                            {getInitials(dev.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{dev.name}</p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{dev.role}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredDevs.length === 0 && (
                                <p className="text-center text-sm text-slate-500 py-8">No matching developers or interns found.</p>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveTeam}
                                disabled={isSaving}
                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-70 min-w-[100px]"
                            >
                                {isSaving ? "Saving..." : "Save Team"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
