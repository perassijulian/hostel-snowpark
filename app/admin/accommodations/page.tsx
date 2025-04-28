import { prisma } from "@/lib/prisma";
// import { formatCurrency } from "@/lib/utils"; // We'll format prices nicely (optional helper)
import Link from "next/link";

export const dynamic = "force-dynamic"; // Always fresh data

export default async function AdminAccommodations() {
  const accommodations = await prisma.accommodation.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Accommodations</h1>
        <Link
          href="/admin/accommodations/new" // you can create this page later
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
        >
          New Accommodation
        </Link>
      </div>

      {accommodations.length === 0 ? (
        <p className="text-gray-600">No accommodations yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Guests</th>
                <th className="py-2 pr-4">Price per Night</th>
                <th className="py-2 pr-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4 capitalize">{a.type}</td>
                  <td className="py-2 pr-4 capitalize">{a.guests}</td>
                  <td className="py-2 pr-4">{a.price}</td>
                  <td className="py-2 pr-4 text-gray-600">{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
