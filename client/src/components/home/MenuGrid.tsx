"use client";
import React, { useState, useEffect } from 'react';
import { Filter, Star, Heart, Percent, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProducts } from '@/lib/api/auth';
import { useCart } from "@/context/CartContext";

const categories = ["All", "Biryani", "Curries", "Starters", "Chinese", "Breads", "Desserts"];

export default function MenuGrid() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredItems = activeCategory === "All"
        ? products
        : products.filter(item => item.category === activeCategory);

    return (
        <section className="py-16 bg-background relative" id="menu">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Curated For You
                        </h2>
                        <p className="text-muted-foreground">Explore our finest selection of dishes.</p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategory === cat
                                    ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-orange-500/20'
                                    : 'bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                {loading ? (
                    <div className="text-center w-full py-20 flex justify-center">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item, idx) => (
                            <MenuItemCard key={item._id} data={item} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function MenuItemCard({ data, index }: { data: any; index: number }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(data);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {data.isBestseller && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                            BESTSELLER
                        </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-md ${data.isVeg ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {data.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                </div>

                <button className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-red-500 hover:bg-black/60 transition-all">
                    <Heart size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {data.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-green-900/50 text-green-400 text-xs px-1.5 py-0.5 rounded border border-green-800">
                        {data.rating} <Star size={10} fill="currentColor" />
                    </div>
                </div>

                <p className="text-muted-foreground text-xs line-clamp-2 mb-4 flex-grow">
                    {data.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-lg font-bold text-foreground">₹{data.price}</span>
                    <button
                        onClick={handleAddToCart}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${added
                            ? "bg-green-600 text-white shadow-md shadow-green-500/20"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                            }`}
                    >
                        {added ? "ADDED" : "ADD"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
