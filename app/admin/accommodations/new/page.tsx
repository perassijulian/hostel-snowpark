"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import TextAreaField from "@/components/TextAreaField";
import { UploadButton } from "@/utils/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import Link from "next/link";

export default function NewAccommodationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    guests: 1,
    pictures: [] as string[],
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/admin/accommodations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
        }),
      });

      if (res.ok) {
        setStatus("success");
        router.push("/admin/accommodations");
      } else {
        setStatus("error");
        console.error("Failed to create accommodation");
      }
    } catch (err) {
      setStatus("error");
      console.error(err);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-2xl">
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

        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (!res) return;
            const urls = res.map((file) => file.url);
            setFormData((prev) => ({
              ...prev,
              pictures: [...prev.pictures, ...urls],
            }));
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />

        {formData.pictures.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mt-4 mb-2">
              Uploaded Pictures:
            </h2>
            <ul className="space-y-2">
              {formData.pictures.map((URL, index) => (
                <li
                  key={URL}
                  className="flex items-center space-x-4 bg-gray-100 p-2 rounded-md shadow-sm"
                >
                  <img
                    src={URL}
                    alt={`Foto ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <Link
                    href={URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {`Foto ${index + 1}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

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
            className={`px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition ${
              status === "submitting" ? "pointer-none hover:bg-gray-800" : ""
            }`}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Submiting..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
