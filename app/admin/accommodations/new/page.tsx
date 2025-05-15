"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import TextAreaField from "@/components/TextAreaField";
import { UploadButton } from "@/utils/uploadthing";
import Link from "next/link";
import { PictureForm } from "@/types/accommodation";
import { AccommodationType } from "@prisma/client";
import SelectField from "@/components/SelectField";

export default function NewAccommodationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    description: "",
    guests: 1,
    pictures: [] as PictureForm[],
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const typeOptions = Object.values(AccommodationType); // ['DORM', 'PRIVATE', ...]

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
      // Validate form data
      if (!formData.name || !formData.type || !formData.price) {
        setStatus("error");
        setErrorMessage("Please fill in all required fields.");
        return;
      }
      if (Number(formData.price) <= 0) {
        setStatus("error");
        setErrorMessage("Price must be greater than 0.");
        return;
      }
      if (Number(formData.guests) <= 0) {
        setStatus("error");
        setErrorMessage("Number of guests must be greater than 0.");
        return;
      }
      if (formData.pictures.length === 0) {
        setStatus("error");
        setErrorMessage("Please upload at least one picture.");
        return;
      }
      if (formData.description.length < 10) {
        setStatus("error");
        setErrorMessage("Description must be at least 10 characters long.");
        return;
      }
      if (formData.description.length > 500) {
        setStatus("error");
        setErrorMessage("Description must be less than 500 characters.");
        return;
      }

      // Check if the type is valid
      if (!typeOptions.includes(formData.type as AccommodationType)) {
        setStatus("error");
        setErrorMessage("Invalid accommodation type.");
        return;
      }

      // Submit form data to the server
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

        <label className="block mb-1">Uploaded Pictures:</label>

        <UploadButton
          endpoint="imageUploader"
          onUploadBegin={() => setIsUploading(true)}
          onClientUploadComplete={(res) => {
            if (!res) return;
            const uploadedPictures: PictureForm[] = res.map((file, index) => ({
              url: file.ufsUrl,
              isPrimary: formData.pictures.length === 0 && index === 0, // first image = primary
            }));
            setFormData((prev) => ({
              ...prev,
              pictures: [...prev.pictures, ...uploadedPictures],
            }));
            setIsUploading(false);
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
            setIsUploading(false);
          }}
        />

        {formData.pictures.length > 0 && (
          <div>
            <ul className="space-y-2">
              {formData.pictures.map((picture, index) => (
                <li
                  key={picture.url}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      pictures: prev.pictures.map((p, i) => ({
                        ...p,
                        isPrimary: i === index,
                      })),
                    }));
                  }}
                  className={`flex items-center space-x-4 p-2 rounded-md shadow-sm cursor-pointer transition 
                    ${
                      picture.isPrimary
                        ? "bg-blue-100 border border-blue-400"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  <div className="relative">
                    <img
                      src={picture.url}
                      alt={`Foto ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    {picture.isPrimary && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>

                  <Link
                    href={picture.url}
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
              status === "submitting" || isUploading
                ? "pointer-none hover:bg-gray-800"
                : ""
            }`}
            disabled={status === "submitting" || isUploading}
          >
            {status === "submitting" || isUploading ? "Submiting..." : "Save"}
          </button>
        </div>
      </form>
    </main>
  );
}
