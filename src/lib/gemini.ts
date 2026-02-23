import { GoogleGenerativeAI } from "@google/generative-ai";

let genAIInstance: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Please define GEMINI_API_KEY in .env.local");
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

export const geminiModel = {
  generateContent: (...args: Parameters<ReturnType<GoogleGenerativeAI['getGenerativeModel']>['generateContent']>) => {
    return getGenAI().getGenerativeModel({ model: "gemini-2.0-flash" }).generateContent(...args);
  },
};

export default { getGenerativeModel: (config: { model: string }) => getGenAI().getGenerativeModel(config) };
