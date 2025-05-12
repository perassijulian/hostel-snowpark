"use client";

import { useSearchParams } from "next/navigation";
import SelectField from "./SelectField";
import { AccommodationType } from "@prisma/client";

export function AdminBookingFilters() {
  const searchParams = useSearchParams();
  const typeOptions = Object.values(AccommodationType); // ['DORM', 'PRIVATE', ...]

  return (
    <form className="flex flex-wrap gap-4 mb-6" method="GET">
      <input
        type="search"
        name="search"
        placeholder="Search guest"
        className="border rounded px-3 py-2 w-48"
        defaultValue={searchParams.get("search") || ""}
      />
      <SelectField
        label="Type"
        name="type"
        defaultValue={searchParams.get("type") || ""}
        options={[
          { value: "", label: "All" },
          ...typeOptions.map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
          })),
        ]}
      />
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
