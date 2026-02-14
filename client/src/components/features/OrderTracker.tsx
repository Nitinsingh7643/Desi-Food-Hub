"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bike, ChefHat, CheckCircle, Clock, MapPin, ChevronUp, ChevronDown, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// Simulation steps
const steps = [
    { status: 'Order Placed', icon: Package, sub: 'We have received your order.' },
    { status: 'Preparing', icon: ChefHat, sub: 'Chef is working on your meal.' },
    { status: 'Out for Delivery', icon: Bike, sub: 'Rider is on the way.' },
    { status: 'Delivered', icon: CheckCircle, sub: 'Enjoy your meal!' },
];

export default function OrderTracker() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();

    // Check if admin page
    const isAdminPage = pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

    // Simulate progress
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev >= 3) return 0; // Loop for demo
                return prev + 1;
            });
        }, 5000); // Change step every 5 seconds for demo

        return () => clearInterval(interval);
    }, []);

    // Event Listener for external trigger
    useEffect(() => {
        const handleOpen = () => {
            setIsVisible(true);
            setIsExpanded(true);
        };
        window.addEventListener('open-order-tracker', handleOpen);
        return () => window.removeEventListener('open-order-tracker', handleOpen);
    }, []);

    // Also close completely if commanded
    const handleClose = () => {
        setIsExpanded(false);
        // Optional: wait for animation then setVisible(false)
        setTimeout(() => setIsVisible(false), 500);
    };

    if (isAdminPage || !isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="w-80 sm:w-96 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-[#1c1c1c] p-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Live Order #4202</h3>
                                    <p className="text-xs text-zinc-400">Arriving in <span className="text-white font-bold">12 mins</span></p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors">
                                <ChevronDown size={20} />
                            </button>
                        </div>

                        {/* Map Placeholder */}
                        <div className="h-32 w-full bg-zinc-800 relative overflow-hidden group">
                            {/* Modern Dark Map Background */}
                            <div className="absolute inset-0 bg-[url('https://basemaps.cartocdn.com/dark_all/12/2884/1709.png')] bg-cover bg-center opacity-100 transition-transform duration-1000 group-hover:scale-105" />
                            {/* Gradient Overlay for Depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-xs text-zinc-400 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                    <MapPin size={12} className="inline mr-1 text-primary" /> Live Tracking Map
                                </div>
                            </div>

                            {/* Rider Animation */}
                            <motion.div
                                animate={{ x: [0, 100, 0] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute bottom-4 left-4"
                            >
                                <div className="p-2 bg-primary rounded-full shadow-lg border-2 border-white">
                                    <Bike size={16} className="text-white" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Stepper */}
                        <div className="p-5 space-y-6 bg-[#121212]">
                            {steps.map((step, index) => {
                                const isActive = index === currentStep;
                                const isCompleted = index < currentStep;
                                const Icon = step.icon;

                                return (
                                    <div key={index} className="flex gap-4 relative">
                                        {/* Line Connector */}
                                        {index !== steps.length - 1 && (
                                            <div className={cn(
                                                "absolute left-[15px] top-8 w-0.5 h-10 transition-colors duration-500",
                                                isCompleted ? "bg-primary" : "bg-zinc-800"
                                            )} />
                                        )}

                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2",
                                            isActive ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" :
                                                isCompleted ? "bg-primary border-primary text-white" :
                                                    "bg-zinc-900 border-zinc-700 text-zinc-600"
                                        )}>
                                            <Icon size={14} />
                                        </div>

                                        <div className={cn("transition-opacity duration-500", isActive || isCompleted ? "opacity-100" : "opacity-40")}>
                                            <h4 className={cn("text-sm font-bold", isActive ? "text-primary" : "text-white")}>
                                                {step.status}
                                            </h4>
                                            <p className="text-xs text-zinc-500 leading-tight">
                                                {step.sub}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4 border-t border-white/5 bg-[#1c1c1c]">
                            <Button className="w-full h-10 text-xs bg-white/5 hover:bg-white/10 border border-white/10" variant="outline">
                                View Order Details
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
