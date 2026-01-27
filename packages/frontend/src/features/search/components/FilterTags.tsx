import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/ui/Select";
import { X } from "lucide-react";
import type { FilterTagProps } from "../types";

const FilterTag = ({
  label,
  options,
  value = "all",
  onChange,
  placeholder = "Select...",
  className = "",
  width = "",
}: FilterTagProps) => {
  const hasValue = value && value !== "all";

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("all");
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && (
        <label className="whitespace-nowrap text-sm font-medium text-text-secondary">
          {label}:
        </label>
      )}
      <div className="relative">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            className={`${width} !h-[36px] border bg-bg-secondary px-4 text-sm text-text-primary ${hasValue ? "[&>svg]:hidden" : ""}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="border border-border bg-bg-secondary">
            {options.map((option) => {
              const selectValue = Array.isArray(option.value)
                ? option.value[0]
                : option.value;

              if (!selectValue) return null;

              return (
                <SelectItem
                  key={selectValue}
                  value={selectValue}
                  className="relative flex h-8 w-full cursor-default select-none items-center gap-2 rounded border-none py-0 pl-4 text-sm text-text-primary outline-none hover:bg-bg-quaternary focus:bg-bg-quaternary data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded hover:bg-bg-quaternary"
            aria-label="Clear filter"
          >
            <X className="size-4 text-text-secondary opacity-50 hover:opacity-100" />
          </button>
        )}
      </div>
    </div>
  );
};

interface FilterTagsProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterTags = ({ children, className = "" }: FilterTagsProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {children}
    </div>
  );
};

export default FilterTag;
