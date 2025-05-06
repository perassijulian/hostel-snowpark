import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  required?: boolean;
  min?: string;
  readOnly?: boolean;
  className?: string;
}

export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  min,
  readOnly = false,
  className = "",
}: InputFieldProps) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border px-3 py-2 rounded ${className}`}
        required={required}
        min={min}
        readOnly={readOnly}
      />
    </div>
  );
}
