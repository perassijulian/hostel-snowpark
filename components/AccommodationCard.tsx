import { Accommodation } from "@/types/accommodation";
import Link from "next/link";

type Props = {
  accommodation: Accommodation;
};

export function AccommodationCard({ accommodation }: Props) {
  const primaryImage =
    accommodation.pictures.find((p) => p.isPrimary) ||
    accommodation.pictures[0];

  return (
    <Link
      href={`/accommodation/${accommodation.id}`}
      className="block bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow"
      aria-label={`View details for ${accommodation.name}`}
    >
      <img
        src={primaryImage?.url}
        alt={primaryImage?.altText || accommodation.name}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h2 className="text-lg font-bold text-gray-800">{accommodation.name}</h2>
      <p className="text-gray-600 mt-1">{accommodation.description}</p>
      <div className="mt-2 text-sm text-gray-500">
        {accommodation.guests} guests · ${accommodation.price}/night
      </div>
    </Link>
  );
}
