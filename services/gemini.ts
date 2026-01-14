
import { GoogleGenAI } from "@google/genai";

export const getGeminiAssistance = async (context: string): Promise<string> => {
  try {
    // Initializing Gemini with the correct environment variable access directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional editor for an indie zine platform called DropaLine. 
      The user is drafting a "drop" (a short printable piece of writing). 
      Provide a brief, creative suggestion (2-3 sentences) to expand on the following context, 
      keeping it atmospheric and suitable for a physical print experience. 
      
      Context: ${context}`,
      config: {
        // Removed maxOutputTokens to prevent response blocking as no thinkingBudget was set
        temperature: 0.8,
      },
    });

    // Directly access the text property of GenerateContentResponse
    return response.text || "Keep the thoughts flowing, the page is waiting.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to the AI muse. Try again later.";
  }
};
