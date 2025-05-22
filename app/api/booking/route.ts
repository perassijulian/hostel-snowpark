import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { create } from "domain";

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

// --- Util: Format Response ---
function createResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

function createError<T>(message: string | object, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const result = bookingSchema.safeParse(await req.json());
    if (!result.success) {
      console.error(result.error.flatten());
      return createError(result.error.flatten());
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
      return createError(
        "Selected dates are unavailable. Please try another range"
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

    return createResponse(newBooking);
  } catch (error) {
    console.error("Booking Error:", error);
    return createError("Failed to process booking", 500);
  }
}
