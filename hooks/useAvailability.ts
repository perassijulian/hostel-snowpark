import { Accommodation } from "@/types/accommodation";
import { useState, useEffect } from "react";

type AvailabilityParams = {
  checkIn: string;
  checkOut: string;
  guests: string;
  type?: string;
  id?: string;
} | null;

export function useAvailability(params: AvailabilityParams) {
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [accommodation, setAccommodation] = useState<Accommodation[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params) return;
    const { checkIn, checkOut, guests, type = "", id = "" } = params;

    if (!checkIn || !checkOut || !guests || (!type && !id)) return;

    const query = new URLSearchParams({
      checkIn,
      checkOut,
      guests,
      ...(id ? { id } : { type }),
    });

    const checkAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/accommodation/availability?${query.toString()}`
        );

        if (!res.ok) throw new Error("Error checking availability.");

        const json = await res.json();
        const data = json.data ?? [];

        setAvailability(data.length > 0);
        setAccommodation(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
        setAvailability(false);
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();
  }, [
    params?.checkIn,
    params?.checkOut,
    params?.guests,
    params?.type,
    params?.id,
  ]);

  return {
    accommodation,
    availability,
    loading,
    error,
    searchedById: Boolean(params?.id),
  };
}
