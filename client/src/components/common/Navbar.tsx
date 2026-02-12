"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, MapPin, ChevronDown, User, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hide Navbar on Login/Signup and Admin pages
    if (pathname === "/login" || pathname === "/signup" || pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) return null;

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                    scrolled ? "bg-background/80 backdrop-blur-lg border-border py-3 shadow-sm" : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

                    {/* Logo Section */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                <span className="text-2xl">🥣</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground leading-none">Desi Food</h1>
                                <span className="text-xs text-muted-foreground tracking-widest font-medium">HUB</span>
                            </div>
                        </Link>

                        {/* Location Selector (Hidden on mobile) */}
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-l border-border pl-6">
                            <MapPin size={16} className="text-primary" />
                            <span className="border-b border-dashed border-zinc-600 hover:border-primary">Sasaram, Bihar</span>
                            <ChevronDown size={14} />
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {user?.role !== 'admin' && [
                            { name: 'Home', href: '/' },
                            { name: 'Offers', href: '/offers' },
                            { name: 'Menu', href: '/menu' },
                            { name: 'About', href: '/about' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-secondary/50 px-3 py-2 rounded-lg"
                            >
                                {item.name}
                            </Link>
                        ))}

                        {user?.role !== 'admin' && (
                            <Link
                                href="/orders"
                                className="group relative px-4 py-2 rounded-full overflow-hidden bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                            >
                                <span className="relative z-10 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                                    <ShoppingBag size={14} />
                                    Track Order
                                </span>
                            </Link>
                        )}

                        {user?.role === 'admin' && (
                            <Link
                                href="/dashboard"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 text-sm font-bold flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    Admin Panel
                                </motion.div>
                            </Link>
                        )}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </Button>

                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full hidden sm:flex">
                            <Search size={20} />
                        </Button>

                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-white/10 rounded-full relative">
                                <ShoppingBag size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
                                <Link href="/profile">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="hidden sm:flex items-center gap-3 bg-white/5 hover:bg-white/10 pr-4 pl-1 py-1 rounded-full border border-white/10 cursor-pointer transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-md">
                                            <span className="font-bold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <span className="text-sm font-medium text-foreground max-w-[100px] truncate">{user?.name}</span>
                                    </motion.div>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={logout}
                                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </Button>
                            </div>
                        ) : (
                            <Link href="/login">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button className="hidden sm:flex bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-500/25 border-0 rounded-full px-6 py-5 font-bold tracking-wide">
                                        <User size={18} className="mr-2" />
                                        Sign In
                                    </Button>
                                </motion.div>
                            </Link>
                        )}

                        <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground">
                            <Menu size={24} />
                        </Button>
                    </div>
                </div>
            </motion.header>
        </>
    );
}
