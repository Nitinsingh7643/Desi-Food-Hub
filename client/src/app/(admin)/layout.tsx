"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, UtensilsCrossed, Menu as MenuIcon, Ticket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Menu Items', href: '/admin/products', icon: UtensilsCrossed },
        { name: 'Customers', href: '/admin/users', icon: Users },
        { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#09090b] flex text-white font-sans">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-[#09090b] border-r border-white/5 transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="h-20 flex items-center justify-center border-b border-white/5">
                        {sidebarOpen ? (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                    <span className="text-lg">🥣</span>
                                </div>
                                <h1 className="text-lg font-bold tracking-wider">ADMIN<span className="text-primary">PANEL</span></h1>
                            </div>
                        ) : (
                            <span className="text-2xl">🥣</span>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-8 px-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link key={item.href} href={item.href}>
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <Icon size={20} className={cn(!sidebarOpen && "mx-auto")} />
                                        {sidebarOpen && <span className="font-medium">{item.name}</span>}

                                        {isActive && sidebarOpen && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={logout}
                            className={cn(
                                "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors",
                                !sidebarOpen && "justify-center"
                            )}
                        >
                            <LogOut size={20} />
                            {sidebarOpen && <span className="font-medium">Logout</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className={cn("flex-1 flex flex-col transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
                {/* Admin Header */}
                <header className="h-20 bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <MenuIcon size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white">Admin User</p>
                                <p className="text-xs text-primary">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 ring-2 ring-black">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
