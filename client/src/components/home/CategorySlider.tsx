"use client";
import React from 'react';
import { motion } from 'framer-motion';

const categories = [
    { id: 1, name: 'Biryani', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=300&auto=format&fit=crop' },
    { id: 2, name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop' },
    { id: 3, name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop' },
    { id: 4, name: 'Rolls', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=300&auto=format&fit=crop' },
    { id: 5, name: 'North Indian', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=300&auto=format&fit=crop' },
    { id: 6, name: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=300&auto=format&fit=crop' },
    { id: 7, name: 'Dessert', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=300&auto=format&fit=crop' },
    { id: 8, name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop' },
    { id: 9, name: 'Pasta', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=300&auto=format&fit=crop' },
];

export default function CategorySlider() {
    return (
        <section className="py-12 border-b border-white/5 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                        What's on your mind?
                    </h2>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">←</button>
                        <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">→</button>
                    </div>
                </div>

                <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="flex-shrink-0 group cursor-pointer text-center"
                        >
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 relative mb-3">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <p className="text-zinc-400 font-medium group-hover:text-white transition-colors">{cat.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
