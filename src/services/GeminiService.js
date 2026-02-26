// Gemini Service — AI is currently offline

console.log("Gemini Service Loaded — AI is currently offline");

const OFFLINE_MESSAGE = "The AI is currently offline. Please check back later!";

export const initializeGemini = (_apiKey) => {
    // No-op: AI is offline
    return true;
};

export const getChatResponse = async (_friendName, _message, _history = [], _userName = 'friend') => {
    return OFFLINE_MESSAGE;
};

export const getReportAnalysis = async (_message, _userStats, _websiteGuide, _history = [], _userName = 'friend') => {
    return OFFLINE_MESSAGE;
};

