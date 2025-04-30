import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const guests = Number(body.guests);
    const { name, email, phone, startDate, endDate, type } = body;

    // 🔐 Validate fields
    if (
      !name ||
      !email ||
      !phone ||
      !startDate ||
      !endDate ||
      !guests ||
      !type
    ) {
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

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (start >= end) {
      return NextResponse.json(
        { error: "Start date must be before end date" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(guests) || guests < 1) {
      return NextResponse.json(
        { error: "Invalid number of guests" },
        { status: 400 }
      );
    }

    // Check for date overlap
    console.log("checking for overlap");
    const clash = await prisma.booking.findFirst({
      where: {
        type,
        OR: [
          {
            startDate: { lte: end },
            endDate: { gte: start },
          },
        ],
      },
    });

    if (clash) {
      return NextResponse.json(
        {
          error: "Selected dates are unavailable. Please try another range",
        },
        { status: 409 }
      );
    }
    console.log("checking for overlap chekced");

    // All good, create booking
    const newBooking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        startDate: start,
        endDate: end,
        guests,
        type,
      },
    });

    return NextResponse.json(newBooking);
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { error: "Failed to process booking" },
      { status: 500 }
    );
  }
}
