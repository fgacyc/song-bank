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
    <div className="bg-bg-border bg-toggle-button flex items-center justify-center rounded-2xl p-1 text-sm font-semibold">
      <button
        onClick={() => setSelected(left)}
        className={`${selected == left ? "bg-toggle-button-focus border-border text-primary" : "border-transparent text-primary/70"} rounded-xl border px-2 py-1 transition-all duration-200`}
      >
        {left}
      </button>
      <button
        onClick={() => setSelected(right)}
        className={`${selected == right ? "bg-toggle-button-focus border-border text-primary" : "border-transparent text-primary/70"} rounded-xl border px-2 py-1 transition-all duration-200`}
      >
        {right}
      </button>
    </div>
  );
};

export default ToggleButton;
