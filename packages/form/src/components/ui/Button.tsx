import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}: ButtonProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-transparent shadow-sm";
      case "secondary":
        return "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 border-transparent shadow-sm";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent shadow-sm";
      case "outline":
        return "bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 border-gray-300 shadow-sm";
      case "ghost":
        return "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border-transparent";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-transparent shadow-sm";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "px-2 py-1 text-xs";
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "md":
        return "px-4 py-2 text-sm";
      case "lg":
        return "px-6 py-3 text-base";
      case "xl":
        return "px-8 py-4 text-lg";
      default:
        return "px-4 py-2 text-sm";
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        inline-flex
        items-center
        justify-center
        rounded-md
        border
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        disabled:hover:bg-current
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {loading && (
        <svg
          className="-ml-1 mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
