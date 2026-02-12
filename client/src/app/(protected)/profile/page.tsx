"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, MapPin, Package, Camera, Save, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { updateUserDetails, updateUserPassword } from "@/lib/api/auth";

export default function ProfilePage() {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Profile Form User State
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: ""
    });

    // Password Form State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                avatar: user.avatar || ""
            });
        }
    }, [user]);

    const [isLocating, setIsLocating] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Not authenticated");

            const updatedUser = await updateUserDetails(profileData, token);
            // Update context
            login(token, updatedUser.data);
            setMessage({ type: 'success', text: "Profile updated successfully!" });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.error || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setMessage({ type: 'error', text: "Geolocation is not supported by your browser." });
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Reverse geocoding using OpenStreetMap (Free, no key needed)
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();

                if (data && data.display_name) {
                    setProfileData(prev => ({ ...prev, address: data.display_name }));
                    setMessage({ type: 'success', text: "Location fetched successfully!" });
                } else {
                    throw new Error("Address not found");
                }
            } catch (error) {
                console.error(error);
                setMessage({ type: 'error', text: "Failed to fetch address details. Please enter manually." });
                // Fallback to coordinates
                setProfileData(prev => ({ ...prev, address: `Lat: ${latitude}, Long: ${longitude}` }));
            } finally {
                setIsLocating(false);
            }
        }, (error) => {
            console.error(error);
            setMessage({ type: 'error', text: "Unable to retrieve your location. Check permissions." });
            setIsLocating(false);
        });
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: "New passwords do not match" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Not authenticated");

            await updateUserPassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, token);

            setMessage({ type: 'success', text: "Password updated successfully!" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || "Failed to update password" });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "password", label: "Security", icon: Lock },
        { id: "orders", label: "My Orders", icon: Package },
        // { id: "address", label: "Address Book", icon: MapPin },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-5xl mx-auto"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                    <p className="text-zinc-400 mb-8">Manage your profile, security, and preferences.</p>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Tabs */}
                        <div className="lg:w-64 flex-shrink-0 space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
                            {/* Status Message */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={`absolute top-0 left-0 right-0 p-4 flex items-center justify-center gap-2 text-sm font-medium z-10 ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                            }`}
                                    >
                                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        {/* Avatar Section */}
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 overflow-hidden">
                                                    <img
                                                        src={profileData.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white shadow-lg hover:bg-orange-600 transition-colors"
                                                    title="Change Avatar"
                                                >
                                                    <Camera size={14} />
                                                </button>
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">Profile Photo</p>
                                                <p className="text-sm text-zinc-500 mb-2">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Image URL"
                                                        value={profileData.avatar}
                                                        onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                                                        className="h-8 text-xs max-w-[300px]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                                                <Input
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="bg-black/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-400">Email Address</label>
                                                <Input
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    className="bg-black/20"
                                                    disabled // Email usually hard to change without verification
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-zinc-400">Phone Number</label>
                                                <Input
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    placeholder="+91 99999 99999"
                                                    className="bg-black/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-sm font-medium text-zinc-400">Delivery Address</label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleUseCurrentLocation}
                                                    disabled={isLocating}
                                                    className="h-6 text-xs text-primary hover:text-orange-400 hover:bg-white/5 px-2"
                                                >
                                                    {isLocating ? <Loader2 className="animate-spin mr-1" size={12} /> : <MapPin size={12} className="mr-1" />}
                                                    Use Current Location
                                                </Button>
                                            </div>
                                            <textarea
                                                className="flex w-full rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-sm text-white shadow-sm ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                                placeholder="Enter your full delivery address..."
                                                value={profileData.address}
                                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="bg-primary hover:bg-orange-600 text-white px-8" disabled={loading}>
                                                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                                                Save Changes
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Password Tab */}
                            {activeTab === "password" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
                                    <p className="text-zinc-400 text-sm mb-6">Ensure your account is using a long, random password to stay secure.</p>

                                    <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-lg">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-zinc-500" size={16} />
                                                <Input
                                                    type="password"
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    className="pl-10 bg-black/20"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-zinc-500" size={16} />
                                                <Input
                                                    type="password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    className="pl-10 bg-black/20"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-400">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-zinc-500" size={16} />
                                                <Input
                                                    type="password"
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    className="pl-10 bg-black/20"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="bg-primary hover:bg-orange-600 text-white px-8" disabled={loading}>
                                                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                                                Update Password
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === "orders" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center py-20"
                                >
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package size={32} className="text-zinc-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
                                    <p className="text-zinc-500 max-w-sm mx-auto mb-6">Go ahead and explore our delicious menu to make your first order!</p>
                                    <Button className="bg-primary hover:bg-orange-600 text-white">
                                        Browse Menu
                                    </Button>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
