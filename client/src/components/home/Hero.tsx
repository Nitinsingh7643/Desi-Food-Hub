"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] pt-32 pb-20 overflow-hidden flex items-center">
            {/* Background with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />

                {/* Animated Blobs */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 lg:flex items-center justify-between gap-12">
                {/* Left Content */}
                <div className="lg:w-1/2 text-center lg:text-left space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-orange-400 text-xs font-medium uppercase tracking-wider"
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        DESI FOOD HUB EXCLUSIVE
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground leading-[1.1]"
                    >
                        Authentic Desi Flavors<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FC8019] to-pink-500">
                            Delivered Hot.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0"
                    >
                        Experience the finest Indian cuisine from **Desi Food Hub**. From spicy Biryanis to creamy curries, satisfy your cravings with our exclusive menu.
                    </motion.p>

                    {/* Search Box - Contextual to 'Our Menu' */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Button className="h-14 rounded-xl px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-lg shadow-primary/20">
                            Order Now
                        </Button>
                        <Button variant="outline" className="h-14 rounded-xl px-8 text-lg border-input hover:bg-secondary text-foreground">
                            View Menu
                        </Button>
                    </div>


                    <div className="flex items-center gap-6 justify-center lg:justify-start text-sm text-zinc-500 pt-4">
                        <div className="flex items-center gap-2"><span className="text-green-500 font-bold">4.9 ★</span> Rating</div>
                        <div className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <div className="flex items-center gap-2">10k+ Happy Customers</div>
                    </div>
                </div>

                {/* Right Content - Floating Food Cards */}
                <div className="lg:w-1/2 relative hidden lg:block h-[600px]">
                    {/* Main Dish */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="absolute top-10 right-10 w-[420px] z-20"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                            <img
                                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop"
                                alt="Pizza"
                                className="relative rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/3] border-4 border-white/5"
                            />

                            {/* Float Card */}
                            <div className="absolute -bottom-6 -left-10 bg-card/80 backdrop-blur-xl p-4 rounded-2xl border border-border shadow-xl flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-white">
                                    <img src="/logo.png" className="w-full h-full object-cover" alt="DFH" />
                                    {/* Placeholder for Desi Food Hub Logo if available, else generic */}
                                </div>
                                <div>
                                    <p className="text-foreground font-bold text-sm">Special Thali</p>
                                    <p className="text-muted-foreground text-xs">Best Seller</p>
                                </div>
                                <div className="text-green-500 font-bold text-sm">₹299</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Second Dish */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="absolute bottom-20 left-10 w-[280px] z-10"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=800&auto=format&fit=crop"
                            alt="Biryani"
                            className="rounded-[2rem] shadow-2xl w-full object-cover aspect-square border-4 border-white/5 grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
