import { Accommodation } from "@/types/accommodation";
import { AccommodationCard } from "./AccommodationCard";

type Props = {
  available: Accommodation[] | [];
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
  if (!available || available.length === 0) return null;

  return (
    <div className="gap-6">
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
