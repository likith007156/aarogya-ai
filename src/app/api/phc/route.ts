import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const mockPHCs = [
  { id: "1", name: "Bangalore Urban PHC", latitude: 12.9716, longitude: 77.5946, slots: 5, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Mysore Rural PHC", latitude: 12.2958, longitude: 76.6394, slots: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Hubli PHC", latitude: 15.3647, longitude: 75.1240, slots: 4, createdAt: new Date(), updatedAt: new Date() },
];

export async function GET() {
  try {
    const phcs = await prisma.pHC.findMany();
    return NextResponse.json(phcs.length > 0 ? phcs : mockPHCs);
  } catch (error) {
    console.warn("Database unavailable, using mock PHC data:", error);
    return NextResponse.json(mockPHCs);
  }
}
