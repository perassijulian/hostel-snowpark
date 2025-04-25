import { prisma } from "@/lib/prisma"; // use Prisma singleton
import { format } from "date-fns";

export const dynamic = "force-dynamic"; // make sure it always fetches fresh data

export default async function AdminBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: { startDate: "asc" },
  });

  return (
    <main className="p-6 max-w-4xl mx-auto h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">All Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Guest</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Check‑in</th>
                <th className="py-2 pr-4">Check‑out</th>
                <th className="py-2">Guests</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">{b.name}</td>
                  <td className="py-2 pr-4 capitalize">{b.type}</td>
                  <td className="py-2 pr-4">
                    {format(new Date(b.startDate), "dd MMM yyyy")}
                  </td>
                  <td className="py-2 pr-4">
                    {format(new Date(b.endDate), "dd MMM yyyy")}
                  </td>
                  <td className="py-2">{b.guests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
