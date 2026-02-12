"use client";

import React, { createContext, useContext, useEffect, useState } from "react";


type Theme = "dark" | "light";
type AccentColor = "orange" | "blue" | "green" | "purple" | "red";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// HSL Values for accents
const ACCENT_MAP: Record<AccentColor, string> = {
    orange: "24.6 95% 53.1%", // #FC8019 (Swiggy Orange-ish)
    blue: "221.2 83.2% 53.3%", // #3b82f6
    green: "142.1 76.2% 36.3%", // #22c55e
    purple: "262.1 83.3% 57.8%", // #a855f7
    red: "346.8 77.2% 49.8%"     // #ef4444
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [accentColor, setAccentColor] = useState<AccentColor>("orange");

    useEffect(() => {
        // Load saved preferences
        const savedTheme = localStorage.getItem("theme") as Theme;
        const savedAccent = localStorage.getItem("accent") as AccentColor;

        if (savedTheme) setTheme(savedTheme);
        if (savedAccent && ACCENT_MAP[savedAccent]) setAccentColor(savedAccent);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        // Apply Accent Color variable
        const root = window.document.documentElement;
        const hslValue = ACCENT_MAP[accentColor];
        root.style.setProperty("--primary", hslValue);
        localStorage.setItem("accent", accentColor);
    }, [accentColor]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
