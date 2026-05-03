import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, target_language_code } = await req.json();
    const apiKey = process.env.SARVAM_API_KEY;

    // For Hackathon Demo: If API key is not set, return a mock success response
    if (!apiKey || apiKey === "your_sarvam_key_here") {
      // Simulate network delay
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({
        success: true,
        isMock: true,
        audio: "data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" // Fake tiny MP3
      });
    }

    // Call Real Sarvam API
    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: target_language_code || "hi-IN",
        speaker: "priya",
        pace: 1.0,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: "bulbul:v3"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Sarvam API Error:", errorText);
      return NextResponse.json({ error: "Sarvam API request failed" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Sarvam Route Error:", error);
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 });
  }
}
