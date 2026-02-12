"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    useEffect(() => {
        // Trigger confetti on load
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full bg-card border border-border rounded-3xl p-8 text-center shadow-2xl"
            >
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-4">Order Placed!</h1>
                <p className="text-muted-foreground mb-8">
                    Thank you for your order. We've received it and the kitchen has already started preparing your delicious food!
                </p>

                <div className="bg-secondary/20 rounded-xl p-4 mb-8 text-left space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-mono font-bold text-foreground">#{orderId?.slice(-6).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Estimated Time:</span>
                        <span className="font-bold text-foreground flex items-center gap-1"><Clock size={14} /> 30-45 mins</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link href="/orders">
                        <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl shadow-lg shadow-primary/20">
                            Track Order <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </Link>

                    <Link href="/">
                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <OrderSuccessContent />
        </Suspense>
    );
}
