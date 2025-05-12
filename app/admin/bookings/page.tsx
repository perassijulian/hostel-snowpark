import { AdminBookingFilters } from "@/components/AdminBookingsFilter";
import { prisma } from "@/lib/prisma";
import { BookingType } from "@/types/booking";
import { format } from "date-fns";

type Props = {
  searchParams: Promise<{
    search?: string;
    type?: string;
    status?: string;
  }>;
};

export const dynamic = "force-dynamic"; // make sure it always fetches fresh data

export default async function AdminBookings(props: Props) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const type = searchParams.type || "";
  const status = searchParams.status || "";

  let bookings: BookingType[] = [];
  let error = null;

  try {
    bookings = await prisma.booking.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" } },
                  { email: { contains: search, mode: "insensitive" } },
                ],
              }
            : {},
          type ? { accommodation: { type: type } } : {},
        ],
      },
      include: {
        accommodation: true,
      },
      orderBy: { startDate: "asc" },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    error = "Failed to load bookings. Please try again.";
    bookings = [];
  }

  bookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = type ? b.accommodation.type === type : true;
    const matchesStatus = true; // Placeholder for status filtering
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatus = (startDate: Date, endDate: Date) => {
    const today = new Date();
    if (today < startDate)
      return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
    if (today > endDate)
      return { label: "Completed", color: "bg-slate-200 text-slate-800" };
    return { label: "Ongoing", color: "bg-emerald-100 text-emerald-800" };
  };

  return (
    <main className="p-6 max-w-4xl mx-auto h-full overflow-auto">
      <h1 className="text-3xl font-bold mb-6">All Bookings</h1>

      <AdminBookingFilters />

      {error ? (
        <p className="text-red-600 bg-red-100 border border-red-200 p-4 rounded-lg shadow-sm">
          {error}
        </p>
      ) : bookings.length === 0 ? (
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
                <th className="py-2 pr-4">Guests</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                return (
                  <tr key={b.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 pr-4">{b.name}</td>
                    <td className="py-2 pr-4 capitalize">
                      {b.accommodation.type}
                    </td>
                    <td className="py-2 pr-4">
                      {format(new Date(b.startDate), "dd MMM yyyy")}
                    </td>
                    <td className="py-2 pr-4">
                      {format(new Date(b.endDate), "dd MMM yyyy")}
                    </td>
                    <td className="py-2 pr-4">{b.guests}</td>
                    <td className="py-2 pr-4">
                      {(() => {
                        const { label, color } = getStatus(
                          new Date(b.startDate),
                          new Date(b.endDate)
                        );
                        return (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-default ${color}`}
                          >
                            {label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
