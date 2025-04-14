import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const newBooking = await prisma.booking.create({
      data
    });

    return Response.json(newBooking);
  } catch (error) {
    console.error('Booking Error:', error);
    return Response.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}