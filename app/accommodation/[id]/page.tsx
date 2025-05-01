import { getAccommodationById } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

type Props = {
  params: {
    id: string;
  };
};

export default async function AccommodationDetailPage({ params }: Props) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return notFound();
  }
  const accommodation = await getAccommodationById(Number(id));

  if (!accommodation) return notFound();

  const primaryImage = accommodation.pictures.find((pic) => pic.isPrimary);
  const otherImages = accommodation.pictures.filter((pic) => !pic.isPrimary);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{accommodation.name}</h1>
      <p className="text-gray-700 mb-2">{accommodation.description}</p>
      <p className="text-gray-600 mb-2">Price: ${accommodation.price}</p>
      <p className="text-gray-600 mb-6">Max Guests: {accommodation.guests}</p>

      {primaryImage && (
        <div className="mb-4">
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || "Primary image"}
            width={800}
            height={500}
            className="rounded-md shadow-md"
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {otherImages.map((pic) => (
          <Image
            key={pic.id}
            src={pic.url}
            alt={pic.altText || "Accommodation image"}
            width={300}
            height={200}
            className="rounded-md object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const accommodations = await prisma.accommodation.findMany({
    select: { id: true },
  });

  return accommodations.map((acc) => ({
    id: acc.id.toString(),
  }));
}
