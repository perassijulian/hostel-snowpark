"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../../../../components/InputField";
//import SelectField from "../../../../components/SelectField";

export default function NewAccommodationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/accomodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (res.ok) {
        router.push("/admin/accommodations");
      } else {
        console.error("Failed to create accommodation");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Accommodation</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <InputField
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />

        <InputField
          label="Price per Night"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          type="number"
        />

        {/** <TextAreaField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
  /> **/}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => router.push("/admin/accommodations")}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </main>
  );
}
