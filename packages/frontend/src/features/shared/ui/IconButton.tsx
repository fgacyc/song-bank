import React, { type ReactNode } from "react";
import Link from "next/link";

interface IconButtonProps {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const IconButton = ({
  icon,
  size = "md",
  text,
  href,
  onClick,
  className = "",
  disabled = false,
}: IconButtonProps) => {
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  const baseClasses = [
    "hover:bg-bg-tertiary flex items-center justify-center gap-4 rounded transition-colors",
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span aria-hidden="true">{icon}</span>
      {text && <span>{text}</span>}
    </>
  );

  // link variant
  if (href && !disabled) {
    const isExternal = href.startsWith("http");
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return (
        <Link href={href} className={baseClasses}>
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={baseClasses}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  // button variant
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {content}
    </button>
  );
};

export default IconButton;
