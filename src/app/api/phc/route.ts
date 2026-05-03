import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const phcs = await prisma.pHC.findMany();
    return NextResponse.json(phcs);
  } catch (error) {
    console.error("PHC API Error:", error);
    return NextResponse.json({ error: "Failed to fetch PHCs" }, { status: 500 });
  }
}
