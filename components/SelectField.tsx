interface SelectFieldProps {
  label: string;
  name: string;
  value?: string; // Optional for controlled component
  defaultValue?: string; // Optional for uncontrolled component
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

export default function SelectField({
  label,
  name,
  value,
  defaultValue,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded"
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
