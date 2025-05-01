import { prisma } from "@/lib/prisma";

export async function GET() {
  const accommodations = await prisma.accommodation.findMany({
    include: {
      pictures: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return new Response(JSON.stringify(accommodations), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
