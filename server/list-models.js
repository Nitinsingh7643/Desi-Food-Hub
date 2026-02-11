const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    try {
        console.log("Listing available models...");
        // Hack to get model list if standard method isn't exposed easily in this version
        // Actually usually strictly requires 'generativelanguage' Google cloud library for listing, 
        // OR we can just try to iterate known ones.
        // But let's try to fetch a specific error that LISTS them.

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model.generateContent("test");
        console.log("gemini-1.5-flash WORKS!");

    } catch (error) {
        console.log("Default flash failed.");
        console.log("Error details:", error.message);
    }
}

listModels();
