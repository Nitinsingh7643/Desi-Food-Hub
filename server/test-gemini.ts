import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
    console.log("Testing Gemini API...");
    console.log("API Key Present?", !!process.env.GEMINI_API_KEY);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    // Try Flash
    try {
        console.log("\nAttempting 'gemini-1.5-flash'...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("✅ Success with Flash! Response:", result.response.text());
        return;
    } catch (error: any) {
        console.error("❌ Flash Failed:", error.message);
    }

    // Try Pro
    try {
        console.log("\nAttempting 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("✅ Success with Pro! Response:", result.response.text());
        return;
    } catch (error: any) {
        console.error("❌ Pro Failed:", error.message);
    }

    console.log("\n⚠️  ALL MODELS FAILED.");
    console.log("Recommendation: checks if 'Generative Language API' is enabled in https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com");
}

testGemini();
