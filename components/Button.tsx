type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
  };
  
  export default function Button({ children, onClick, className = "", type = "button" }: ButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition ${className}`}
      >
        {children}
      </button>
    );
  }