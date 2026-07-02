import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { supabase } from "../supabaseClient";
import {
  ArrowLeft, Search, RefreshCw, Users, Shield, ShieldAlert,
  ChevronDown, AlertTriangle, Check, X, Calendar, UserCheck
} from "lucide-react";
import { toast } from "react-toastify";

const GRAD = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-sky-600"
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  
  // Confirmation state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    user: null,
    targetRole: null
  });

  const { profile, loadingUser } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingUser && (!profile || profile.role !== "admin")) {
      navigate("/");
    }
  }, [profile, loadingUser, navigate]);

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

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await callEdge("get_all_users");
      setUsers(res.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile && profile.role === "admin") {
      fetchUsers();
    }
  }, [profile, fetchUsers]);

  const handleRoleChangeRequest = (targetUser, newRole) => {
    if (targetUser.id === profile?.id) {
      toast.error("You cannot modify your own administrative role.");
      return;
    }
    
    setConfirmModal({
      isOpen: true,
      user: targetUser,
      targetRole: newRole
    });
  };

  const executeRoleChange = async () => {
    const { user, targetRole } = confirmModal;
    if (!user || !targetRole) return;

    setUpdatingUserId(user.id);
    setConfirmModal({ isOpen: false, user: null, targetRole: null });
    
    try {
      await callEdge("update_user_role", {
        target_user_id: user.id,
        new_role: targetRole
      });
      
      toast.success(`Role updated successfully for ${user.name || user.email}`);
      
      // Update local state to reflect the change immediately
      setUsers(prev =>
        prev.map(u => (u.id === user.id ? { ...u, role: targetRole } : u))
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      toast.error("Failed to update role: " + err.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const filteredUsers = users.filter(u => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q);
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loadingUser || (loading && users.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020c1b]">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-slate-50 dark:bg-[#020c1b] pt-28 pb-20 px-4 md:px-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                User Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Grant or revoke administrator privileges for users in the platform
              </p>
            </div>
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="ml-auto p-2 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 hover:border-emerald-300 transition-colors"
            >
              <RefreshCw
                size={16}
                className={`text-slate-500 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Registered Users",
                value: users.length,
                icon: Users,
                color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30"
              },
              {
                label: "Administrators",
                value: users.filter(u => u.role === "admin").length,
                icon: ShieldAlert,
                color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30"
              },
              {
                label: "Standard Clients",
                value: users.filter(u => u.role !== "admin").length,
                icon: Shield,
                color: "text-slate-500 bg-slate-100 dark:bg-slate-800/30"
              }
            ].map((metric, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#112240] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 ${metric.color} rounded-xl flex items-center justify-center`}>
                    <metric.icon size={18} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {metric.value}
                </p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-800 dark:text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#112240] border border-slate-200 dark:border-slate-800 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="client">Clients</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-[#112240] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-20">
                <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-xs font-semibold text-slate-500 uppercase">
                      <th className="py-4 px-6">User</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Registered Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    {filteredUsers.map((user, i) => {
                      const grad = GRAD[i % GRAD.length];
                      const isSelf = user.id === profile?.id;
                      const isAdmin = user.role === "admin";
                      const isUpdating = updatingUserId === user.id;

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                        >
                          {/* User Column */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {user.profile_url ? (
                                <img
                                  src={user.profile_url}
                                  alt={user.name}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                                  {(user.name || user.email || "?")[0].toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-bold text-slate-800 dark:text-white truncate">
                                  {user.name || "Unnamed User"} {isSelf && <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-normal ml-1">You</span>}
                                </p>
                                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Role Column */}
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                              isAdmin
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/30"
                            }`}>
                              {isAdmin ? <ShieldAlert size={12} /> : <Shield size={12} />}
                              {isAdmin ? "Admin" : "Client"}
                            </span>
                          </td>

                          {/* Date Column */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Calendar size={14} />
                              <span>{fmtDate(user.created_at)}</span>
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="py-4 px-6 text-right">
                            {isSelf ? (
                              <span className="text-xs text-slate-400 italic">Self-protection enabled</span>
                            ) : (
                              <button
                                onClick={() => handleRoleChangeRequest(user, isAdmin ? "client" : "admin")}
                                disabled={isUpdating}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                                  isAdmin
                                    ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 dark:hover:bg-emerald-900/20"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {isUpdating ? (
                                  <span className="flex items-center gap-1">
                                    <RefreshCw className="animate-spin" size={12} /> Updating
                                  </span>
                                ) : isAdmin ? (
                                  "Revoke Admin"
                                ) : (
                                  "Make Admin"
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            onClick={() => setConfirmModal({ isOpen: false, user: null, targetRole: null })}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog content */}
          <div className="relative bg-white dark:bg-[#112240] max-w-md w-full rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-14 h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Confirm Role Update
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Are you sure you want to change the role of <strong>{confirmModal.user?.name || confirmModal.user?.email}</strong> to{" "}
              <span className={`font-semibold uppercase ${confirmModal.targetRole === "admin" ? "text-emerald-500" : "text-slate-500"}`}>
                {confirmModal.targetRole}
              </span>?
              {confirmModal.targetRole === "admin"
                ? " This will grant them complete access to all administrator panels and endpoints."
                : " This will revoke all admin panel access immediately."}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setConfirmModal({ isOpen: false, user: null, targetRole: null })}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeRoleChange}
                className={`px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-colors ${
                  confirmModal.targetRole === "admin"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
