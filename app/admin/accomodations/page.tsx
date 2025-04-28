import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // always fresh data

export default async function AdminAccommodations() {
  const accommodations = await prisma.accommodation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Accommodations</h1>

      {accommodations.length === 0 ? (
        <p className="text-gray-600">No accommodations yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Price (USD)</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {accommodations.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4 capitalize">{a.type}</td>
                  <td className="py-2 pr-4">${a.price.toFixed(2)}</td>
                  <td className="py-2">{a.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
