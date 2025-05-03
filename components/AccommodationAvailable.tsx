import { Accommodation } from "@/types/accommodation";

type Props = {
  available: Accommodation[] | [];
};

export default function AccommodationAvailable({ available }: Props) {
  if (!available || available.length === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-2xl font-bold text-green-800">Available Rooms</h2>
      {available.map((acc) => (
        <div
          key={acc.id}
          className="p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <h3 className="text-lg font-semibold">{acc.name}</h3>
          <p>Description: {acc.description}</p>
          <p>Capacity: {acc.guests} guests</p>
          <p>Price: ${acc.price}</p>
        </div>
      ))}
    </div>
  );
}
