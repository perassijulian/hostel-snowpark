import { getAccommodationById } from "@/lib/db";
import { notFound } from "next/navigation";
import AccommodationSummary from "@/components/AccommodationSummary";

type Props = {
  params: { id: string };
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
};

export default async function BookingPage({ params, searchParams }: Props) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const { checkIn, checkOut, guests } = searchParams;

  // Ensure required query params are present
  if (!checkIn || !checkOut || !guests) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-600">
        Missing required booking parameters.
      </div>
    );
  }

  const accommodation = await getAccommodationById(id);
  if (!accommodation) return notFound();

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Review Your Booking</h1>

      <AccommodationSummary accommodation={accommodation} />
    </div>
  );
}
