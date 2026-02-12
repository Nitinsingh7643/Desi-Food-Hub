import React from 'react';
import { Star, Heart, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

interface RestaurantProps {
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    priceForTwo: string;
    cuisine: string;
    offer?: string;
}

export default function RestaurantCard({ data, index }: { data: RestaurantProps; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-[#18181b] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 border border-white/5 hover:border-white/10"
        >
            {/* Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {/* Offer Badge */}
                {data.offer && (
                    <div className="absolute bottom-4 left-4 bg-blue-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Percent size={12} fill="currentColor" /> {data.offer}
                    </div>
                )}

                {/* Favorite Button */}
                <button className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/60 transition-all">
                    <Heart size={18} />
                </button>
            </div>

            {/* Content Section */}
            <div className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
                        {data.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-800 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                        {data.rating} <Star size={10} fill="currentColor" />
                    </div>
                </div>

                <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                        {data.deliveryTime}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span>{data.priceForTwo}</span>
                </div>

                <div className="text-xs text-zinc-500 truncate border-t border-white/5 pt-3 mt-2">
                    {data.cuisine}
                </div>
            </div>
        </motion.div>
    );
}
