import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Your NextAuth config

export async function GET() {
  const accommodations = await prisma.accommodation.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(accommodations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const guests = Number(body.guests);
    const { name, type, price, description } = body;

    if (!name || !type || !price || !description || !guests) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newAccommodation = await prisma.accommodation.create({
      data: {
        name,
        type,
        price,
        description,
        guests,
      },
    });

    return NextResponse.json(newAccommodation, { status: 201 });
  } catch (error) {
    console.error("Error creating accommodation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
