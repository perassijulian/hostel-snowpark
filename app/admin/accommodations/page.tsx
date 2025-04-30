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
  const [status, setStatus] = useState<"loading" | "loaded">("loading");
  const router = useRouter();

  // Use useEffect to fetch the data client-side
  useEffect(() => {
    const fetchAccommodations = async () => {
      const res = await fetch("/api/admin/accommodations");
      const data = await res.json();
      setAccommodations(data);
      setStatus("loaded");
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
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Accommodations</h1>
        <Link
          href="/admin/accommodations/new"
          className="bg-green-800 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          New +
        </Link>
      </div>

      {accommodations.length === 0 ? (
        <div className="text-center text-gray-500 py-20 border rounded-md shadow-inner">
          {status === "loading" ? "Loading.." : "No accommodations yet."}
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-md shadow-sm">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100 border-b text-sm uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((acc) => (
                <tr
                  key={acc.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{acc.name}</td>
                  <td className="px-4 py-3">{acc.type}</td>
                  <td className="px-4 py-3">${acc.price}/night</td>
                  <td className="px-4 py-3">{acc.guests}</td>
                  <td className="px-4 py-3 text-right space-x-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
