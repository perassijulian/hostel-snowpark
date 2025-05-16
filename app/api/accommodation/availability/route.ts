import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { AccommodationType } from "@prisma/client";

const querySchema = z.object({
  id: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Invalid ID",
    })
    .optional(),
  type: z.string().optional(),
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
    id: searchParams.get("id") ?? undefined,
    type: searchParams.get("type") ?? undefined,
    checkIn: searchParams.get("checkIn") ?? undefined,
    checkOut: searchParams.get("checkOut") ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
  });

  if (!result.success) {
    console.error(result.error.flatten());
    return NextResponse.json(
      { error: result.error.flatten() },
      { status: 400 }
    );
  }

  const { id, type, checkIn, checkOut, guests } = result.data;

  const typedType = type as AccommodationType;

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  if (id) {
    // Check if specific accommodation with `id` is available
    const acc = await prisma.accommodation.findUnique({
      where: { id: Number(id) },
      include: { pictures: true },
    });

    if (!acc || acc.guests < guests) {
      return NextResponse.json([]); // Not found or doesn't support guest count
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        accommodationId: Number(id),
        OR: [
          {
            startDate: { lt: endDate },
            endDate: { gt: startDate },
          },
        ],
      },
    });

    if (!overlappingBooking) {
      return NextResponse.json([acc]); // Available!
    }

    // Not available, continue to search by type fallback
  }

  if (!type) {
    return NextResponse.json([], { status: 200 }); // nothing to suggest if type is also missing
  }

  // Step 1: Get all accommodations of the right type that support this guest count
  const accommodations = await prisma.accommodation.findMany({
    where: {
      type: typedType,
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
