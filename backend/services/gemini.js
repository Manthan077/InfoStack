import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate answer using Gemini
 * Handles quota exhaustion gracefully
 */
export async function generateAnswer({ systemPrompt, context, question }) {
  const prompt = `
${systemPrompt}

Context:
${context || "No relevant context found."}

Question:
${question}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // ✅ Proper Gemini response parsing
    const text =
      response?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || null;

    if (!text) {
      return "⚠️ AI could not generate a response for this query.";
    }

    return text;

  } catch (err) {
    // ✅ Handle Gemini daily quota exceeded
    if (err?.status === 429) {
      return "⚠️ Daily AI usage limit reached. Please try again tomorrow or after some time.";
    }

    console.error("Gemini error:", err);
    return "⚠️ AI service is temporarily unavailable. Please try again later.";
  }
}
