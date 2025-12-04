import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Gemini Service Loaded - v10 (2.0 Flash Priority)");

const PERSONAS = {
    "Sarah J.": {
        role: "You are Sarah, a 68-year-old retired school teacher. You are sweet, encouraging, and love gardening. You use emojis like 🌸, 📚, and 🍵. You often mention your grandkids or your garden.",
        tone: "Warm, motherly, educational"
    },
    "Mike T.": {
        role: "You are Mike, a 72-year-old Vietnam veteran. You are a bit grumpy but have a heart of gold. You value discipline and hard work. You talk about 'the good old days' and sometimes complain about technology, but you are loyal to your friends.",
        tone: "Gruff, direct, loyal, nostalgic"
    },
    "Emma W.": {
        role: "You are Emma, a 75-year-old former jazz singer. You are vibrant, energetic, and love to gossip a little bit. You call everyone 'darling' or 'honey'. You love bingo and social events.",
        tone: "Vibrant, chatty, affectionate"
    },
    "Report Agent": {
        role: "You are the 'Feeling Fine' Wellness Assistant. Your job is to analyze the user's wellness data trends and provide helpful, encouraging advice. You also know everything about how to use the website and can guide the user if they ask. You are professional but warm and supportive.",
        tone: "Professional, supportive, knowledgeable"
    }
};

let genAI = null;

// List of models to try in order of preference.
// User EXPLICITLY requested 2.0 Flash.
const MODEL_CANDIDATES = [
    "gemini-2.0-flash-exp",              // User's requested model
    "gemini-2.0-flash-lite-preview-02-05", // Backup 2.0
    "gemini-1.5-flash",                  // Fallback
    "gemini-1.5-pro",                    // Fallback
];

// Helper to wait
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const initializeGemini = (apiKey) => {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        return true;
    } catch (error) {
        console.error("Failed to initialize Gemini:", error);
        return false;
    }
};

const tryGenerateWithFallback = async (systemInstruction, userMessage, history = []) => {
    if (!genAI) throw new Error("AI not initialized");

    let lastError = null;

    for (const modelName of MODEL_CANDIDATES) {
        try {
            console.log(`Attempting to use model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Retry logic for Rate Limits (429)
            let attempts = 0;
            const maxAttempts = 3;

            while (attempts < maxAttempts) {
                try {
                    const chat = model.startChat({
                        history: [
                            {
                                role: "user",
                                parts: [{ text: systemInstruction }],
                            },
                            {
                                role: "model",
                                parts: [{ text: "Understood." }],
                            },
                            ...history
                        ],
                    });

                    const result = await chat.sendMessage(userMessage);
                    const response = await result.response;
                    return response.text();

                } catch (innerError) {
                    // Check specifically for Rate Limit (429)
                    if (innerError.message.includes("429") || innerError.message.includes("quota")) {
                        attempts++;
                        console.warn(`Rate limit hit on ${modelName}. Retrying (${attempts}/${maxAttempts})...`);
                        if (attempts < maxAttempts) {
                            await delay(1000 * attempts); // Backoff: 1s, 2s, 3s
                            continue; // Retry loop
                        }
                    }
                    throw innerError; // Throw non-retriable or max-retried error to outer loop
                }
            }

        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            lastError = error;

            // If it's a 404 (Not Found), we continue to the next model immediately.
            if (error.message.includes("404") || error.message.includes("not found")) {
                continue;
            }

            // If it was a 429 that failed after retries, we still try other models just in case.
        }
    }

    // If we get here, all models failed.
    throw lastError || new Error("All available models failed. Please check your API key.");
};

export const getChatResponse = async (friendName, message, history = [], userName = 'friend') => {
    const persona = PERSONAS[friendName] || PERSONAS["Sarah J."];
    const systemInstruction = `System Instruction: ${persona.role}. The user's name is ${userName}. You already know them and should refer to them by name occasionally. Keep your responses short (under 50 words) and conversational.`;

    try {
        return await tryGenerateWithFallback(systemInstruction, message, history);
    } catch (error) {
        console.error("Chat error:", error);
        return `Error: ${error.message}`;
    }
};

export const getReportAnalysis = async (message, userStats, websiteGuide, history = [], userName = 'friend') => {
    const persona = PERSONAS["Report Agent"];
    const context = `
    Context Data:
    - User's Name: ${userName}
    - User's Weekly Trend: ${userStats.trend}
    - Total Acts (Last 30 Days): ${userStats.totalActs}
    - Website Guide: ${websiteGuide}
    `;
    const systemInstruction = `System Instruction: ${persona.role}. The user's name is ${userName}. You already know them and should refer to them by name occasionally. \n\n${context}\n\nUse the provided context to answer the user's questions about their data or the website. Keep responses helpful and concise.`;

    try {
        return await tryGenerateWithFallback(systemInstruction, message, history);
    } catch (error) {
        console.error("Report Chat error:", error);
        return `Error: ${error.message}`;
    }
};


