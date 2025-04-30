import { prisma } from "@/lib/prisma";

export default async function AccommodationsPage() {
  const accommodations = await prisma.accommodation.findMany();

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Accommodations</h1>

      {accommodations.length === 0 ? (
        <p className="text-gray-600">No accommodations available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((acc) => (
            <div
              key={acc.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold mb-1">{acc.name}</h2>
              <p className="text-gray-500 mb-2">{acc.type}</p>
              <p className="text-gray-800 font-bold">${acc.price} / night</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                {acc.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
