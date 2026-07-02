import React, { useState, useEffect } from 'react'
import { supabase } from '../../../supabaseClient'
import { useAuth } from '../../components/AuthProvider'
import ChatArea from './ChatArea'  // AdminChatArea
import { LogOut, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../../css/Admin.css'

export default function AdminDashboard() {
    const { user, signOut } = useAuth()
    const [interns, setInterns] = useState([])
    const [selectedIntern, setSelectedIntern] = useState(null)
    const [loading, setLoading] = useState(true)
    const [onlineUsers, setOnlineUsers] = useState(new Set())
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const navigate = useNavigate()

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

    // Fetch unique CLIENT users who have sent messages to ANY admin
    useEffect(() => {
        const fetchChatUsers = async () => {
            try {
                const res = await callEdge("get_admin_chat_users");
                setInterns(res.interns || []);
            } catch (err) {
                console.error("Error fetching clients:", err);
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchChatUsers();
        }
    }, [user])

    // Real-time Presence (who is online)
    useEffect(() => {
        if (!user) return

        const channel = supabase.channel('online-users')

        channel
            .on('presence', { event: 'sync' }, () => {
                const newState = channel.presenceState()
                const ids = new Set()
                Object.values(newState).forEach(presenceArray => {
                    presenceArray.forEach(p => ids.add(p.user_id))
                })
                setOnlineUsers(ids)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ user_id: user.id })
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user])

    if (loading) {
        return <div className="admin-container">Loading Admin Dashboard...</div>
    }

    return (
        <div className="admin-container">
            {/* Mobile Sidebar Overlay */}
            <div
                className={`admin-overlay ${isSidebarOpen ? 'visible' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* ── SIDEBAR ── */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                {/* Sidebar header */}
                <div className="admin-sidebar-header">
                    <h2 className="admin-sidebar-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Conversations
                        {interns.length > 0 && (
                            <span className="admin-sidebar-badge">{interns.length}</span>
                        )}
                    </h2>
                </div>

                {/* User list */}
                <div className="admin-intern-list">
                    {interns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl">💬</div>
                            <p className="text-sm font-medium text-slate-500">No conversations yet</p>
                            <p className="text-xs text-slate-400">Users who message will appear here</p>
                        </div>
                    ) : (
                        interns.map((intern) => {
                            const isActive = selectedIntern?.id === intern.id
                            const isOnline = onlineUsers.has(intern.id)
                            const initials = (intern.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

                            return (
                                <div
                                    key={intern.id}
                                    onClick={() => {
                                        setSelectedIntern(intern)
                                        if (window.innerWidth < 768) setIsSidebarOpen(false)
                                    }}
                                    className={`admin-intern-item ${isActive ? 'active' : ''}`}
                                >
                                    {/* Avatar with online dot */}
                                    <div className="relative flex-shrink-0">
                                        {intern.profile_url ? (
                                            <img
                                                src={intern.profile_url}
                                                alt=""
                                                className="admin-intern-avatar"
                                            />
                                        ) : (
                                            <div className="admin-intern-avatar flex items-center justify-center text-sm font-bold text-indigo-600 bg-indigo-100">
                                                {initials}
                                            </div>
                                        )}
                                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <h3 className={`text-sm font-600 truncate ${isActive ? 'text-indigo-700' : 'text-slate-800'}`} style={{ fontWeight: 600 }}>
                                                {intern.name || 'Unknown User'}
                                            </h3>
                                            {isOnline && (
                                                <span className="text-[10px] text-emerald-500 font-semibold flex-shrink-0">● live</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">
                                            {intern.email || 'No email'}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            <div className="admin-chat-container">
                {!selectedIntern ? (
                    <div className="flex-1 flex flex-col" style={{ background: '#f8fafc' }}>
                        {/* Empty state header */}
                        <div style={{ height: '68px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', boxShadow: '0 1px 6px rgba(15,23,42,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button className="admin-mobile-menu-btn" onClick={() => setIsSidebarOpen(true)} style={{ display: 'flex' }}>
                                    <Menu className="h-5 w-5 text-slate-500" />
                                </button>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Support Dashboard</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="admin-exit-btn"
                                title="Go back to homepage"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Exit
                            </button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-4xl shadow-sm border border-indigo-100">
                                💬
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                                Support Dashboard
                            </h2>
                            <p className="text-gray-400 text-sm max-w-xs">
                                Select a conversation from the sidebar to start responding.
                            </p>
                        </div>
                    </div>
                ) : (
                    <ChatArea
                        user={user}
                        selectedUser={selectedIntern}
                        onlineUsers={onlineUsers}
                        onToggleSidebar={() => setIsSidebarOpen(true)}
                        onCloseChat={() => setSelectedIntern(null)}
                        onExit={() => navigate('/')}
                    />
                )}
            </div>
        </div>
    )
}
