"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Accommodation = {
  id: string;
  name: string;
  type: string;
  price: number;
  guests: number;
};

export default function AdminAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const router = useRouter();

  // Use useEffect to fetch the data client-side
  useEffect(() => {
    const fetchAccommodations = async () => {
      const res = await fetch("/api/admin/accommodations");
      const data = await res.json();
      setAccommodations(data);
    };
    fetchAccommodations();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this?");
    if (!confirmed) return;

    const res = await fetch(`/api/admin/accommodations/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setAccommodations(accommodations.filter((acc) => acc.id !== id));
    } else {
      alert("Failed to delete.");
    }
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Accommodations</h1>
        <Link
          href="/admin/accommodations/new"
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          New Accommodation
        </Link>
      </div>

      {accommodations.length === 0 ? (
        <p className="text-gray-600">No accommodations yet.</p>
      ) : (
        <ul className="divide-y border mt-4">
          {accommodations.map((acc) => (
            <li key={acc.id} className="py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{acc.name}</h2>
                <p className="text-gray-500">
                  {acc.type} · ${acc.price}/night
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() =>
                    router.push(`/admin/accommodations/${acc.id}/edit`)
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(acc.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
