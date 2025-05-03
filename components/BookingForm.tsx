import { useState } from "react";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";

interface BookingFormProps {
  onSubmit: (formData: any) => void;
  formData: any;
  status: "idle" | "submitting" | "success" | "error";
  errorMessage: string | null;
  availability: any; // Pass availability data here
  loading: boolean;
  error: string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function BookingForm({
  onSubmit,
  formData,
  status,
  errorMessage,
  availability,
  loading,
  error,
  onChange,
}: BookingFormProps) {
  const { checkIn, checkOut, guests, type, name, email, phone } = formData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          onChange={onChange}
          required
        />

        <InputField
          label="Check-Out"
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={onChange}
          required
        />
      </div>

      <InputField
        label="Guests"
        type="number"
        name="guests"
        min="1"
        value={formData.guests}
        onChange={onChange}
        required
      />

      <SelectField
        label="Accomodation Type"
        name="type"
        value={formData.type}
        onChange={onChange}
        options={[
          { value: "dorm", label: "Dorm" },
          { value: "cabin", label: "Cabin" },
          { value: "private", label: "Private Room" },
        ]}
      />

      <InputField
        label="Full Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        required
      />

      <InputField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        required
      />
      <InputField
        label="Phone"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        required
      />

      {/* Show availability or loading state */}
      {loading && <p>Checking availability...</p>}
      {error && <p>{`Failed to fetch availability. Error ${error}`}</p>}
      {availability && (
        <div>
          <h3>Available Rooms:</h3>
          <ul>
            {availability.map((room: any) => (
              <li key={room.id}>{room.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
      >
        {status === "submitting" ? "Submitting..." : "Book Now"}
      </button>

      {status === "success" && (
        <p className="text-green-600 mt-2">Booking submitted successfully!</p>
      )}
      {status === "error" && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}
