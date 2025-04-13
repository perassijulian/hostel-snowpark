import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Just log it for now — TODO write to DB, file, or send email
        console.log('New Volunteer:', data);

        return NextResponse.json({ message: 'Received' }, { status: 200 });
    } catch (error) {
        console.error('Volunteer Error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}