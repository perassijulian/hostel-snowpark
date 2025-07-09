import { Accommodation } from "@/types/accommodation";
import { AccommodationCard } from "./AccommodationCard";

type Props = {
  available: Accommodation[];
  queryParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
};

export default function AccommodationAvailable({
  available,
  queryParams,
}: Props) {
  if (!available || available.length === 0)
    return <p className="text-gray-500 mt-4">No accommodations available.</p>;

  return (
    <div className="flex flex-col gap-6">
      {available.map((a) => (
        <AccommodationCard
          key={a.id}
          accommodation={a}
          queryParams={queryParams}
        />
      ))}
    </div>
  );
}
