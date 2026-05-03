import { NextResponse } from "next/server";
import { calculateRisk } from "@/lib/risk-models";

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json();
    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json({ error: "Invalid symptoms array" }, { status: 400 });
    }
    const scores = calculateRisk(symptoms);
    return NextResponse.json({ scores });
  } catch (error) {
    return NextResponse.json({ error: "Failed to calculate risk" }, { status: 500 });
  }
}
