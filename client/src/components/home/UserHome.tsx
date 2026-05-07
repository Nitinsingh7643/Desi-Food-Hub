"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Clock, Tag, TrendingUp, Sparkles, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import CategorySlider from "@/components/home/CategorySlider";
import MenuGrid from "@/components/home/MenuGrid";
import Footer from "@/components/common/Footer";
import ChatBot from "@/components/features/ChatBot";
import { getMyOrders } from '@/lib/api/auth';

export default function UserHome() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const currentTime = new Date();
    const hours = currentTime.getHours();

    let greeting = 'Good Morning';
    if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
    if (hours >= 17) greeting = 'Good Evening';

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await getMyOrders(token);
                    if (response.success) {
                        setOrders(response.data.slice(0, 3)); // Show top 3 recent orders
                    }
                } catch (error) {
                    console.error("Failed to fetch orders:", error);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };

        fetchOrders();
    }, []);

    const offers = [
        { id: 1, code: 'DESI50', title: '50% OFF', desc: 'On your first biryani order', color: 'from-orange-500 to-red-600' },
        { id: 2, code: 'FREEDEL', title: 'Free Delivery', desc: 'On orders above ₹499', color: 'from-blue-500 to-purple-600' },
        { id: 3, code: 'SWEET10', title: 'Free Dessert', desc: 'With every Thali', color: 'from-pink-500 to-rose-500' },
    ];

    return (
        <main className="flex flex-col min-h-screen text-foreground overflow-x-hidden pt-24 relative">
            
            {/* Cinematic Background Image */}
            <div className="fixed inset-0 z-[-2]">
                <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
                />
            </div>
            {/* Deep gradient overlay to ensure text readability */}
            <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-[#050505]/90 via-[#050505]/70 to-[#050505]/95 backdrop-blur-sm" />

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

            {/* Header / Search Section */}
            <section className="container mx-auto px-4 md:px-6 mb-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full lg:w-2/3"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight">
                            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-500 to-orange-500 drop-shadow-sm">{user?.name?.split(' ')[0] || 'Foodie'}</span>
                        </h1>
                        <p className="text-zinc-400 text-lg mb-8 flex items-center gap-2 font-medium">
                            <MapPin size={18} className="text-orange-500" /> Delivering to: <span className="text-zinc-200 border-b border-dashed border-zinc-600 pb-0.5">{user?.address || 'Set your location'}</span>
                        </p>

                        {/* Search Bar - Premium Glassmorphism */}
                        <div className="relative group max-w-2xl">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/30 to-purple-500/30 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                            <div className="relative flex items-center bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 group-hover:border-white/20">
                                <Search className="ml-5 text-zinc-400 group-focus-within:text-orange-400 transition-colors" size={22} />
                                <input
                                    type="text"
                                    placeholder="Craving Butter Chicken or Paneer Tikka?"
                                    className="w-full bg-transparent text-white px-5 py-5 text-lg focus:outline-none placeholder:text-zinc-600"
                                />
                                <div className="pr-3">
                                    <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-12 px-6 font-semibold backdrop-blur-md transition-all">
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Premium Loyalty Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full lg:w-1/3"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-[#151515] to-black border border-white/10 p-7 shadow-2xl group transition-all duration-500 hover:border-orange-500/30">
                            {/* Animated glowing border effect inner */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] transform rotate-12 group-hover:scale-110 transition-transform duration-700">
                                <Sparkles size={160} />
                            </div>
                            
                            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-1">Desi Rewards</p>
                                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                            {(user as any)?.points > 5000 ? 'Platinum' : (user as any)?.points > 1000 ? 'Gold' : 'Silver'} Member
                                        </h3>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 text-yellow-500 p-2.5 rounded-xl border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                                        <Star size={22} fill="currentColor" />
                                    </div>
                                </div>
                                
                                <div className="pt-2 border-t border-white/5">
                                    <p className="text-zinc-400 text-sm mb-1 font-medium">Available Balance</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-500 drop-shadow-sm tracking-tight">
                                            {(user as any)?.points?.toLocaleString() || '0'}
                                        </p>
                                        <span className="text-zinc-500 font-medium">pts</span>
                                    </div>
                                    <p className="text-sm text-zinc-500 mt-2 font-medium">Worth <span className="text-zinc-300">₹{((user as any)?.points || 0) / 10}.00</span></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Special Offers Scroll - Modernized */}
            <section className="container mx-auto px-4 md:px-6 mb-16 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                        <Tag size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Specially For You</h2>
                </div>
                
                <div className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-hide snap-x -mx-4 px-4 md:mx-0 md:px-0">
                    {offers.map((offer, index) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="min-w-[300px] md:min-w-[340px] snap-center p-6 rounded-3xl relative overflow-hidden shadow-2xl cursor-pointer border border-white/10 group"
                        >
                            {/* Glass background replacing flat gradients */}
                            <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-xl z-0" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300 z-0`} />
                            
                            <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                                <div className="inline-flex items-center self-start px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md">
                                    <p className="font-semibold text-white/90 text-xs tracking-wide">CODE: {offer.code}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{offer.title}</h3>
                                    <p className="text-sm text-zinc-400 font-medium leading-relaxed">{offer.desc}</p>
                                </div>
                            </div>
                            
                            {/* Decorative elements */}
                            <div className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-gradient-to-br ${offer.color} opacity-30 blur-2xl group-hover:blur-3xl transition-all duration-500`} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recent Orders - Premium List */}
            <section className="container mx-auto px-4 md:px-6 mb-12 relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800/80 rounded-lg text-white/90 border border-white/5">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Order Again</h2>
                    </div>
                    <Button variant="ghost" className="text-zinc-400 hover:text-white font-medium">View All</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {loadingOrders ? (
                        <div className="col-span-full flex items-center justify-center py-12 text-zinc-500 gap-3 bg-zinc-900/30 rounded-3xl border border-white/5">
                            <Loader2 className="animate-spin text-orange-500" size={24} />
                            <span className="font-medium">Fetching your history...</span>
                        </div>
                    ) : orders.length > 0 ? (
                        orders.map((item, i) => (
                            <motion.div 
                                key={item._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="bg-[#111] backdrop-blur-sm border border-white/5 p-4 rounded-3xl flex items-center gap-5 hover:bg-white/[0.03] hover:border-white/10 hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center overflow-hidden shadow-inner relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                    <img
                                        src={item.orderItems[0]?.image || 'https://via.placeholder.com/150'}
                                        alt={item.orderItems[0]?.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors line-clamp-1 tracking-tight">
                                        {item.orderItems[0]?.name} {item.orderItems.length > 1 && <span className="text-zinc-500 text-sm">+{item.orderItems.length - 1}</span>}
                                    </h4>
                                    <div className="flex items-center text-sm text-zinc-500 mt-1.5 gap-2 font-medium">
                                        <span className="text-zinc-300">₹{item.totalPrice}</span>
                                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <span className="capitalize">{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-white/5 group-hover:bg-orange-500 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm border border-white/5">
                                    <ArrowRight size={18} />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full bg-[#111]/50 border border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-zinc-500">
                                <Search size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No recent orders yet</h3>
                            <p className="text-zinc-500">Time to explore our delicious menu and change that!</p>
                        </div>
                    )}
                </div>
            </section>

            <CategorySlider />

            {/* Trending Menu Section */}
            <div className="py-8">
                <MenuGrid />
            </div>

            <Footer />
            <ChatBot />
        </main>
    );
}
