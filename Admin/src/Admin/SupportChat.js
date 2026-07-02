import React from 'react'
import AdminChatDashboard from '../chatApp/pages/Admin/Dashboard'
import { AuthProvider } from '../chatApp/components/AuthProvider'

// Wrap the chat dashboard with AuthProvider so it can access the Supabase user session
export default function SupportChatPage() {
    return (
        <div className="h-[calc(100vh-60px)] pt-20 overflow-hidden">
            <AuthProvider>
                <AdminChatDashboard />
            </AuthProvider>
        </div>
    )
}
