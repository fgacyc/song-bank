import React from "react";

interface ToggleButtonProps {
  options: string[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}

const ToggleButton = ({
  options,
  selected,
  setSelected,
  className = "",
}: ToggleButtonProps) => {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-toggle-button p-1 text-sm font-medium ${className}`}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => setSelected(option)}
          className={`${
            selected === option
              ? "border-toggle-button-focus-border bg-toggle-button-focus text-primary"
              : "border-transparent text-primary/70"
          } rounded-xl border px-2 py-1 transition-all duration-200`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
