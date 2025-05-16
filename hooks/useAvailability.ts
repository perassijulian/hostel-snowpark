import { Accommodation } from "@/types/accommodation";
import { useState, useEffect } from "react";

type AvailabilityParams = {
  checkIn: string;
  checkOut: string;
  guests: string;
  type: string;
  id?: string;
} | null;

export function useAvailability(params: AvailabilityParams) {
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [accommodation, setAccommodation] = useState<Accommodation[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { checkIn, checkOut, guests, type, id } = params || {};

  useEffect(() => {
    if (!checkIn || !checkOut || !guests || (!type && !id)) return;

    const checkAvailability = async () => {
      if (!params) return;
      setLoading(true);

      const query = new URLSearchParams({
        checkIn,
        checkOut,
        guests,
        ...(id ? { id } : { type: type || "" }),
      });

      try {
        const res = await fetch(
          `/api/accommodation/availability?${query.toString()}`
        );
        if (!res.ok) throw new Error("Error checking availability.");

        const data = await res.json();
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

  return { accommodation, availability, loading, error };
}
