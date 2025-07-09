import type { Accommodation } from "@/types/accommodation";
import LightboxGallery from "@/components/LightboxGallery";

type Props = {
  accommodation: Accommodation;
};

export default function AccommodationSummary({ accommodation }: Props) {
  const images = accommodation.pictures.map((pic) => ({
    src: pic.url,
    alt: pic.altText || "Accommodation image",
  }));

  return (
    <div>
      <div className="max-w-md w-full mx-auto">
        <LightboxGallery images={images} />
      </div>
      <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mt-4">
        {accommodation.name}
      </h1>
      <div className="text-xs text-gray-500">
        {accommodation.guests} guests · ${accommodation.price}/night
      </div>
      <p className="mt-2 text-gray-700">{accommodation.description}</p>
    </div>
  );
}
