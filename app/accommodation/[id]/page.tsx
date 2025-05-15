import { getAccommodationById } from "@/lib/db";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import AccommodationSummary from "@/components/AccommodationSummary";
import AvailabilityForm from "@/components/AvailabilityForm";

type Props = {
  params: Promise<{ id?: string }>;
};

export default async function AccommodationPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) return notFound();

  if (isNaN(id)) return notFound();

  const accommodation = await getAccommodationById(id);

  if (!accommodation) return notFound();

  console.log("Accommodation data:", accommodation);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <BackButton />
      <AccommodationSummary accommodation={accommodation} />
      <AvailabilityForm
        onSubmit={(formData) => {
          console.log("Booking attempt:", formData);
          // You can eventually connect this to an API route or mutation
        }}
        status="idle"
        setStatus={() => {}}
        accommodation={accommodation} // 💥 pass full object
      />
    </div>
  );
}
