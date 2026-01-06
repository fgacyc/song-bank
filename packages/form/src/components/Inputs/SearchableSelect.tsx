import React, { useState, useRef, useEffect } from "react";

interface Option {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
  maxResults?: number;
  emptyText?: string;
  createNewLink?: string;
  createNewText?: string;
  filterFn?: (option: Option, searchTerm: string) => boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Search...",
  label,
  required = false,
  maxResults = 15,
  emptyText = "No options found",
  createNewLink,
  createNewText = "Create new",
  filterFn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get selected option
  const selectedOption = options.find((opt) => opt.id === value);

  // Filter options based on search term
  const filteredOptions = options
    .filter((option) => {
      if (filterFn) {
        return filterFn(option, searchTerm);
      }
      return option.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice(0, maxResults);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("");
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="mb-2 block text-sm font-medium text-text-primary">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
        {createNewLink && (
          <a
            href={createNewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs text-blue-500 hover:underline"
          >
            ({createNewText})
          </a>
        )}
      </label>

      {/* Selected value display / trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-bg-secondary px-3 py-2 text-sm text-text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className={selectedOption ? "" : "text-text-secondary"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          {/* Search input inside dropdown */}
          <div className="border-b border-border p-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search..."
                className="flex h-8 flex-1 rounded border border-input bg-bg-secondary px-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                onClick={(e) => e.stopPropagation()}
              />
              {selectedOption && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded px-2 text-xs text-text-secondary hover:bg-muted hover:text-text-primary"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              <ul className="py-1">
                {filteredOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option.id)}
                      className={`w-full px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                        option.id === value
                          ? "bg-accent text-accent-foreground"
                          : "text-text-primary"
                      }`}
                    >
                      {option.name}
                      {option.id === value && (
                        <span className="ml-2 text-xs">✓</span>
                      )}
                    </button>
                  </li>
                ))}
                {options.length > maxResults && (
                  <li className="px-3 py-2 text-xs italic text-text-secondary">
                    Showing {filteredOptions.length} of {options.length}{" "}
                    results.
                    {searchTerm
                      ? " Refine your search for more."
                      : " Type to search."}
                  </li>
                )}
              </ul>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-text-secondary">
                {emptyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
