"use client";

import { useSearchParams } from "next/navigation";
import SelectField from "./SelectField";
import { AccommodationType } from "@prisma/client";
import InputField from "./InputField";
import Button from "./Button";

export function AdminBookingFilters() {
  const searchParams = useSearchParams();
  const typeOptions = Object.values(AccommodationType); // ['DORM', 'PRIVATE', ...]

  return (
    <form
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-white rounded-xl shadow"
      method="GET"
    >
      <InputField
        type="search"
        name="search"
        label="Search"
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
      <SelectField
        label="Status"
        name="status"
        defaultValue={searchParams.get("type") || ""}
        options={[
          { value: "", label: "All" },
          { value: "confirmed", label: "Confirmed" },
          { value: "cancelled", label: "Cancelled" },
          { value: "pending", label: "Pending" },
        ]}
      />
      <Button type="submit">Filter</Button>
    </form>
  );
}
