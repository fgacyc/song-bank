import React from "react";

interface ToggleButtonProps {
  left: string;
  right: string;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const ToggleButton = ({
  left,
  right,
  selected,
  setSelected,
}: ToggleButtonProps) => {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-toggle-button p-1 text-sm font-semibold">
      <button
        onClick={() => setSelected(left)}
        className={`${selected == left ? "border-toggle-button-focus-border bg-toggle-button-focus text-primary" : "border-transparent text-primary/70"} rounded-xl border px-2 py-1 transition-all duration-200`}
      >
        {left}
      </button>
      <button
        onClick={() => setSelected(right)}
        className={`${selected == right ? "border-toggle-button-focus-border bg-toggle-button-focus text-primary" : "border-transparent text-primary/70"} rounded-xl border px-2 py-1 transition-all duration-200`}
      >
        {right}
      </button>
    </div>
  );
};

export default ToggleButton;
