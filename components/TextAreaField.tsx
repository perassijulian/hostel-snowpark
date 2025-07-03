import React from "react";

type TextAreaFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
};

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  rows = 4,
}) => {
  return (
    <div>
      <label htmlFor={name} className="block font-medium mb-1">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2 rounded-md shadow-sm transition duration-200"
        rows={rows}
      />
    </div>
  );
};

export default TextAreaField;
