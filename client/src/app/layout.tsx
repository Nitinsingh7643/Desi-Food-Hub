import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import OrderTracker from "@/components/features/OrderTracker";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

import { CartProvider } from "@/context/CartContext";



const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Desi Food Hub | Premium Food Delivery",
  description: "Experience the best local flavors delivered to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              <OrderTracker />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
