import { Accommodation } from "@/types/accommodation";
import { AccommodationCard } from "./AccommodationCard";

type Props = {
  available: Accommodation[] | [];
};

export default function AccommodationAvailable({ available }: Props) {
  if (!available || available.length === 0) return null;

  return (
    <div className="m-4 gap-6">
      {available.map((a) => (
        <AccommodationCard key={a.id} accommodation={a} />
      ))}
    </div>
  );
}
