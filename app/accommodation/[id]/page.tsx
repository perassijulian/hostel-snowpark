import { getAccommodationById } from "@/lib/db";
import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import AccommodationSummary from "@/components/AccommodationSummary";
import AvailabilityForm from "@/components/AvailabilityForm";

type Props = {
  params: Promise<{ id?: string }>;
};

export default async function AccommodationPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (isNaN(id)) return notFound();

  const accommodation = await getAccommodationById(id);

  if (!accommodation) return notFound();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <BackButton />
      <AccommodationSummary accommodation={accommodation} />
      <AvailabilityForm accommodation={accommodation} />
    </div>
  );
}
