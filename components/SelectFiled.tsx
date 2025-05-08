import React from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  className?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = "",
}) => {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border px-3 py-2 rounded ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
