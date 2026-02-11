import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini with v1 API version to fix 404s
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// Note: SDK usually defaults to v1 or v1beta. 
// We will try to get model from specific endpoint logic if possible, 
// but actually the SDK structure is `getGenerativeModel({ model: '...', apiVersion: 'v1' })` in some versions.
// Let's standard init here.

export const chatWithChef = async (req: Request, res: Response) => {
    try {
        const { message, language } = req.body;
        const userLang = language || 'English';

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // 1. Fetch live menu data
        const products = await Product.find({}, 'name price description category isVeg rating');

        const menuContext = products.map(p =>
            `- ${p.name} (${p.category}): ₹${p.price}, ${p.isVeg ? 'Veg' : 'Non-Veg'}, Rating: ${p.rating}. Desc: ${p.description}`
        ).join('\n');

        // 2. Prepare Prompt
        const prompt = `
        You are "Chef Desi", a friendly and knowledgeable AI assistant for a restaurant called "Desi Food Hub".
        Your goal is to help customers choose food from our specific menu.
        
        HERE IS OUR MENU DATA:
        ${menuContext}

        RULES:
        1. ONLY recommend items from the menu list above.
        2. Be concise, friendly, and appetizing.
        3. Mention prices.
        4. User Message: "${message}"
        5. IMPORTANT: Reply strictly in ${userLang} language.
        `;

        // 3. Call Gemini API Directly (v1beta endpoint - Using 2026 Modern Standard)
        const apiKey = process.env.GEMINI_API_KEY;
        const model = "gemini-3-flash-preview";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || response.statusText);
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!reply) throw new Error("No response from AI");

        res.status(200).json({ success: true, reply });

    } catch (error: any) {
        console.error("AI Chat Final Error:", error);
        res.status(500).json({
            success: false,
            message: "Chef is busy right now!",
            debugError: error.message || "Unknown AI Error"
        });
    }
};
