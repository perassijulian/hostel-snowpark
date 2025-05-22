import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// --- Zod Validation Schema ---
const bookingSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(5),
    guests: z.coerce.number().int().min(1).max(99),
    checkIn: z.coerce
      .date()
      .refine((d) => d >= new Date(), "Check-in cannot be on the past"),
    checkOut: z.coerce.date(),
    accommodationId: z.coerce.number().int(),
  })
  .refine((data) => data.checkIn < data.checkOut, {
    message: "Check-in must be before check-out",
    path: ["checkOut"],
  });

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const result = bookingSchema.safeParse(json);
    if (!result.success) {
      console.log(result.error.format());
      return NextResponse.json(
        { error: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, guests, checkIn, checkOut, accommodationId } =
      result.data;

    // Check for date overlap
    const clash = await prisma.booking.findFirst({
      where: {
        accommodationId,
        startDate: { lt: checkOut },
        endDate: { gt: checkIn },
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

    // All good, create booking
    const newBooking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        startDate: checkIn,
        endDate: checkOut,
        guests,
        accommodationId,
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
