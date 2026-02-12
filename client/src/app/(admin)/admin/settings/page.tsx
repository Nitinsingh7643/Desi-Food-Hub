"use client";

import React, { useState } from "react";
import { Settings, Bell, Lock, User, Palette, Save, Moon, Sun, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
    const { user } = useAuth();
    const { accentColor, setAccentColor } = useTheme();

    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    // Password State
    const [passData, setPassData] = useState({ current: "", new: "", confirm: "" });

    // Notification State
    const [notifs, setNotifs] = useState({ email: true, push: true, promo: false });

    // Handle Save
    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        alert("Settings saved successfully!");
    };

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: Palette },
    ];

    return (
        <div className="min-h-screen bg-[#09090b] text-white p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Settings</h1>
                <p className="text-gray-400 mt-1">Manage your preferences and account details.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "hover:bg-white/5 text-gray-400 hover:text-white"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 lg:p-8 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6 max-w-xl">
                                    <h2 className="text-xl font-bold border-b border-white/5 pb-4">Personal Information</h2>
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold">
                                            {user?.name?.[0] || "A"}
                                        </div>
                                        <div>
                                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">Change Avatar</Button>
                                            <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size 800K</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400">Full Name</label>
                                            <Input
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                className="bg-black/20 border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400">Phone</label>
                                            <Input
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="bg-black/20 border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-medium text-gray-400">Email Address (Read-Only)</label>
                                            <Input
                                                value={profileData.email}
                                                disabled
                                                className="bg-black/40 border-white/5 text-gray-500 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={handleSave} disabled={isLoading} className="mt-4 bg-primary text-white hover:bg-primary/90">
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="space-y-6 max-w-xl">
                                    <h2 className="text-xl font-bold border-b border-white/5 pb-4">Security Settings</h2>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400">Current Password</label>
                                            <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400">New Password</label>
                                            <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400">Confirm New Password</label>
                                            <Input type="password" placeholder="••••••••" className="bg-black/20 border-white/10" />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                                            <Lock size={16} className="text-primary" /> Two-Factor Authentication
                                        </h3>
                                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                            <div>
                                                <p className="font-medium">Enable 2FA</p>
                                                <p className="text-xs text-gray-400">Add an extra layer of security to your account.</p>
                                            </div>
                                            <Button variant="outline" className="text-primary border-primary/20 bg-primary/10">Enable</Button>
                                        </div>
                                    </div>

                                    <Button onClick={handleSave} disabled={isLoading} className="mt-4 bg-primary text-white hover:bg-primary/90">
                                        Update Password
                                    </Button>
                                </div>
                            )}

                            {/* NOTIFICATIONS TAB */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-6 max-w-xl">
                                    <h2 className="text-xl font-bold border-b border-white/5 pb-4">Notification Preferences</h2>

                                    <div className="space-y-4">
                                        {[
                                            { id: 'email', label: 'Email Notifications', desc: 'Receive daily summaries and critical alerts.' },
                                            { id: 'push', label: 'Push Notifications', desc: 'Get real-time updates on new orders.' },
                                            { id: 'promo', label: 'Marketing Emails', desc: 'Receive updates about new features and promotions.' },
                                        ].map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                                                <div>
                                                    <p className="font-medium">{item.label}</p>
                                                    <p className="text-xs text-gray-400">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={(notifs as any)[item.id]}
                                                        onChange={() => setNotifs({ ...notifs, [item.id]: !(notifs as any)[item.id] })}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <Button onClick={handleSave} disabled={isLoading} className="mt-4 bg-primary text-white hover:bg-primary/90">
                                        Save Preferences
                                    </Button>
                                </div>
                            )}

                            {/* APPEARANCE TAB */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-6 max-w-xl">
                                    <h2 className="text-xl font-bold border-b border-white/5 pb-4">Theme & Appearance</h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border-2 border-primary bg-zinc-800 flex flex-col items-center gap-2 cursor-pointer relative overflow-hidden">
                                            <div className="absolute top-2 right-2 text-primary"><CheckCircle size={16} /></div>
                                            <Moon size={32} className="text-white" />
                                            <span className="font-medium">Dark Mode</span>
                                        </div>
                                        <div className="p-4 rounded-xl border border-white/10 bg-zinc-800 opacity-50 flex flex-col items-center gap-2 cursor-not-allowed">
                                            <Sun size={32} className="text-gray-400" />
                                            <span className="font-medium text-gray-400">Light Mode (Pro)</span>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <h3 className="text-sm font-bold mb-4">Accent Color</h3>
                                        <div className="flex gap-4">
                                            {(['orange', 'blue', 'green', 'purple', 'red'] as const).map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setAccentColor(color)}
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${accentColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#09090b]' : ''}`}
                                                    style={{ backgroundColor: color === 'orange' ? '#ff6b00' : color }}
                                                >
                                                    {accentColor === color && <CheckCircle size={20} className="text-white drop-shadow-md" />}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-4">Select a primary color for your dashboard.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
