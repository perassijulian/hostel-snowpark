"use client";

import InputField from "@/components/InputField";
import TextAreaField from "@/components/TextAreaField";
import { useState } from "react";

export default function VolunteerPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const { name, email, message } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Make sure email is correctly formatted
    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      setStatus("error");
      return;
    }

    // Make sure name is not empty
    if (name === "") {
      console.error("Name should not be empty");
      setStatus("error");
      return;
    }

    // Make sure message is not empty
    if (message === "") {
      console.error("Message should not be empty");
      setStatus("error");
      return;
    }

    const volunteerData = {
      name,
      email,
      message,
    };

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Volunteer With Us</h1>
      {status === "success" ? (
        <p className="text-green-500">
          Thanks for your interest! We'll be in touch.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className={`space-y-4 ${
            status === "submitting" ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <InputField
            label="Name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <TextAreaField
            label="Why do you want to volunteer?"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
          />
          {status === "error" ? (
            <p className="text-red-500">
              Sorry, your proposal was not submitted. Please try again.
            </p>
          ) : (
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {status === "submitting" ? " Submitting..." : "Send"}
            </button>
          )}
        </form>
      )}
    </div>
  );
}
