import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Just log it for now — TODO write to DB, file, or send email
    console.log('New Booking:', data);

    return NextResponse.json({ message: 'Booking received' }, { status: 200 });
  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}