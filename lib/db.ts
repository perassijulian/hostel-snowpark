import { prisma } from "@/lib/prisma";

export async function getAccommodationById(id: number) {
  return prisma.accommodation.findUnique({
    where: { id },
    include: {
      pictures: true,
    },
  });
}
