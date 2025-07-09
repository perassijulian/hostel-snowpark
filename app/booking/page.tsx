"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AvailabilityForm from "@/components/AvailabilityForm";
import { useAvailability } from "@/hooks/useAvailability";
import AccommodationAvailable from "@/components/AccommodationAvailable";
import { useEffect, useRef, useState } from "react";
import { Accommodation } from "@/types/accommodation";
import NoAvailabilityMessage from "@/components/NoAvailabilityMessage";
import { z } from "zod";

const paramsSchema = z.object({
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.string().pipe(z.coerce.number().int().positive()),
  type: z.string(),
  id: z.string().optional(),
});

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevLoading = useRef<boolean>(false);

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const [fallbackResults, setFallbackResults] = useState<Accommodation[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [skipDefaultFetch, setSkipDefaultFetch] = useState(false);

  const rawParams = Object.fromEntries(searchParams.entries());
  const parsedParams = paramsSchema.safeParse(rawParams);
  if (!parsedParams.success) {
    console.error(
      "Invalid query params: ",
      parsedParams.error.flatten().fieldErrors
    );
    return (
      <main className="max-w-xl mx-auto p-6 mt-6">
        <p className="text-red-600 font-medium">
          Invalid or missing query parameters. Please check your search and try
          again.
        </p>
      </main>
    );
  }

  const { id, type, checkIn, checkOut, guests } = parsedParams.data;

  // For AccommodationAvailable component
  const queryParams = {
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests: guests.toString() || undefined,
  };

  // Only fetch availability if all are defined
  const shouldFetchAvailability = Boolean(
    checkIn && checkOut && guests && type && !id && !skipDefaultFetch
  );

  const { accommodation, availability, loading, error } = useAvailability(
    shouldFetchAvailability
      ? {
          checkIn: checkIn,
          checkOut: checkOut,
          guests: guests.toString(),
          type,
        }
      : null
  );

  // First check availability for specific accommodation ID
  useEffect(() => {
    const fetchAvailabilityById = async () => {
      if (!id || !checkIn || !checkOut || !guests) return;

      try {
        const params = new URLSearchParams();

        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        if (guests) params.set("guests", guests.toString());
        if (type) params.set("type", type);
        if (id) params.set("id", id.toString());

        const res = await fetch(`/api/accommodation/availability?${params}`);
        const available = await res.json();
        const data = available.data;

        if (data.length === 1 && data[0].id.toString() === id) {
          router.replace(
            `/booking/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
          );
        } else if (data.length > 0) {
          setFallbackResults(data);
          setMessage(
            `Sorry, that accommodation is not available, but those days this ${type} are:`
          );
        } else {
          setMessage(
            "Sorry, no accommodations are available for your criteria."
          );
        }
      } catch (err) {
        console.error("Error checking specific accommodation:", err);
        setMessage("Something went wrong while checking availability.");
      }
    };

    if (id && checkIn && checkOut) {
      setSkipDefaultFetch(true); // prevent hook from running too early
      fetchAvailabilityById();
    }
  }, [id, checkIn, checkOut, guests, type]);

  useEffect(() => {
    if (!prevLoading.current && loading) {
      // A new request just started
      setStatus("submitting");
    }

    if (prevLoading.current && !loading) {
      // The request just finished
      setStatus("success");
    }

    prevLoading.current = loading;
  }, [loading]);

  return (
    <main className="w-full max-w-4xl mx-auto p-6 mt-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
      <AvailabilityForm error={error} status={status} setStatus={setStatus} />
      <hr className="my-6 border-gray-200" />
      {!loading && shouldFetchAvailability ? (
        availability ? (
          <AccommodationAvailable
            queryParams={queryParams}
            available={accommodation}
          />
        ) : (
          <NoAvailabilityMessage
            type={type || ""}
            checkIn={checkIn || ""}
            checkOut={checkOut || ""}
          />
        )
      ) : null}

      {message && (
        <>
          <div className="mt-8">
            <p className="text-yellow-800 font-medium mb-4">{message}</p>
          </div>
          {fallbackResults.length > 0 && (
            <AccommodationAvailable
              queryParams={queryParams}
              available={fallbackResults}
            />
          )}
        </>
      )}
    </main>
  );
}
