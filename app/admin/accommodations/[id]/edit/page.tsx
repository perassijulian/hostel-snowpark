"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import InputField from "@/components/InputField";
import TextAreaField from "@/components/TextAreaField";

type Accommodation = {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  guests: number;
};

export default function EditAccommodationPage() {
  const router = useRouter();
  const { id } = useParams();
  const [formData, setFormData] = useState<Accommodation | null>(null);

  // Fetch accommodation data
  useEffect(() => {
    if (id) {
      fetch(`/api/admin/accommodations/${id}`)
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((error) =>
          console.error("Error fetching accommodation:", error)
        );
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        const res = await fetch(`/api/admin/accommodations/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          router.push("/admin/accommodations");
        } else {
          console.error("Failed to update accommodation");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!formData) {
    return <p>Loading...</p>;
  }

  return (
    <main className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Edit Accommodation</h1>

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
        <InputField
          label="Guests"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          required
          type="number"
        />
        <TextAreaField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

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
