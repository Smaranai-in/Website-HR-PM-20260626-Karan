import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDevelopers, getProjectById } from "../../lib/data";
import { ProjectClient } from "../../components/projects/project-client";

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [project, developers] = await Promise.all([
                    getProjectById(id),
                    fetchDevelopers()
                ]);

                if (project) {
                    setData({ project, developers: developers || [] });
                } else {
                    setData(null);
                }
            } catch (error) {
                console.error("Error fetching project details:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id !== "new") {
            fetchData();
        } else {
            // Handle new project case if needed, or redirect
            setLoading(false);
            setData({ project: { id: "new", name: "New Project", description: "", status: "on_track", progress: 0, tasks: [], team: [] }, developers: [] });
        }

    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading project...</div>;
    if (!data && id !== "new") return <div className="p-8 text-center">Project not found</div>;

    return <ProjectClient project={data.project} allDevelopers={data.developers} />;
}
