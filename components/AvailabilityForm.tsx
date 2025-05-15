"use client";

import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import Button from "./Button";
import { useState } from "react";
import { AccommodationType, Accommodation } from "@prisma/client";

interface AvailabilityProps {
  onSubmit: (formData: {
    checkIn: string;
    checkOut: string;
    guests: number;
    type: string;
  }) => void;
  status: "idle" | "submitting" | "success" | "error";
  setStatus: (status: "idle" | "submitting" | "success" | "error") => void;
  error?: string | null;
  accommodation?: Accommodation | null;
}

export default function AvailabilityForm({
  onSubmit,
  status,
  setStatus,
  error = null,
  accommodation = null,
}: AvailabilityProps) {
  const MAXGUESTS = 10; // Default max guests if not specified
  const isSpecific = !!accommodation;
  const maxGuests = accommodation?.guests || MAXGUESTS;

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    type: "DORM",
  });

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
    setStatus("submitting");
    setErrorMessage(null);

    const { checkIn, checkOut, guests, type } = formData;

    // Convert check-in and check-out to Date objects before sending them to the backend
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Make sure the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setErrorMessage("Invalid dates");
      setStatus("error");
      return;
    }

    // Make sure the dates are secuential
    if (startDate >= endDate) {
      setErrorMessage("End date is before or same as start date");
      setStatus("error");
      return;
    }

    // Existing guest validation
    if (guests < 1) {
      setErrorMessage("Guests should be a positive integer");
      setStatus("error");
      return;
    }

    if (guests > maxGuests) {
      setErrorMessage(`Max ${maxGuests} guests allowed for this accommodation`);
      setStatus("error");
      return;
    }

    // Make sure type is a valid accommodation type
    if (!typeOptions.includes(type as AccommodationType)) {
      setErrorMessage("Invalid accommodation type");
      setStatus("error");
      return;
    }

    try {
      onSubmit({
        ...formData,
        type: lockedType,
      });
    } catch (err) {
      setStatus("error");
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

      <Button className="mt-4" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Checking..." : "Check availability"}
      </Button>

      {status === "error" && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}
