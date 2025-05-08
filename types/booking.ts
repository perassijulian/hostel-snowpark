import type { Booking, Accommodation } from "@prisma/client";

export type BookingType = Booking & {
  accommodation: Accommodation;
};
