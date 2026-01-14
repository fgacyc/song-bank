import React, { useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import FilterTag, { FilterTags } from "./FilterTags";
import {
  LANGUAGE_OPTIONS,
  KEY_SIGNATURE_OPTIONS,
} from "../constants/filterOptions";
import { DatePicker } from "@/features/shared/ui/DatePicker";
import type { SearchFilters } from "../types";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search songs, albums, or artists...",
  className = "",
  showFilters = true,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [keySignature, setKeySignature] = useState("all");
  const [date, setDate] = useState<Date | undefined>();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        const filters: SearchFilters = {
          query: query.trim(),
        };

        if (language && language !== "all") filters.language = language;
        if (keySignature && keySignature !== "all")
          filters.keySignature = keySignature;
        if (date) filters.date = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD

        onSearch(filters);
      }
    },
    [query, language, keySignature, date, onSearch],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [],
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* search bar */}
      <form onSubmit={handleSubmit}>
        <div className="flex h-[36px] max-w-2xl items-center gap-3 rounded-lg border border-border px-3">
          <CiSearch className="flex-shrink-0 text-text-secondary" size={20} />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-secondary focus:outline-none disabled:opacity-50"
          />
        </div>
      </form>

      {/* filter tags */}
      {showFilters && (
        <FilterTags>
          <FilterTag
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={setLanguage}
            width="w-[160px]"
          />

          <FilterTag
            options={KEY_SIGNATURE_OPTIONS}
            value={keySignature}
            onChange={setKeySignature}
            width="w-[120px]"
          />

          {/* date picker */}
          <DatePicker value={date} onChange={setDate} />
        </FilterTags>
      )}
    </div>
  );
};

export default SearchBar;
