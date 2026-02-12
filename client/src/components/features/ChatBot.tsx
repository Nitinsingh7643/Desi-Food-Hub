"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { chatWithAi } from '@/lib/api/auth';
import { cn } from '@/lib/utils';

type Message = {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi there! 👋 I'm your Desi Food Assistant.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, language]);

    const handleLanguageSelect = (lang: string) => {
        setLanguage(lang);
        const welcomeText = lang === 'Hindi'
            ? "Namaste! 🙏 Aaj aap kya khana pasand karenge?"
            : "Awesome! What are you craving today?";

        setMessages([
            {
                id: Date.now(),
                text: welcomeText,
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        try {
            const data = await chatWithAi(userMsg.text, language || 'English');
            const botMsg: Message = {
                id: Date.now() + 1,
                text: data.reply || "I'm having trouble connecting to the kitchen.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            console.error(error);
            const debugInfo = error.response?.data?.debugError || error.message;
            if (debugInfo) alert(`AI Error: ${debugInfo}`);

            const errorMsg: Message = {
                id: Date.now() + 1,
                text: "Sorry, I'm currently offline.",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ scale: 0 }}
                animate={{
                    scale: 1,
                    y: [0, -8, 0]
                }}
                transition={{
                    y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }
                }}
                whileHover={{ scale: 1.1, y: 0 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
                        isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-orange-600"
                    )}
                >
                    {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                </Button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-orange-600 to-pink-600 flex items-center gap-3 shadow-md">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Chef Desi</h3>
                                <p className="text-orange-100 text-xs flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                    Online
                                </p>
                            </div>
                            {language && (
                                <button
                                    onClick={() => setLanguage(null)}
                                    className="ml-auto text-xs bg-black/20 text-white px-2 py-1 rounded hover:bg-black/40"
                                >
                                    Change Lang
                                </button>
                            )}
                        </div>

                        {/* Language Selection or Chat */}
                        {!language ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4 bg-[#121212]">
                                <Bot size={48} className="text-primary mb-4" />
                                <h3 className="text-white font-bold text-lg text-center">Welcome!</h3>
                                <p className="text-zinc-400 text-sm text-center">Please select your preferred language.</p>

                                <div className="grid grid-cols-1 gap-4 w-full mt-6 px-2">
                                    {/* English Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleLanguageSelect('English')}
                                        className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="flex items-center gap-4 z-10">
                                            <span className="text-2xl bg-white/10 p-2 rounded-full">🇺🇸</span>
                                            <div className="text-left">
                                                <h4 className="text-white font-bold text-sm">English</h4>
                                                <p className="text-zinc-400 text-xs">Standard & Universal</p>
                                            </div>
                                        </div>
                                        <div className="z-10 text-white/20 group-hover:text-orange-400 transition-colors">
                                            <Send size={16} className="rotate-45" />
                                        </div>
                                    </motion.button>

                                    {/* Hindi Option */}
                                    <motion.button
                                        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleLanguageSelect('Hindi')}
                                        className="group relative flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all duration-300 backdrop-blur-sm overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="flex items-center gap-4 z-10">
                                            <span className="text-2xl bg-white/10 p-2 rounded-full">🇮🇳</span>
                                            <div className="text-left">
                                                <h4 className="text-white font-bold text-sm">Hindi / Hinglish</h4>
                                                <p className="text-zinc-400 text-xs">Desi Style & Friendly</p>
                                            </div>
                                        </div>
                                        <div className="z-10 text-white/20 group-hover:text-green-400 transition-colors">
                                            <Send size={16} className="rotate-45" />
                                        </div>
                                    </motion.button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212]">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex w-full mb-2",
                                                msg.sender === 'user' ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                                                    msg.sender === 'user'
                                                        ? "bg-primary text-white rounded-br-none"
                                                        : "bg-zinc-800 text-zinc-200 rounded-bl-none border border-white/5"
                                                )}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start w-full">
                                            <div className="bg-zinc-800 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
                                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-4 bg-zinc-900 border-t border-white/5">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <Input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder={`Type a message in ${language}...`}
                                            className="bg-black/20 border-white/10 focus:border-primary/50 text-white placeholder:text-zinc-500"
                                        />
                                        <Button
                                            type="submit"
                                            size="icon"
                                            className="bg-primary hover:bg-orange-600 text-white shrink-0"
                                            disabled={!inputValue.trim()}
                                        >
                                            <Send size={18} />
                                        </Button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
