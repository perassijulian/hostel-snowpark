"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AvailabilityForm from "@/components/AvailabilityForm";
import { useAvailability } from "@/hooks/useAvailability";
import AccommodationAvailable from "@/components/AccommodationAvailable";
import { useEffect, useRef, useState } from "react";

export default function BookingPage() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const prevLoading = useRef<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  // For AccommodationAvailable component
  const queryParams = {
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests: guests || undefined,
  };

  // Only fetch availability if all are defined
  const shouldFetchAvailability = Boolean(
    checkIn && checkOut && guests && type
  );

  const { accommodation, availability, loading, error } = useAvailability(
    shouldFetchAvailability
      ? {
          checkIn: checkIn as string,
          checkOut: checkOut as string,
          guests: guests as string,
          type: type as string,
        }
      : null
  );
  console.log("availability", availability);
  console.log("accommodation", accommodation);
  console.log("loading", loading);

  useEffect(() => {
    if (!prevLoading.current && loading) {
      // New request started
      setStatus("submitting");
    }

    if (prevLoading.current && !loading) {
      // Request just finished
      setStatus("success");
    }

    prevLoading.current = loading;
  }, [loading]);

  const handleFormSubmit = ({
    checkIn,
    checkOut,
    guests,
    type,
  }: {
    checkIn: string;
    checkOut: string;
    guests: number;
    type: string;
  }) => {
    setStatus("submitting");
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
      type,
    });

    router.push(`/booking?${params}`);
  };

  return (
    <main className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
      <AvailabilityForm
        setStatus={setStatus}
        status={status}
        onSubmit={handleFormSubmit}
        error={error}
      />
      {status === "success" && !availability && !loading ? (
        <div className="mt-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">No availability</p>
            <p>
              Sorry, we don't have any{" "}
              <span className="font-semibold">{type}</span> available from{" "}
              <span className="font-semibold">{checkIn}</span> to{" "}
              <span className="font-semibold">{checkOut}</span>. Try adjusting
              your dates or accommodation type.
            </p>
          </div>
        </div>
      ) : (
        <AccommodationAvailable
          queryParams={queryParams}
          available={accommodation}
        />
      )}
    </main>
  );
}
