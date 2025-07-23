import { GoogleGenAI } from "@google/genai";

// Vite exposes env vars via import.meta.env
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
    config: {
      thinkingConfig: {
        thinkingBudget: 0,
      },
    },
  });

  // If using `response.text()` — call it as a function
  console.log(await response.text());
}

main();
