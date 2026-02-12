"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/lib/api/auth";
import { Loader2, Plus, Edit, Trash2, Shield, Mail, Calendar, X, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
    const { isAuthenticated } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        phone: ""
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchUsers();
        }
    }, [isAuthenticated]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await getAllUsers(token);
                if (res.success) {
                    setUsers(res.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user: any = null) => {
        if (user) {
            setIsEditMode(true);
            setCurrentUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: "", // Don't show password
                role: user.role,
                phone: user.phone || ""
            });
        } else {
            setIsEditMode(false);
            setCurrentUser(null);
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "user",
                phone: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (isEditMode && currentUser) {
                // Update
                await updateUser(currentUser._id, formData, token);
                alert("User updated successfully!");
            } else {
                // Create
                await createUser(formData, token);
                alert("User created successfully!");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            console.error("Operation failed", error);
            alert("Operation failed: " + (error.response?.data?.message || "Unknown error"));
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                await deleteUser(id, token);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete user");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Customers</h1>
                    <p className="text-gray-400 mt-1">View and manage registered users.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add New User
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">User</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Role</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Email</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Joined</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-sm font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold border border-white/10">
                                                {user.name?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p>{user.name}</p>
                                                <p className="text-xs text-gray-500">ID: {user._id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                                            <Shield size={12} />
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} /> {user.email}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            {user.email !== 'admin@example.com' && (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-6">
                                {isEditMode ? 'Edit User' : 'Add New User'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    />
                                </div>
                                {!isEditMode && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {isEditMode ? 'Update User' : 'Create User'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
