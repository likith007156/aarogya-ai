import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function main() {
  try {
    const systemPrompt = `You are Aarogya AI.`;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
      },
    });

    const result = await chat.sendMessage("hi");
    console.log("SUCCESS:", result.response.text());
  } catch (err) {
    console.error("ERROR:", err);
  }
}
main();
