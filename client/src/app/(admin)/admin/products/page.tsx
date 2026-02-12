"use client";

import React, { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api/auth";
import { Loader2, Plus, Edit, Trash2, X, Check, Image as ImageIcon, UtensilsCrossed, Leaf, Drumstick } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        category: "Main Course",
        image: "",
        isVeg: true,
        rating: 4.5
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await getProducts();
            if (res.success) {
                setProducts(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: any) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category || "Main Course",
                image: product.image,
                isVeg: product.isVeg,
                rating: product.rating || 4.5
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                description: "",
                price: 0,
                category: "Main Course",
                image: "",
                isVeg: true,
                rating: 4.5
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            if (editingProduct) {
                await updateProduct(editingProduct._id, formData, token);
                alert("Product updated successfully!");
            } else {
                await createProduct(formData, token);
                alert("Product created successfully!");
            }

            setIsModalOpen(false);
            fetchProducts();
        } catch (error: any) {
            alert("Operation failed: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                await deleteProduct(id, token);
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete product");
            }
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
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Menu Items</h1>
                    <p className="text-gray-400 mt-1">Manage your restaurant's menu offerings.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Add New Item
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {products.map((product) => (
                    <div key={product._id} className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-colors">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={product.image || "https://via.placeholder.com/300?text=No+Image"}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
                                ₹{product.price}
                            </div>
                            <div className={cn("absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md",
                                product.isVeg ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                            )}>
                                {product.isVeg ? (
                                    <span className="flex items-center gap-1"><Leaf size={10} /> VEG</span>
                                ) : (
                                    <span className="flex items-center gap-1"><Drumstick size={10} /> NON-VEG</span>
                                )}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="mb-2">
                                <span className="text-xs text-primary font-medium tracking-wider uppercase">{product.category}</span>
                                <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>

                            <div className="flex gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => handleOpenModal(product)}
                                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#18181b] border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <UtensilsCrossed className="text-primary" /> {editingProduct ? 'Edit Item' : 'Add New Item'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                                placeholder="e.g. Butter Chicken"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            >
                                                <option>Starter</option>
                                                <option>Main Course</option>
                                                <option>Breads</option>
                                                <option>Dessert</option>
                                                <option>Beverage</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                                className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1">Image URL</label>
                                            <div className="relative">
                                                <ImageIcon className="absolute left-3 top-3.5 text-gray-500" size={16} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.image}
                                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            {// Preview
                                                formData.image && (
                                                    <div className="mt-2 h-24 w-full rounded-lg overflow-hidden border border-white/5 bg-black/20">
                                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                        </div>

                                        <div className="flex items-center gap-4 pt-2">
                                            <label className="flex items-center gap-2 cursor-pointer bg-zinc-800 px-4 py-2 rounded-lg border border-white/5 hover:bg-zinc-700 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isVeg}
                                                    onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                                                    className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium">Vegetarian</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none h-24"
                                        placeholder="Describe the dish..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check size={18} /> {editingProduct ? 'Update Item' : 'Create Item'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
