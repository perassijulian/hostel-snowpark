import { getAccommodationById } from "@/lib/db";
import LightboxGallery from "@/components/LightboxGallery";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";

type Props = {
  params: { id: string };
};

export default async function AccommodationPage({ params }: Props) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const accommodation = await getAccommodationById(id);

  if (!accommodation) return notFound();

  const images = accommodation.pictures.map((pic) => ({
    src: pic.url,
    alt: pic.altText || "Accommodation image",
  }));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <BackButton />
      <LightboxGallery images={images} />
      <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mt-4">
        {accommodation.name}
      </h1>
      <div className=" text-sm text-gray-500">
        {accommodation.guests} guests · ${accommodation.price}/night
      </div>
      <p className="mt-2 text-gray-700">{accommodation.description}</p>
      {/** TO KEEP EXPANDING
       * 
       * <div className="mt-4">
        <h2 className="text-xl font-semibold">Amenities</h2>
        <ul className="list-disc list-inside mt-2">
          {accommodation.amenities.map((amenity, index) => (
            <li key={index} className="text-gray-600">
              {amenity}
            </li>
          ))}
        </ul>
      </div>**/}
      <div className="mt-6 flex justify-center">
        <Button>Book Now</Button>
      </div>
    </div>
  );
}
