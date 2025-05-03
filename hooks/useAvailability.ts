import { useState, useEffect } from "react";

export function useAvailability(params: any) {
  const [availability, setAvailability] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { checkIn, checkOut, guests, type } = params || {};

  useEffect(() => {
    if (!checkIn || !checkOut || !guests || !type) return;

    const checkAvailability = async () => {
      if (!params) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/accommodation/availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&type=${type}`
        );
        if (!res.ok) throw new Error("Error checking availability.");

        const data = await res.json();
        console.log("Availability data:", data);
        setAvailability(data.isAvailable);
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
  }, [params?.checkIn, params?.checkOut, params?.guests, params?.type]);

  return { availability, loading, error };
}
