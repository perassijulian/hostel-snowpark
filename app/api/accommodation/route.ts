import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accommodations = await prisma.accommodation.findMany({
      include: {
        pictures: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ accommodations }, { status: 200 });
  } catch (error) {
    console.error("Error while fetching accommodations: ", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
