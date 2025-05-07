"use client";

import { useEffect, useState } from "react";
import InputField from "./InputField";
import Button from "./Button";
import { useBodyOverflow } from "@/contexts/BodyOverflowContext";
import { useRouter } from "next/navigation";

type Props = {
  accommodation: any;
  checkIn: string;
  checkOut: string;
  guests: number;
};

export default function BookingForm({
  accommodation,
  checkIn,
  checkOut,
  guests,
}: Props) {
  const [formData, setFormData] = useState({
    checkIn,
    checkOut,
    guests,
    name: "",
    email: "",
    phone: "",
    accommodationId: accommodation.id,
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const router = useRouter();

  const { setOverflow } = useBodyOverflow();

  // Sync scroll lock with menu state
  useEffect(() => {
    setOverflow(showConfirmation);
  }, [showConfirmation, setOverflow]);

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
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Make sure email is correctly formatted
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Invalid email format");
      setStatus("error");
      return;
    }

    // Make sure name is not empty
    if (formData.name === "") {
      setErrorMessage("Name should not be empty");
      setStatus("error");
      return;
    }

    // Make sure phone is not empty
    // TODO: check phone number length
    if (formData.phone === "") {
      setErrorMessage("Phone should not be empty");
      setStatus("error");
      return;
    }

    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMessage(result.error);
      return;
    }

    setStatus("success");
    setFormData({
      checkIn,
      checkOut,
      guests,
      name: "",
      email: "",
      phone: "",
      accommodationId: accommodation.id,
    });
    setShowConfirmation(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid grid-cols-3 gap-4">
          <InputField
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            label="Check-In"
            type="date"
            readOnly
            className="cursor-not-allowed"
          />
          <InputField
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            label="Check-Out"
            type="date"
            readOnly
            className="cursor-not-allowed"
          />
          <InputField
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            label="Guests"
            type="number"
            className="cursor-not-allowed"
            readOnly
          />
        </div>
        <InputField
          name="name"
          value={formData.name}
          onChange={handleChange}
          label="Name"
          type="text"
          required
        />
        <InputField
          name="email"
          value={formData.email}
          onChange={handleChange}
          label="Email"
          type="text"
          required
        />
        <InputField
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          label="Phone"
          type="text"
          required
        />
        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Confirm Booking"}
        </Button>
        {status === "error" && <p className="text-red-600">{errorMessage}</p>}
        {status === "success" && (
          <p className="text-green-600">Booking successful!</p>
        )}
      </form>
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm transition-all">
          <div className="bg-white max-w-sm w-full mx-4 p-6 rounded-2xl shadow-xl text-center animate-fadeIn">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Booking Confirmed!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your reservation. We look forward to your stay.
                You will receive a confirmation email shortly.
              </p>
              <Button
                onClick={() => {
                  setShowConfirmation(false);
                  router.push("/");
                }}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
