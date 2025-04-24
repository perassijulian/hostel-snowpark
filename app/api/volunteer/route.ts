import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // All good, create volunteer proposal
    const newVolunteer = await prisma.volunteer.create({
      data: {
        name,
        email,
        message,
      },
    });

    return NextResponse.json(newVolunteer);
  } catch (error) {
    console.error("Volunteer Error:", error);
    return NextResponse.json(
      { error: "Failed to process volunteer" },
      { status: 500 }
    );
  }
}
