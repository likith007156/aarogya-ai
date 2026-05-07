import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, village, age } = await req.json();

    // Generate Mock 14-digit ABHA ID
    const abhaId = `${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const qrData = JSON.stringify({ name, abhaId });
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    let patient = null;
    try {
      patient = await prisma.patient.create({
        data: {
          name: name || "Anonymous User",
          age: age || 30,
          village: village || "Unknown",
          riskLevel: "MEDIUM",
          abhaId,
        }
      });
    } catch (dbError) {
      console.warn("Database unavailable, using mock data:", dbError);
      patient = {
        id: Math.random().toString(36).substring(7),
        name: name || "Anonymous User",
        age: age || 30,
        village: village || "Unknown",
        riskLevel: "MEDIUM",
        abhaId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      patient,
      qrCodeDataUrl
    });
  } catch (error) {
    console.error("ABHA API Error:", error);
    return NextResponse.json({ error: "Failed to generate ABHA ID" }, { status: 500 });
  }
}
