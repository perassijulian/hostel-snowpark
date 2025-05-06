import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import Button from "./Button";

interface AvailabilityProps {
  onSubmit: (formData: any) => void;
  formData: any;
  status: "idle" | "submitting" | "success" | "error";
  errorMessage: string | null;
  availability: any; // Pass availability data here
  loading: boolean;
  error: string | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

export default function AvailabilityForm({
  onSubmit,
  formData,
  status,
  errorMessage,
  availability,
  loading,
  error,
  onChange,
}: AvailabilityProps) {
  const { checkIn, checkOut, guests, type } = formData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`grid gap-4 duration-200 ${
        status === "submitting" ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Check-In"
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={onChange}
          required
        />

        <InputField
          label="Check-Out"
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={onChange}
          required
        />
      </div>

      <InputField
        label="Guests"
        type="number"
        name="guests"
        min="1"
        value={formData.guests}
        onChange={onChange}
        required
      />

      <SelectField
        label="Accomodation Type"
        name="type"
        value={formData.type}
        onChange={onChange}
        options={[
          { value: "dorm", label: "Dorm" },
          { value: "cabin", label: "Cabin" },
          { value: "private", label: "Private Room" },
        ]}
      />

      {error && <p>{`Failed to fetch availability. Error ${error}`}</p>}

      <Button className="mt-4" type="submit" disabled={loading}>
        {status === "submitting" ? "Checking..." : "Check availability"}{" "}
      </Button>

      {status === "error" && (
        <p className="text-red-600 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}
