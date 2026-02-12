"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderStatus } from "@/lib/api/auth";
import { Loader2, Package, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Helper for badges
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'placed': return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case 'preparing': return "bg-orange-500/20 text-orange-400 border-orange-500/30";
        case 'out_for_delivery': return "bg-purple-500/20 text-purple-400 border-purple-500/30";
        case 'delivered': return "bg-green-500/20 text-green-400 border-green-500/30";
        case 'cancelled': return "bg-red-500/20 text-red-400 border-red-500/30";
        default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
};

export default function AdminOrdersPage() {
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchOrders();
    }, [isAuthenticated, user]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const ordersRes = await getAllOrders(token);
            if (ordersRes.success) {
                setOrders(ordersRes.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token");

            await updateOrderStatus(id, newStatus, token);
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));

        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    // Filtering
    const filteredOrders = orders.filter(order => {
        const orderId = order._id || "";
        const userName = order.user?.name || "";

        const matchesSearch = orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Order Management</h1>
                    <p className="text-gray-400 mt-1">Manage and track all customer orders here.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchOrders} className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-sm font-medium transition-colors">
                        Refresh
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Filter className="text-primary" size={20} />
                        <h2 className="text-lg font-bold text-white">Filter Orders</h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search by ID or Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none w-full md:w-64 placeholder:text-gray-600"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="Placed">Placed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out_for_delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/5">
                            <tr>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Order ID</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Customer</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Items</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Total</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Date</th>
                                <th className="p-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-gray-500">
                                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 font-mono text-xs font-medium text-gray-500 group-hover:text-primary transition-colors">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="p-4 text-sm font-medium text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold border border-white/10">
                                                    {order.user?.name?.[0] || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span>{order.user?.name || "Guest"}</span>
                                                    <span className="text-[10px] text-gray-500">{order.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400 max-w-[200px] truncate">
                                            {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
                                        </td>
                                        <td className="p-4 text-sm font-bold text-white">₹{order.totalAmount}</td>
                                        <td className="p-4">
                                            <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-bold border backdrop-blur-sm", getStatusColor(order.status))}>
                                                {order.status.replace(/_/g, " ")}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                            <span className="block text-[10px] opacity-70">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                disabled={updatingId === order._id}
                                                className="bg-zinc-800 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:ring-primary/50 focus:border-primary outline-none cursor-pointer hover:border-gray-500 transition-colors"
                                            >
                                                <option value="Placed">Placed</option>
                                                <option value="Preparing">Preparing</option>
                                                <option value="Out_for_delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
