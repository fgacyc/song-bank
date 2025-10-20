import React from "react";

interface IcontButtonProps {
  icon: React.ReactNode;
  text?: string;
  href?: string;
  onClick?: () => void;
}

const IconButton = ({ icon, text, href, onClick }: IcontButtonProps) => {
  if (href) {
    return (
      <a
        href={href}
        className="hover:bg-bg-tertiary flex items-center justify-center gap-4 rounded px-4 py-3 transition-colors"
      >
        {icon} {text && text}
      </a>
    );
  }
  return (
    <button
      onClick={onClick}
      className="hover:bg-bg-tertiary flex items-center justify-center gap-4 rounded px-4 py-3 transition-colors"
    >
      {icon} {text && text}
    </button>
  );
};

export default IconButton;
