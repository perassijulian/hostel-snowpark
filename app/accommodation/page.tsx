"use client";

import { AccommodationCard } from "@/components/AccommodationCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Accommodation } from "@/types/accommodation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/accommodation")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched accommodations:", data);
        setAccommodations(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching accommodations:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingSpinner description="Loading accommodations..." />;
  }

  if (accommodations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No accommodations available at the moment.
      </div>
    );
  }

  return (
    <div className="grid m-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accommodations.map((a) => (
        <AccommodationCard key={a.id} accommodation={a} />
      ))}
    </div>
  );
}
