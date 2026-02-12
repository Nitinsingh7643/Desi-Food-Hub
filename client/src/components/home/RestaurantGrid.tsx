"use client";
import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import { Filter } from 'lucide-react';

const restaurants = [
    {
        id: 1,
        name: "Meghana Foods",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1000&auto=format&fit=crop",
        rating: 4.6,
        deliveryTime: "30-35 mins",
        priceForTwo: "₹500 for two",
        cuisine: "Biryani • Andhra • South Indian",
        offer: "60% OFF up to ₹120"
    },
    {
        id: 2,
        name: "Burger King",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop",
        rating: 4.1,
        deliveryTime: "25-30 mins",
        priceForTwo: "₹350 for two",
        cuisine: "Burgers • American",
        offer: "Free Whopper on ₹299+"
    },
    {
        id: 3,
        name: "Empire Restaurant",
        image: "https://images.unsplash.com/photo-1542365851-1f9632195581?q=80&w=1000&auto=format&fit=crop",
        rating: 4.4,
        deliveryTime: "40-45 mins",
        priceForTwo: "₹600 for two",
        cuisine: "North Indian • Kebab • Chinese",
        offer: "ITEMS AT ₹149"
    },
    {
        id: 4,
        name: "Pizza Hut",
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1000&auto=format&fit=crop",
        rating: 3.9,
        deliveryTime: "35-40 mins",
        priceForTwo: "₹400 for two",
        cuisine: "Pizzas • Fast Food",
        offer: "50% OFF"
    },
    {
        id: 5,
        name: "KFC",
        image: "https://images.unsplash.com/photo-1513639776629-7b611d256800?q=80&w=1000&auto=format&fit=crop",
        rating: 4.2,
        deliveryTime: "20-25 mins",
        priceForTwo: "₹550 for two",
        cuisine: "American • Snacks • Fast Food",
        offer: ""
    },
    {
        id: 6,
        name: "California Burrito",
        image: "https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?q=80&w=1000&auto=format&fit=crop",
        rating: 4.5,
        deliveryTime: "30-35 mins",
        priceForTwo: "₹450 for two",
        cuisine: "Mexican • Healthy • Salads",
        offer: "20% OFF"
    },
    {
        id: 7,
        name: "Truffles",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
        rating: 4.7,
        deliveryTime: "45-50 mins",
        priceForTwo: "₹600 for two",
        cuisine: "Continental • American • Desserts",
        offer: "Flat ₹100 OFF"
    },
    {
        id: 8,
        name: "Hotel Shadab",
        image: "https://images.unsplash.com/photo-1563245372-f21727e5a3c6?q=80&w=1000&auto=format&fit=crop",
        rating: 4.3,
        deliveryTime: "50-55 mins",
        priceForTwo: "₹400 for two",
        cuisine: "Biryani • Hyderabadi • Mughlai",
        offer: ""
    }
];

const filters = ["Rating 4.0+", "Pure Veg", "Offers", "Less than 32 mins"];

export default function RestaurantGrid() {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Top Restaurants in Delhi
                        </h2>
                        <p className="text-zinc-500 text-sm">Best food from top-rated restaurants!</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 text-zinc-400 hover:text-white cursor-pointer transition-colors bg-card/50">
                            <Filter size={16} /> Filters
                        </div>
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(activeFilter === filter ? null : filter)}
                                className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${activeFilter === filter
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-orange-500/20'
                                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white bg-card/50'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {restaurants.map((restaurant, idx) => (
                        <RestaurantCard key={restaurant.id} data={restaurant} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}
