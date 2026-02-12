"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LocationSection() {
    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-black z-0" />
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] z-0" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 items-center">

                    {/* Text Content */}
                    <div className="lg:w-1/3 space-y-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                <MapPin size={12} /> Visit Us
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Dine with us <br />
                                <span className="text-zinc-500">at Sasaram.</span>
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Experience the ambiance of Desi Food Hub. Located conveniently near the spiritual landmark, we offer a perfect blend of great food and serenity.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                                <div className="p-3 bg-zinc-900 rounded-xl text-primary">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Our Location</h3>
                                    <p className="text-zinc-400 text-sm mt-1">
                                        In front of Pilot Baba Temple,<br />
                                        Sasaram, Rohtas, Bihar 821115
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-colors">
                                <div className="p-3 bg-zinc-900 rounded-xl text-primary">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Opening Hours</h3>
                                    <p className="text-zinc-400 text-sm mt-1">
                                        Mon - Sun: 10:00 AM - 11:00 PM<br />
                                        <span className="text-green-500 font-bold text-xs">OPEN NOW</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full h-14 text-base font-bold bg-white text-black hover:bg-zinc-200 gap-2">
                            <Navigation size={18} /> Get Directions
                        </Button>
                    </div>

                    {/* Map Interaction */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="lg:w-2/3 w-full h-[500px] rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl relative group"
                    >
                        {/* Google Maps Embed */}
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.3279341553944!2d84.0436426!3d24.954955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398db1c486504e53%3A0x45f5b7b8a6a6511a!2z4KSm4KWH4KS44KWAIEZvb2QgSHViIFJlc3RhdXJhbnQgJiBDYWZl!5e0!3m2!1sen!2sin!4v1768934521848!5m2!1sen!2sin"
                            className="group-hover:grayscale-0 group-hover:invert-0 group-hover:contrast-100 transition-all duration-700"
                        ></iframe>

                        {/* Overlay Card */}
                        <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl flex items-center gap-4 max-w-xs transform translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
                                <Navigation size={20} />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">2.5 km away</p>
                                <p className="text-zinc-400 text-xs">~10 mins drive from center</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
