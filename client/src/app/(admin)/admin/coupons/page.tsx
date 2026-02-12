"use client";

import React, { useEffect, useState } from "react";
import { getAllCoupons, createCoupon, deleteCoupon, toggleCouponStatus } from "@/lib/api/coupons";
import { Loader2, Plus, Trash2, Ticket, Check, X, Calendar, ToggleLeft, ToggleRight, Percent, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function AdminCouponsPage() {
    const { isAuthenticated } = useAuth();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        minOrderValue: 0,
        maxDiscount: 0,
        validUntil: "",
        usageLimit: 100
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchCoupons();
        }
    }, [isAuthenticated]);

    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const res = await getAllCoupons(token);
                if (res.success) {
                    setCoupons(res.data);
                }
            }
        } catch (error) {
            console.error("Failed to fetch coupons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await createCoupon(formData, token);
            alert("Coupon created successfully!");
            setIsModalOpen(false);
            setFormData({
                code: "",
                discountType: "percentage",
                discountValue: 0,
                minOrderValue: 0,
                maxDiscount: 0,
                validUntil: "",
                usageLimit: 100
            });
            fetchCoupons();
        } catch (error: any) {
            alert("Failed to create coupon: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this coupon?")) {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                await deleteCoupon(id, token);
                setCoupons(prev => prev.filter(c => c._id !== id));
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    const handleToggle = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await toggleCouponStatus(id, token);
            if (res.success) {
                setCoupons(prev => prev.map(c => c._id === id ? res.data : c));
            }
        } catch (error) {
            console.error("Toggle failed", error);
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Coupons</h1>
                    <p className="text-gray-400 mt-1">Create and manage discount codes.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Create Coupon
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                {coupons.map((coupon) => (
                    <div key={coupon._id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                        {/* Background Pattern */}
                        <div className="absolute -right-6 -top-6 text-white/5 rotate-12 group-hover:rotate-45 transition-transform duration-500">
                            <Ticket size={150} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-primary tracking-wider">{coupon.code}</h3>
                                    <p className="text-sm text-gray-400 font-medium">
                                        {coupon.discountType === 'percentage'
                                            ? `${coupon.discountValue}% OFF`
                                            : `₹${coupon.discountValue} FLAT OFF`
                                        }
                                    </p>
                                </div>
                                <div className={cn("px-2 py-1 rounded-lg text-xs font-bold border", coupon.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
                                    {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <IndianRupee size={14} />
                                    Min Order: ₹{coupon.minOrderValue}
                                </div>
                                {coupon.maxDiscount > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Percent size={14} />
                                        Max Disc: ₹{coupon.maxDiscount}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    Valid until: {new Date(coupon.validUntil).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => handleToggle(coupon._id)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {coupon.isActive ? <ToggleRight className="text-green-400" /> : <ToggleLeft className="text-gray-500" />}
                                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon._id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {coupons.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No coupons found. Create one to get started!
                    </div>
                )}
            </motion.div>

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Ticket className="text-primary" /> Create New Coupon
                            </h2>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Code</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none font-mono uppercase"
                                            placeholder="WELCOME50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Valid Until</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.validUntil}
                                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Discount Type</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Value</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={formData.discountValue}
                                            onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Min Order (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.minOrderValue}
                                            onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1">Max Discount (₹)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0 for unlimited"
                                            value={formData.maxDiscount}
                                            onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                                            className="w-full px-4 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check size={18} /> Create Coupon
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
