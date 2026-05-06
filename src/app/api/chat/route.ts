import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const aiResponse = await generateChatResponse(messages, language || "English");

    return NextResponse.json({
      role: "model",
      content: aiResponse.content,
      detectedLanguage: aiResponse.detectedLanguage,
      isSummary: !!aiResponse.riskScores,
      riskScores: aiResponse.riskScores || null,
      report: aiResponse.report || null,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    // Never return 500 — always return a valid chat message so the UI never shows the error fallback
    return NextResponse.json({
      role: "model",
      content: "Please describe your symptoms and I'll help you right away.",
      detectedLanguage: "English",
      isSummary: false,
      riskScores: null,
      report: null,
    });
  }
}
