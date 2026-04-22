import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { Button } from "../../components/ui/button";

export default function NewProjectPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "on_track",
        startDate: "",
        deadline: ""
    });

    const [developers, setDevelopers] = useState([]);
    const [selectedDevs, setSelectedDevs] = useState(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchDevs() {
            if (!supabase) return;
            const { data } = await supabase.from("p_developers").select("*");
            if (data) {
                const mappedDevs = data.map((d) => ({
                    ...d,
                    role: "Developer",
                    avatarColor: "bg-gray-500",
                    employeeId: "N/A"
                }));
                setDevelopers(mappedDevs);
            }
        }
        fetchDevs();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleDev = (devId) => {
        setSelectedDevs(prev => {
            const next = new Set(prev);
            if (next.has(devId)) next.delete(devId);
            else next.add(devId);
            return next;
        });
    };

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!formData.name.trim()) {
                alert("Project name is required!");
                return;
            }

            setLoading(true);

            try {
                if (!supabase) {
                    throw new Error("Supabase client not initialized");
                }

                // 1. Insert Project
                const { data: projectData, error: projectError } = await supabase
                    .from("p_projects")
                    .insert([{
                        name: formData.name,
                        description: formData.description,
                        status: formData.status,
                        start_date: formData.startDate || null,
                        deadline: formData.deadline || null,
                        progress: 0,
                        tags: ["New"]
                    }])
                    .select()
                    .single();

                if (projectError) throw projectError;
                if (!projectData) throw new Error("No data returned from project creation");

                const projectId = projectData.id;

                // 2. Insert Project Developers (if any selected)
                if (selectedDevs.size > 0) {
                    const devInserts = Array.from(selectedDevs).map(devId => ({
                        project_id: projectId,
                        developer_id: devId
                    }));

                    const { error: devError } = await supabase
                        .from("p_project_developers")
                        .insert(devInserts);

                    if (devError) {
                        console.error("Error adding developers:", devError);
                        alert("Project created, but failed to assign developers.");
                    }
                }

                navigate("/projects");
                // Trigger a refresh if needed or just navigate. Using React Router, state might not update automatically on Dashboard effectively unless we have context or refetch.
                // For now, standard navigation.

            } catch (err) {
                console.error("Error creating project:", err);
                alert(`Failed to create project: ${err.message || "Unknown error"}`);
            } finally {
                setLoading(false);
            }
        },
        [formData, selectedDevs, navigate]
    );

    const handleCancel = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 pt-24 pb-12">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Create New Project</h1>
                    <p className="mt-2 text-slate-400">Set up a new project and start managing tasks with your team.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-700 bg-slate-800/50 p-8 backdrop-blur">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g., Mobile App Redesign"
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-white">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your project..."
                            rows={4}
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-white">
                            Initial Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="on_track">On Track</option>
                            <option value="at_risk">At Risk</option>
                            <option value="off_track">Off Track</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-white">
                                Start date
                            </label>
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="deadline" className="block text-sm font-medium text-white">
                                Deadline
                            </label>
                            <input
                                id="deadline"
                                name="deadline"
                                type="date"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Developer Selection */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Assign Team Members
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-lg border border-slate-600 bg-slate-700/50 p-2">
                            {developers.map(dev => (
                                <div
                                    key={dev.id}
                                    className={`flex items-center gap-2 rounded p-2 cursor-pointer transition-colors ${selectedDevs.has(dev.id) ? 'bg-blue-600/30 border border-blue-500/50' : 'hover:bg-slate-600/50 border border-transparent'}`}
                                    onClick={() => toggleDev(dev.id)}
                                >
                                    <div className={`h-4 w-4 rounded-sm border flex items-center justify-center ${selectedDevs.has(dev.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-400'}`}>
                                        {selectedDevs.has(dev.id) && <span className="text-white text-[10px]">✓</span>}
                                    </div>
                                    <div className="text-sm text-slate-200">
                                        <span className="font-medium">{dev.name}</span>
                                        <span className="block text-[10px] text-slate-400">{dev.role}</span>
                                    </div>
                                </div>
                            ))}
                            {developers.length === 0 && (
                                <div className="col-span-2 text-center text-sm text-slate-400 p-2">
                                    No developers found in database.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button onClick={handleCancel} variant="outline" className="flex-1" type="button" disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Creating..." : "Create Project"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
