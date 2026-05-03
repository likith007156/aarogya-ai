import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [patientCount, phcCount, abhaCount] = await Promise.all([
      prisma.patient.count(),
      prisma.pHC.count(),
      prisma.patient.count({ where: { abhaId: { not: null } } }),
    ]);

    return NextResponse.json({
      patients: patientCount,
      phcs: phcCount,
      abhaIds: abhaCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Metrics API Error:", error);
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
