import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/groq";
import { calculateRisk } from "@/lib/risk-models";

export async function POST(req: Request) {
  try {
    const { messages, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const aiResponse = await generateChatResponse(messages, language || "English");
    const responseContent = aiResponse.content;
    const detectedLanguage = aiResponse.detectedLanguage;
    const riskScores = aiResponse.riskScores || null;

    const isSummary = riskScores !== null;

    return NextResponse.json({
      role: "model",
      content: responseContent,
      detectedLanguage,
      isSummary,
      riskScores,
      report: aiResponse.report,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
