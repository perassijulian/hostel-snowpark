"use client";

import { useSearchParams } from "next/navigation";

export function AdminBookingFilters() {
  const searchParams = useSearchParams();

  return (
    <form className="flex flex-wrap gap-4 mb-6" method="GET">
      <input
        type="search"
        name="search"
        placeholder="Search guest"
        className="border rounded px-3 py-2 w-48"
        defaultValue={searchParams.get("search") || ""}
      />
      <select
        name="type"
        className="border rounded px-3 py-2"
        defaultValue={searchParams.get("type") || ""}
      >
        <option value="">All types</option>
        <option value="private">Private</option>
        <option value="shared">Shared</option>
      </select>
      <select
        name="status"
        className="border rounded px-3 py-2"
        defaultValue={searchParams.get("status") || ""}
      >
        <option value="">All statuses</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
        <option value="pending">Pending</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Filter
      </button>
    </form>
  );
}
