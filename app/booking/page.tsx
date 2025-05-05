"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { useAvailability } from "@/hooks/useAvailability";
import AccommodationAvailable from "@/components/AccommodationAvailable";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  // For AccommodationAvailable component
  const queryParams = {
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests: guests || undefined,
  };

  // Only fetch availability if all are defined
  const shouldFetchAvailability = checkIn && checkOut && guests && type;

  const { accommodation, availability, loading, error } = useAvailability(
    shouldFetchAvailability ? { checkIn, checkOut, guests, type } : null
  );

  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    type: "dorm",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAvailable = availability && !loading && !error;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setStatus("submitting");

    const { checkIn, checkOut, guests, type } = formData;

    /**
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Make sure email is correctly formatted
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format");
      setStatus("error");
      return;
    }
     */

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
    /**
 * 
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
 */

    const bookingData = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      guests,
      type,
    };

    try {
      router.push(
        `/booking?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&type=${type}`
      );
      setStatus("success");

      {
        /* Booking logic
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
      */
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Book Your Stay</h1>
      <BookingForm
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={formData}
        status={status}
        errorMessage={errorMessage}
        availability={availability}
        loading={loading}
        error={error}
      />

      <AccommodationAvailable
        queryParams={queryParams}
        available={accommodation}
      />
    </main>
  );
}
