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
        return "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90";
      case "secondary":
        return "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/80 hover:border-secondary/80";
      case "default":
      default:
        return "bg-card text-card-foreground border-border hover:bg-accent hover:border-accent hover:text-accent-foreground";
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
