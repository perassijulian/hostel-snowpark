"use client";

import { useEffect, useState } from "react";

type Accommodation = {
  id: number;
  name: string;
  description: string;
  price: number;
  guests: number;
  pictures: {
    url: string;
    isPrimary: boolean;
    altText?: string;
  }[];
};

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
    return (
      <div className="text-center py-10 text-gray-500">
        Loading accommodations...
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No accommodations available at the moment.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accommodations.map((accom) => {
        const primaryImage =
          accom.pictures.find((p) => p.isPrimary) || accom.pictures[0];

        return (
          <div
            key={accom.id}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-shadow"
          >
            <img
              src={primaryImage?.url}
              alt={primaryImage?.altText || accom.name}
              className="w-full h-48 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-bold text-gray-800">{accom.name}</h2>
            <p className="text-gray-600 mt-1">{accom.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              {accom.guests} guests · ${accom.price}/night
            </div>
          </div>
        );
      })}
    </div>
  );
}
