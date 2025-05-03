import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  type: z.string(),
  checkIn: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid start date"),
  checkOut: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid end date"),
  guests: z
    .string()
    .transform(Number)
    .refine((val) => val > 0, "Guests must be > 0"),
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const result = querySchema.safeParse({
    type: searchParams.get("type"),
    checkIn: searchParams.get("checkIn"),
    checkOut: searchParams.get("checkOut"),
    guests: searchParams.get("guests"),
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const { type, checkIn, checkOut, guests } = result.data;

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  // Step 1: Get all accommodations of the right type that support this guest count
  const accommodations = await prisma.accommodation.findMany({
    where: {
      type,
      guests: { gte: guests },
    },
    include: { pictures: true },
  });

  // Step 2: Filter those without bookings in the selected date range
  const available = [];

  for (const acc of accommodations) {
    const overlappingBookings = await prisma.booking.findFirst({
      where: {
        accommodationId: acc.id,
        OR: [
          {
            startDate: { lt: endDate },
            endDate: { gt: startDate },
          },
        ],
      },
    });

    if (!overlappingBookings) {
      available.push(acc);
    }
  }

  return NextResponse.json(available);
}
