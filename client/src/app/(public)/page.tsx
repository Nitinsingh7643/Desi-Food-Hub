"use client";

import Hero from "@/components/home/Hero";
import CategorySlider from "@/components/home/CategorySlider";
import MenuGrid from "@/components/home/MenuGrid";
import Footer from "@/components/common/Footer";
import LocationSection from "@/components/home/LocationSection";
import ChatBot from "@/components/features/ChatBot";
import UserHome from "@/components/home/UserHome";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
    const { isAuthenticated, loading } = useAuth();

    // To prevent hydration mismatch or flicker, we could show a loader or nothing while checking
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (isAuthenticated) {
        return <UserHome />;
    }

    return (
        <main className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
            <Hero />
            <CategorySlider />
            <MenuGrid />
            <LocationSection />
            <Footer />
            <ChatBot />
        </main>
    );
}
