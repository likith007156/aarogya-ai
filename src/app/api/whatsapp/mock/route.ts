import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { Body, From } = await req.json();
    const msg = Body.toLowerCase();

    let responseText = "नमस्ते! मैं आरोग्य AI हूं। मैं आपकी क्या मदद कर सकता हूँ?"; // Default Hindi

    // Simple mocked logic for hackathon demo
    if (msg.includes("hi") || msg.includes("hello")) {
      responseText = "Hello! I am Aarogya AI. What health concern can I help you with today?";
    } else if (msg.includes("ನನಗೆ") || msg.includes("ಜ್ವರ")) {
      responseText = "ನಿಮಗೆ ಜ್ವರ ಇದೆ ಎಂದು ತಿಳಿಯಿತು. ಇದು ಎಷ್ಟು ದಿನಗಳಿಂದ ಇದೆ?";
    } else if (msg.includes("बुखार") || msg.includes("bukhar")) {
      responseText = "आपको बुखार है। क्या आपको खांसी भी है?";
    } else if (msg.includes("book phc")) {
      responseText = "Your PHC appointment is booked at Primary Health Center, Bangalore. Please visit with your ABHA ID.";
    } else if (msg.includes("abha")) {
      responseText = "Your ABHA ID is generated: 91-1234-5678-9012. Link: https://healthid.ndhm.gov.in/";
    } else {
      responseText = "I'm still learning. For medical emergencies, please call 108.";
    }

    // Delay for realism
    await new Promise(r => setTimeout(r, 1500));

    return NextResponse.json({ response: responseText });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process" }, { status: 500 });
  }
}
