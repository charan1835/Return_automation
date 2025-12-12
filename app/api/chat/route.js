import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { message } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        console.log("Processing chat request...");
        if (!apiKey) {
            console.error("Error: GEMINI_API_KEY is missing in environment variables.");
            return NextResponse.json(
                { error: "Gemini API key is not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // User requested "geminin 2.5", assuming typo for gemini-pro or gemini-1.5. 
        // Fallback to gemini-pro as it is most stable for this SDK version.
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `You are the Return Management Assistant for a Return Automation System.
Your Role: Help users with their return process, explain return policies, and assist with technical issues related to returns.
Tone: Professional, empathetic, and concise.
Capabilities:
- Guide users through the return form.
- Explain that items must be in original condition and returned within 30 days.
- If a user asks about non-return topics, politely redirect them to the return process or state that you can only assist with returns.
- Do not make up order details; ask the user for their order ID if needed (simulated).`
        });

        console.log("Calling Gemini API...");
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini response received.");

        return NextResponse.json({ text });
    } catch (error) {
        console.error("Error generating content:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate response" },
            { status: 500 }
        );
    }
}
