"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderPlus, PlusSquareIcon, Settings, Trash2 } from "lucide-react";

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
      <h2 className="text-3xl font-bold">All Accommodations</h2>

      {accommodations.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          {status === "loading" ? "Loading.." : "No accommodations yet."}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 border-b text-sm uppercase tracking-wide">
              <tr className="border-b">
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
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() =>
                        router.push(`/admin/accommodations/${acc.id}/edit`)
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      title="Edit"
                    >
                      <Settings className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr className="border-t hover:bg-gray-50 transition">
                <td colSpan={5} className="px-4 py-4 text-center">
                  <Link
                    href="/admin/accommodations/new"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                  >
                    <PlusSquareIcon className="w-5 h-5" />
                    Add New Accommodation
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
