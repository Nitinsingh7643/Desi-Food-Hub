"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Mail, Lock, Loader2, ArrowRight, Phone } from "lucide-react";
import { loginUser, googleLogin } from "@/lib/api/auth";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Auth Mode State
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

    // Email/Password State
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Phone Auth State
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [status, setStatus] = useState("");

    // Setup Recaptcha
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initRecaptcha = () => {
            const container = document.getElementById('recaptcha-container');
            if (container) {
                // Clear existing instance if any (handles React Strict Mode or navigation)
                if (window.recaptchaVerifier) {
                    try {
                        window.recaptchaVerifier.clear();
                    } catch (e) {
                        // ignore if already cleared
                    }
                    window.recaptchaVerifier = null;
                }

                try {
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        'size': 'normal', // Changed to normal for visibility
                        'callback': (response: any) => {
                            console.log("Recaptcha Solved");
                            setStatus("Captcha Verified. Ready to send.");
                        },
                        'expired-callback': () => {
                            setStatus("Captcha Expired. Please refresh.");
                        }
                    });
                    window.recaptchaVerifier.render(); // Explicitly render
                } catch (err) {
                    console.error("Recaptcha Init Error", err);
                }
            }
        };

        // Initialize with a small delay to ensure DOM is ready
        const timer = setTimeout(initRecaptcha, 100);

        // Cleanup
        return () => {
            clearTimeout(timer);
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                } catch (e) { }
                window.recaptchaVerifier = null;
            }
        };
    }, [authMethod, confirmationResult]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.type]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);
            if (data.success) {
                login(data.token, data.user);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();

            // Send to backend
            const data = await googleLogin(token);
            if (data.success) {
                login(data.token, data.user);
            }
        } catch (error: any) {
            console.error(error);
            setError(`Google Sign In Failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!window.recaptchaVerifier) {
                throw new Error("Recaptcha not ready. Please refresh the page.");
            }

            const appVerifier = window.recaptchaVerifier;

            // formatting
            const cleanInput = phoneNumber.replace(/[\s\-\(\)]/g, '');
            const formattedPhone = cleanInput.startsWith('+')
                ? cleanInput
                : (cleanInput.length === 10 ? `+91${cleanInput}` : `+${cleanInput}`);

            console.log("Sending OTP to:", formattedPhone);
            setStatus("Sending SMS...");

            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
            setStatus("OTP Sent!");
            setConfirmationResult(confirmation);

        } catch (error: any) {
            console.error("OTP Error:", error);
            let msg = "Failed to send OTP.";
            if (error.code === 'auth/invalid-phone-number') msg = "Invalid phone number format.";
            if (error.code === 'auth/quota-exceeded') msg = "SMS quota exceeded. Try later.";
            if (error.code === 'auth/captcha-check-failed') msg = "Captcha check failed. Refresh page.";

            setError(msg + " " + (error.message || ""));

            // Reset Recaptcha if it failed
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                    // Re-init happens via useEffect, but we might need to force reload or just ask user to refresh
                } catch (e) { }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!confirmationResult) throw new Error("No confirmation result");

            const result = await confirmationResult.confirm(otp);
            const token = await result.user.getIdToken();

            // Send to backend (backend now supports phone login via firebase token)
            const data = await googleLogin(token);
            if (data.success) {
                login(data.token, data.user);
            }
        } catch (error: any) {
            console.error(error);
            setError("Invalid OTP or Verification Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-black text-white overflow-hidden">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
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
                            Taste the <span className="text-primary">Tradition</span>.
                        </h2>
                        <p className="text-lg text-zinc-400">
                            Experience the authentic flavors of India delivered straight to your doorstep within minutes.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative">
                {/* Background Blobs for Mobile */}
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full pointer-events-none lg:hidden" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md space-y-8 relative z-10"
                >
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="text-zinc-400">Please enter your details to sign in.</p>
                    </div>

                    {/* Auth Method Toggle */}
                    <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
                        <button
                            onClick={() => setAuthMethod('email')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${authMethod === 'email' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Mail size={16} /> Email
                        </button>
                        <button
                            onClick={() => setAuthMethod('phone')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${authMethod === 'phone' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                        >
                            <Phone size={16} /> Phone
                        </button>
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

                    {authMethod === 'email' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-zinc-300">Password</label>
                                        <Link href="#" className="text-sm font-medium text-primary hover:text-orange-400 transition-colors">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                        <Input
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="pl-10 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 bg-primary hover:bg-orange-600 text-white rounded-xl text-base font-semibold shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign in"}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {!confirmationResult ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Phone Number</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="+91 99999 99999"
                                                className="pl-10 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Recaptcha Container inside form */}
                                    <div id="recaptcha-container" className="my-4 flex justify-center"></div>

                                    <Button className="w-full h-12 bg-primary hover:bg-orange-600 text-white rounded-xl font-semibold" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Send OTP"}
                                    </Button>
                                    {status && <p className="text-center text-sm text-yellow-500 mt-2">{status}</p>}
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Enter OTP</label>
                                        <Input
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="XXXXXX"
                                            maxLength={6}
                                            className="h-14 bg-zinc-900/50 border-zinc-800 rounded-xl text-center text-2xl tracking-[0.5em] font-bold text-primary"
                                            required
                                        />
                                    </div>
                                    <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold mt-2" disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify & Login"}
                                    </Button>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setConfirmationResult(null)}
                                            className="text-sm text-zinc-500 hover:text-zinc-300 underline"
                                        >
                                            Change Number
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-zinc-500">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            className="h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-xl"
                        >
                            Google
                        </Button>
                        <Button type="button" variant="outline" className="h-11 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:text-white rounded-xl">Github</Button>
                    </div>

                    <p className="text-center text-zinc-500">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-semibold text-primary hover:text-orange-400 transition-colors inline-flex items-center gap-1 group">
                            Sign up for free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </motion.div>

                <Link href="/" className="absolute top-8 right-8 lg:top-12 lg:right-12 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
            </div>
            {/* Removed global recaptcha container, moved inside form */}
        </div>
    );
}

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}
