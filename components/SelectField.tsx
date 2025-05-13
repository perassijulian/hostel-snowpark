interface SelectFieldProps {
  label: string;
  name: string;
  value?: string; // Optional for controlled component
  defaultValue?: string; // Optional for uncontrolled component
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export default function SelectField({
  label,
  name,
  value,
  defaultValue,
  onChange,
  options,
  className = "",
}: SelectFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wide"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-[0.62rem] rounded-md shadow-sm transition duration-100 ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
