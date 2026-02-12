"use client";
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0c0c0c] border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">D</div>
                            <h3 className="text-xl font-bold text-white">Desi Food Hub</h3>
                        </div>
                        <p className="text-zinc-500 text-sm leading-relaxed">
                            Bringing the authentic taste of Desi cuisine right to your doorstep. Fresh, fast, and always delicious.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            {['About Us', 'Team', 'Careers', 'Blog', 'Contact'].map(item => (
                                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm text-zinc-500">
                            {['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Refund Policy', 'Partner Support'].map(item => (
                                <li key={item}><a href="#" className="hover:text-primary transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-zinc-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary mt-1" size={16} />
                                <span>In front of Pilot Baba Temple,<br />Sasaram, Rohtas, Bihar</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-primary" size={16} />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary" size={16} />
                                <span>support@desifoodhub.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-zinc-600 text-sm">
                    <p>&copy; {new Date().getFullYear()} Desi Food Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
