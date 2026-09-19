import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const gemini = new GoogleGenAI({
  apiKey: geminiApiKey,
});

export default gemini;