type LoadingSpinnerProps = {
  description?: string;
  className?: string;
};

export default function LoadingSpinner({
  description = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-white ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-8 w-8 text-gray-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  );
}
