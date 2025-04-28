"use client";

import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { useState } from "react";

export default function BookingPage() {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    type: "dorm",
    name: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const { checkIn, checkOut, guests, type, name, email, phone } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Make sure email is correctly formatted
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      setStatus("error");
      return;
    }

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

    // Make sure guests is a positive number
    if (guests < 1) {
      setErrorMessage("Guests should be a positive integer");
      setStatus("error");
      return;
    }

    // Make sure name is not empty
    if (name === "") {
      setErrorMessage("Name should not be empty");
      setStatus("error");
      return;
    }

    // Make sure phone is not empty
    // TODO: check phone number length
    if (phone === "") {
      setErrorMessage("Phone should not be empty");
      setStatus("error");
      return;
    }

    const bookingData = {
      name,
      email,
      phone,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      guests,
      type,
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.error);
      }

      if (res.ok) {
        setStatus("success");
        setFormData({
          checkIn: "",
          checkOut: "",
          guests: 1,
          type: "dorm",
          name: "",
          email: "",
          phone: "",
        });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
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

        <SelectField
          label="Accomodation Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
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
          onChange={handleChange}
          required
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

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
    </main>
  );
}
