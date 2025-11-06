import React from "react";

interface LinkButtonProps {
  href?: string;
  children?: React.ReactNode;
  size?: "small" | "medium" | "large";
  variant?: "default" | "primary" | "secondary";
}

const LinkButton = ({
  href,
  children,
  size = "medium",
  variant = "default",
}: LinkButtonProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-24 h-24 text-sm";
      case "medium":
        return "w-36 h-36 text-base";
      case "large":
        return "w-48 h-48 text-lg";
      default:
        return "w-36 h-36 text-base";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700";
      case "secondary":
        return "bg-gray-600 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700";
      case "default":
      default:
        return "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900";
    }
  };

  return (
    <a
      href={href}
      className={`
        ${getSizeClasses()}
        ${getVariantClasses()}
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        gap-2
        rounded-xl
        border-2
        text-center
        font-semibold
        no-underline
        shadow-lg
        transition-all
        duration-200
        hover:scale-105
        hover:shadow-xl
      `}
    >
      {children}
    </a>
  );
};

export default LinkButton;
