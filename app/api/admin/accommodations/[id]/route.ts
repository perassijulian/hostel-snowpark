import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const accommodation = await prisma.accommodation.findUnique({
      where: { id: Number(id) },
    });

    if (!accommodation) {
      return NextResponse.json(
        { error: "Accommodation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(accommodation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const price = Number(body.price);
    const guests = Number(body.guests);
    const { name, type, description } = body;

    if (!id || !name || !type || !price || !description || !guests) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedAccommodation = await prisma.accommodation.update({
      where: { id: Number(id) },
      data: {
        name,
        type,
        price,
        description,
        guests,
      },
    });

    return NextResponse.json(updatedAccommodation);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update accommodation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.accommodation.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
