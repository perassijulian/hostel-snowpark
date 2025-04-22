"use client";

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
  // TODO
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      console.error("Invalid email format");
      setStatus("error");
      return;
    }

    // Convert check-in and check-out to Date objects before sending them to the backend
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // TODO
    // setErrorMessage on the validations

    // Make sure the dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid dates");
      setStatus("error");
      return;
    }

    // Make sure the dates are secuential
    if (startDate >= endDate) {
      console.error("End date is before or same as start date");
      setStatus("error");
      return;
    }

    // Make sure guests is a positive number
    if (guests < 1) {
      console.error("Guests is smaller than 1");
      setStatus("error");
      return;
    }

    // Make sure name is not empty
    if (name === "") {
      console.error("Name should not be empty");
      setStatus("error");
      return;
    }

    // Make sure phone is not empty
    // TODO: check phone number length
    if (phone === "") {
      console.error("Phone should not be empty");
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
          <div>
            <label className="block mb-1">Check-in</label>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Check-out</label>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Guests</label>
          <input
            type="number"
            name="guests"
            min="1"
            value={formData.guests}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Accommodation Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="dorm">Dorm</option>
            <option value="cabin">Cabin</option>
            <option value="private">Private Room</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

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
          <p className="text-red-600 mt-2">Something went wrong. Try again.</p>
        )}
      </form>
    </main>
  );
}
