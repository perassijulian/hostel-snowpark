import { getAccommodationById } from "@/lib/db";
import LightboxGallery from "@/components/LightboxGallery";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function AccommodationPage({ params }: Props) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const accommodation = await getAccommodationById(id);
  if (!accommodation) return notFound();

  console.log("Accommodation data:", accommodation);

  const images = accommodation.pictures.map((pic) => ({
    src: pic.url,
    alt: pic.altText || "Accommodation image",
  }));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <LightboxGallery images={images} />
      <h1 className="text-3xl font-bold mt-6">{accommodation.name}</h1>
      <p className="mt-2 text-gray-700">{accommodation.description}</p>
    </div>
  );
}
