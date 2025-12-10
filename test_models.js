const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("No API Key found");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // There isn't a direct listModels method on the client instance in some versions, 
        // but we can try to just use a known working one or check documentation behavior.
        // Actually, for the Node SDK, we might not be able to list cleanly without the admin API.
        // But let's try a simple generation ensuring the key works with a basic model.
        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Test");
        console.log("gemini-pro works!");
    } catch (error) {
        console.error("Error with gemini-pro:", error.message);
    }

    try {
        const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        const result2 = await model2.generateContent("Test");
        console.log("gemini-1.5-flash works!");
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);
    }
}

listModels();
