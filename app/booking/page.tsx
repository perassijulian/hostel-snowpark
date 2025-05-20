"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AvailabilityForm from "@/components/AvailabilityForm";
import { useAvailability } from "@/hooks/useAvailability";
import AccommodationAvailable from "@/components/AccommodationAvailable";
import { useEffect, useRef, useState } from "react";
import { Accommodation } from "@/types/accommodation";

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

  const id = searchParams.get("id");
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
    checkIn && checkOut && guests && type && !id && !skipDefaultFetch
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

  // First check availability for specific accommodation ID
  useEffect(() => {
    const fetchAvailabilityById = async () => {
      if (!id || !checkIn || !checkOut || !guests) return;

      try {
        const params = new URLSearchParams();

        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        if (guests) params.set("guests", guests);
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
    <main className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
      <AvailabilityForm error={error} status={status} setStatus={setStatus} />
      {!loading && shouldFetchAvailability && (
        <>
          {availability ? (
            <AccommodationAvailable
              queryParams={queryParams}
              available={accommodation}
            />
          ) : (
            <div className="mt-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">No availability</p>
                <p>
                  Sorry, we don't have any{" "}
                  <span className="font-semibold">{type}</span> available from{" "}
                  <span className="font-semibold">{checkIn}</span> to{" "}
                  <span className="font-semibold">{checkOut}</span>. Try
                  adjusting your dates or accommodation type.
                </p>
              </div>
            </div>
          )}
        </>
      )}

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
