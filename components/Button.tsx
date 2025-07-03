type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`px-6 py-2 text-sm font-semibold rounded-xl transition duration-300 
  ${
    disabled
      ? "bg-gray-400 cursor-not-allowed shadow-none text-white"
      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg cursor-pointer shadow"
  } 
  ${className}`}
    >
      {children}
    </button>
  );
}
