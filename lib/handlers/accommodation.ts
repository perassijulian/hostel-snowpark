import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { AccommodationType } from "@prisma/client";

// --- Zod Validation Schema ---
const querySchema = z
  .object({
    id: z
      .string()
      .transform((val) => (val ? Number(val) : undefined))
      .refine((val) => val === undefined || !isNaN(val), {
        message: "Invalid ID",
      })
      .optional(),
    type: z.nativeEnum(AccommodationType).optional(),
    checkIn: z.coerce
      .date()
      .refine((d) => d >= new Date(), "Check-in cannot be on the past"),
    checkOut: z.coerce.date(),
    guests: z
      .string()
      .transform(Number)
      .refine(
        (val) => val > 0 && val < 100,
        "Guests must be between 0 and 100"
      ),
  })
  .refine((data) => data.checkIn < data.checkOut, {
    message: "Check-in date must be before check-out date",
    path: ["checkOut"],
  });

// --- Util: Format Response ---
function createResponse<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

function createError<T>(message: string | object, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}

export async function handleAvailability(req: Request) {
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
    return createError(result.error.flatten());
  }

  const { id, type, checkIn, checkOut, guests } = result.data;

  const typedType = type as AccommodationType;

  // --- Check specific ID availability first ---
  if (id) {
    // Check if specific accommodation with `id` is available
    const acc = await prisma.accommodation.findUnique({
      where: { id: Number(id) },
      include: { pictures: true },
    });

    if (!acc || acc.guests < guests) {
      return createResponse([]);
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        accommodationId: Number(id),
        startDate: { lt: checkOut },
        endDate: { gt: checkIn },
      },
    });

    if (!overlappingBooking) {
      return createResponse([acc]); // Available!
    }

    // Not available, continue to search by type fallback
  }

  if (!type) {
    return createResponse([]); // No type to fallback to
  }

  // --- Fallback Search by Type ---
  const accommodations = await prisma.accommodation.findMany({
    where: {
      type: typedType,
      guests: { gte: guests },
    },
    include: { pictures: true },
  });

  const available = await Promise.all(
    accommodations.map(async (acc) => {
      const overlappingBookings = await prisma.booking.findFirst({
        where: {
          accommodationId: acc.id,
          startDate: { lt: checkOut },
          endDate: { gt: checkIn },
        },
      });
      return !overlappingBookings ? acc : null;
    })
  );
  return createResponse(available.filter((a) => a !== null));
}
