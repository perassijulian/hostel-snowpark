import { Accommodation } from "@/types/accommodation";
import Image from "next/image";
import Link from "next/link";

type Props = {
  accommodation: Accommodation;
  queryParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
};

export function AccommodationCard({ accommodation, queryParams }: Props) {
  const { name, id, description, guests, price, pictures } = accommodation;
  const primaryImage = pictures.find((p) => p.isPrimary) || pictures[0];

  const href = queryParams
    ? {
        pathname: `/booking/${id}`,
        query: queryParams,
      }
    : `/accommodation/${id}`;

  return (
    <Link
      href={href}
      className="block bg-white  border border-gray-200 shadow-sm hover:shadow-md transition rounded-xl p-4 mt-6"
      aria-label={`View details for ${name}`}
    >
      <Image
        src={primaryImage?.url}
        alt={primaryImage?.altText || name}
        width={400}
        height={192}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h2 className="text-lg font-bold text-gray-800">{name}</h2>
      <p className="text-gray-600 mt-1">{description}</p>
      <div className="mt-2 text-sm text-gray-500">
        {guests} guests · ${price}/night
      </div>
    </Link>
  );
}
