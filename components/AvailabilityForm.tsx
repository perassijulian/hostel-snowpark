"use client";

import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import Button from "./Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccommodationType, Accommodation } from "@prisma/client";

interface AvailabilityProps {
  error?: string | null;
  accommodation?: Accommodation | null;
  status?: "idle" | "submitting" | "success" | "error";
  setStatus?: (status: "idle" | "submitting" | "success" | "error") => void;
}

export default function AvailabilityForm({
  error = null,
  accommodation = null,
  status,
  setStatus,
}: AvailabilityProps) {
  const MAXGUESTS = 10; // Default max guests if not specified
  const isSpecific = !!accommodation;
  const maxGuests = accommodation?.guests || MAXGUESTS;

  const router = useRouter();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    type: "DORM",
  });

  const [internalStatus, setInternalStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const effectiveStatus = status ?? internalStatus;
  const updateStatus = setStatus ?? setInternalStatus;

  const lockedType = accommodation?.type || formData.type;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const typeOptions = Object.values(AccommodationType); // ['DORM', 'PRIVATE', ...]

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateStatus("submitting");
    setErrorMessage(null);

    const { checkIn, checkOut, guests, type } = formData;

    // Convert check-in and check-out to Date objects before sending them to the backend
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Make sure the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setErrorMessage("Invalid dates");
      updateStatus("error");
      return;
    }

    // Make sure the dates are secuential
    if (startDate >= endDate) {
      setErrorMessage("End date is before or same as start date");
      updateStatus("error");
      return;
    }

    // Existing guest validation
    if (guests < 1) {
      setErrorMessage("Guests should be a positive integer");
      updateStatus("error");
      return;
    }

    if (guests > maxGuests) {
      setErrorMessage(`Max ${maxGuests} guests allowed for this accommodation`);
      updateStatus("error");
      return;
    }

    // Make sure type is a valid accommodation type
    if (!typeOptions.includes(type as AccommodationType)) {
      setErrorMessage("Invalid accommodation type");
      updateStatus("error");
      return;
    }

    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        guests: guests.toString(),
        type,
      });

      router.push(`/booking?${params}`);
      updateStatus("success");
    } catch (err) {
      updateStatus("error");
      setErrorMessage("An error occurred while booking");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid gap-4 duration-200 ${
        status === "submitting" ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Check-In"
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          required
        />

        <InputField
          label="Check-Out"
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          required
        />
      </div>

      <InputField
        label="Guests"
        type="number"
        name="guests"
        min="1"
        value={formData.guests}
        onChange={handleChange}
        required
      />
      {!isSpecific && (
        <SelectField
          label="Accomodation Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions.map((type) => ({
            value: type,
            label: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
          }))}
        />
      )}
      {error && <p>{`Failed to fetch availability. Error ${error}`}</p>}

      <Button
        className="mt-4"
        type="submit"
        disabled={effectiveStatus === "submitting"}
      >
        {effectiveStatus === "submitting"
          ? "Checking..."
          : "Check availability"}
      </Button>

      {effectiveStatus === "error" && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}
