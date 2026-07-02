import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from '../modules/authentication/pages/Login'
import AuthApp from '../modules/authentication/App'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuthApp />} />
            <Route path="/login" element={<Login />} />
            {/* Mount the full authentication module under / (it contains its own nested routes) */}
            <Route path="/*" element={<AuthApp />} />
        </Routes>
    )
}