import React from "react";

interface InputFieldProps {
  label: string;
  type?: string;
  name: string;
  defaultValue?: string | number; // Optional for uncontrolled component
  value?: string | number; // Optional for controlled component
  onChange?: (
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
  defaultValue,
  value,
  onChange,
  required = false,
  min,
  readOnly = false,
  className = "",
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 rounded-md shadow-sm transition duration-200 ${className}`}
        required={required}
        min={min}
        readOnly={readOnly}
      />
    </div>
  );
}
