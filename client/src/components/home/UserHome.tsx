"use client";
import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { motion } from 'framer-motion';
import { Search, Star, Clock, Tag, TrendingUp, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import CategorySlider from "@/components/home/CategorySlider";
import MenuGrid from "@/components/home/MenuGrid";
import Footer from "@/components/common/Footer";
import ChatBot from "@/components/features/ChatBot";

export default function UserHome() {
    const { user } = useAuth();
    const currentTime = new Date();
    const hours = currentTime.getHours();

    let greeting = 'Good Morning';
    if (hours >= 12 && hours < 17) greeting = 'Good Afternoon';
    if (hours >= 17) greeting = 'Good Evening';

    // Mock Data for UI
    const recentOrders = [
        { id: 1, name: 'Chicken Biryani', image: 'https://images.unsplash.com/photo-1563245372-f21727e5a3c6?q=80&w=200&auto=format&fit=crop', price: '₹299', date: 'Yesterday' },
        { id: 2, name: 'Paneer Roll', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=200&auto=format&fit=crop', price: '₹149', date: '2 days ago' },
    ];

    const offers = [
        { id: 1, code: 'DESI50', title: '50% OFF', desc: 'On your first biryani order', color: 'from-orange-500 to-red-600' },
        { id: 2, code: 'FREEDEL', title: 'Free Delivery', desc: 'On orders above ₹499', color: 'from-blue-500 to-purple-600' },
        { id: 3, code: 'SWEET10', title: 'Free Dessert', desc: 'With every Thali', color: 'from-pink-500 to-rose-500' },
    ];

    return (
        <main className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden pt-24">

            {/* Header / Search Section */}
            <section className="container mx-auto px-4 md:px-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full lg:w-2/3"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{user?.name?.split(' ')[0] || 'Foodie'}!</span>
                        </h1>
                        <p className="text-zinc-400 text-lg mb-6 flex items-center gap-2">
                            <MapPin size={16} className="text-primary" /> Delivering to: <span className="text-white font-medium border-b border-dashed border-zinc-600">Home • Sasaram</span>
                        </p>

                        {/* Search Bar */}
                        <div className="relative group max-w-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                            <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                                <Search className="ml-4 text-zinc-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search for 'Butter Chicken' or 'Paneer'..."
                                    className="w-full bg-transparent text-white px-4 py-4 focus:outline-none placeholder:text-zinc-500"
                                />
                                <div className="pr-2">
                                    <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white rounded-lg h-9">
                                        Search
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Loyalty Card / Balance */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="w-full lg:w-1/3"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 p-6 shadow-2xl group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={100} />
                            </div>
                            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Desi Rewards</p>
                                        <h3 className="text-2xl font-bold text-white mt-1">Gold Member</h3>
                                    </div>
                                    <div className="bg-yellow-500/20 text-yellow-500 p-2 rounded-lg">
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-zinc-400 text-sm mb-1">Available Points</p>
                                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                                        2,450
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-2">Worth ₹245.00</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Special Offers Scroll */}
            <section className="container mx-auto px-4 md:px-6 mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="text-primary" size={20} />
                    <h2 className="text-xl font-bold text-white">Specially For You</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {offers.map((offer) => (
                        <motion.div
                            key={offer.id}
                            whileHover={{ scale: 1.02 }}
                            className={`min-w-[280px] md:min-w-[320px] snap-center p-5 rounded-2xl bg-gradient-to-r ${offer.color} relative overflow-hidden shadow-lg cursor-pointer`}
                        >
                            <div className="relative z-10 text-white">
                                <p className="font-medium opacity-90 text-sm mb-1">Use Code: {offer.code}</p>
                                <h3 className="text-2xl font-bold mb-1">{offer.title}</h3>
                                <p className="text-xs opacity-80">{offer.desc}</p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 bg-white/20 w-24 h-24 rounded-full blur-xl" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recent Orders / Buy Again */}
            <section className="container mx-auto px-4 md:px-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="text-primary" size={20} />
                        <h2 className="text-xl font-bold text-white">Order Again</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentOrders.map((item) => (
                        <div key={item.id} className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors group cursor-pointer">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{item.name}</h4>
                                <div className="flex items-center text-xs text-zinc-400 mt-1 gap-2">
                                    <span>{item.price}</span>
                                    <span>•</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
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
