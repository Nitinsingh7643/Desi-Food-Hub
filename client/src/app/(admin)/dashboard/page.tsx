"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders, updateOrderStatus, getAdminStats } from "@/lib/api/auth";
import { Loader2, DollarSign, Package, CheckCircle, Clock, Truck, XCircle, Search, Filter, ArrowUpRight, ArrowDownRight, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();
    }, [isAuthenticated, user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // 1. Fetch Orders
            const ordersRes = await getAllOrders(token);
            if (ordersRes.success) {
                setOrders(ordersRes.data);
            }

            // 2. Fetch Stats
            const statsRes = await getAdminStats(token);
            if (statsRes.success) {
                setStats(statsRes);

                // Format Chart Data
                const dailyStats = statsRes.dailyStats || [];
                const formattedChartData = dailyStats.map((day: any) => ({
                    name: new Date(day._id).toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue
                    fullDate: day._id,
                    revenue: day.revenue,
                    orders: day.orders
                }));
                setChartData(formattedChartData);
            }

        } catch (error) {
            console.error("Failed to fetch admin data", error);
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

    // Use Server-Side Stats if available, otherwise 0 (loading)
    const totalRevenue = stats?.totalRevenue || 0;
    const totalOrdersCount = stats?.totalOrders || 0;
    const pendingOrdersCount = stats?.pendingOrders || 0;
    const completedOrdersCount = stats?.completedOrders || 0;

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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-1">Welcome back, Admin! Here's your business at a glance.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-sm font-medium transition-colors">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    trend="+12.5%"
                    color="text-green-400"
                    bg="bg-green-500/10"
                    border="border-green-500/20"
                />
                <StatCard
                    title="Total Orders"
                    value={totalOrdersCount}
                    icon={Package}
                    trend="+5.2%"
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    border="border-blue-500/20"
                />
                <StatCard
                    title="Pending Orders"
                    value={pendingOrdersCount}
                    icon={Clock}
                    trend="High Load"
                    trendColor="text-orange-400"
                    color="text-orange-400"
                    bg="bg-orange-500/10"
                    border="border-orange-500/20"
                />
                <StatCard
                    title="Delivered Orders"
                    value={completedOrdersCount}
                    icon={CheckCircle}
                    trend="Completed"
                    trendColor="text-purple-400"
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                    border="border-purple-500/20"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" /> Revenue Analytics
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E23744" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#E23744" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '12px', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#E23744" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-2xl shadow-xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Package size={18} className="text-blue-500" /> Order Activity
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff10' }}
                                    contentStyle={{ backgroundColor: '#18181b', color: '#fff', borderRadius: '12px', border: '1px solid #333' }}
                                />
                                <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Orders Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-white">Recent Orders</h2>

                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search orders..."
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

function StatCard({ title, value, icon: Icon, trend, color, bg, border, trendColor }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={80} />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${bg} ${border} border`}>
                    <Icon className={color} size={24} />
                </div>
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full bg-white/5 border border-white/5 ${trendColor || 'text-green-400'}`}>
                    {trend} <ArrowUpRight size={12} className="ml-1" />
                </span>
            </div>

            <div className="relative z-10">
                <p className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</p>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            </div>
        </motion.div>
    );
}
