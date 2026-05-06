import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

if (process.env.DATABASE_URL) {
  prisma = new PrismaClient();
}

const mockPHCs = [
  { id: "1", name: "Bangalore Urban PHC", latitude: 12.9716, longitude: 77.5946, slots: 5 },
  { id: "2", name: "Mysore Rural PHC", latitude: 12.2958, longitude: 76.6394, slots: 3 },
  { id: "3", name: "Hubli PHC", latitude: 15.3647, longitude: 75.1240, slots: 4 },
];

export async function GET() {
  try {
    const phcs = prisma ? await prisma.pHC.findMany() : mockPHCs;
    return NextResponse.json(phcs);
  } catch (error) {
    console.error("PHC API Error:", error);
    return NextResponse.json(mockPHCs);
  }
}
