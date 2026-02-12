"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Loader2, Package, ChevronRight, Clock, MapPin, CheckCircle, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Status Badge Helper
const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'placed': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
        case 'preparing': return "bg-orange-500/10 text-orange-500 border-orange-500/20";
        case 'out_for_delivery': return "bg-purple-500/10 text-purple-500 border-purple-500/20";
        case 'delivered': return "bg-green-500/10 text-green-500 border-green-500/20";
        case 'cancelled': return "bg-red-500/10 text-red-500 border-red-500/20";
        default: return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
};

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'placed': return <Package size={16} />;
        case 'preparing': return <Clock size={16} />;
        case 'out_for_delivery': return <Truck size={16} />;
        case 'delivered': return <CheckCircle size={16} />;
        case 'cancelled': return <XCircle size={16} />;
        default: return <Package size={16} />;
    }
};

export default function MyOrdersPage() {
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await getMyOrders(token);
                if (response.success) {
                    setOrders(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mb-6 text-muted-foreground">
                    <Package size={48} />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">No Past Orders</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    You haven't placed any orders yet. Hungry? Explore our menu and find something delicious!
                </p>
                <Link href="/">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 h-12">
                        Start Ordering
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

                <div className="space-y-6">
                    {orders.map((order, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={order._id}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                                {/* Left: Order Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider", getStatusColor(order.status))}>
                                            {getStatusIcon(order.status)}
                                            {order.status.replace(/_/g, " ")}
                                        </div>
                                        <span className="text-zinc-500 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {order.items.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                                                <span className="font-bold text-primary">{item.quantity}x</span>
                                                <span>{item.name}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                        <MapPin size={14} />
                                        <span className="truncate max-w-md">{order.shippingAddress}</span>
                                    </div>
                                </div>

                                {/* Right: Total & Actions */}
                                <div className="flex flex-row md:flex-col justify-between items-end gap-4 min-w-[150px] border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Total Amount</p>
                                        <p className="text-xl font-bold text-foreground">₹{order.totalAmount}</p>
                                    </div>

                                    <Button variant="outline" className="text-sm border-input hover:bg-secondary text-foreground">
                                        Details <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
