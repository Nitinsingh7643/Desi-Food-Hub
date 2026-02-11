const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGemini() {
    console.log("Testing Gemini API with Key:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // List of models to try
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

    for (const modelName of models) {
        console.log(`\nTrying model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say hello");
            console.log(`✅ SUCCESS! Response: ${result.response.text()}`);
            return; // Exit on first success
        } catch (error) {
            console.log(`❌ Failed: ${error.message}`);
            if (error.status) console.log(`   Status: ${error.status}`);
        }
    }
}

testGemini();
