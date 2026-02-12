"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { registerUser } from "@/lib/api/auth";
import { motion } from "framer-motion";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await registerUser(formData);
            if (data.success) {
                localStorage.setItem("token", data.token);
                router.push("/");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-black text-white overflow-hidden">
            {/* Left Side - Visuals (Order reversed on mobile, but here kept same structure as login for consistency or maybe flipped?) 
                Let's flip it for variety? No, consistency is better for UX usually. 
                Actually, let's keep the form on the Right and Visual on the Left to match Login, creates a solid brand feel.
            */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                <div className="relative z-10 w-full h-full flex flex-col justify-between p-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-3xl font-bold tracking-tighter text-white">
                            Desi Food Hub<span className="text-primary text-4xl">.</span>
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-4 max-w-lg"
                    >
                        <h2 className="text-5xl font-bold leading-tight">
                            Join the <span className="text-primary">Feast</span>.
                        </h2>
                        <p className="text-lg text-zinc-400">
                            Create an account to unlock exclusive offers, track your orders, and save your favorite meals.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                {/* Mobile Background Blob */}
                <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none lg:hidden" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md space-y-8 relative z-10"
                >
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                        <p className="text-zinc-400">Enter your details and start your journey with us.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-500 text-sm flex items-center gap-2"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="pl-10 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-10 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="pl-10 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 bg-primary hover:bg-orange-600 text-white rounded-xl text-base font-semibold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : "Create Account"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-zinc-500">Or join with</span></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" variant="outline" className="h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-xl">Google</Button>
                            <Button type="button" variant="outline" className="h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-xl">Github</Button>
                        </div>
                    </form>

                    <p className="text-center text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:text-orange-400 transition-colors inline-flex items-center gap-1 group">
                            Sign in
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </motion.div>

                <Link href="/" className="absolute top-8 right-8 lg:top-12 lg:right-12 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
