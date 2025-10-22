import React, { useState, useCallback } from "react";
import { CiSearch } from "react-icons/ci";
import type { SearchFilters } from "../types";
import FilterTag, { FilterTags } from "./FilterTags";
import {
  LANGUAGE_OPTIONS,
  KEY_SIGNATURE_OPTIONS,
} from "../constants/filterOptions";
import { DatePicker } from "@/features/shared/ui/DatePicker";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
}

const SearchBar = ({
  onSearch,
  isLoading = false,
  placeholder = "Search songs, albums, creators...",
  className = "",
  showFilters = true,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [keySignature, setKeySignature] = useState("all");

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

        onSearch(filters);
      }
    },
    [query, language, keySignature, onSearch],
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
        <div className="flex h-[48px] items-center gap-4 rounded-lg border-[2px] border-border px-4">
          <CiSearch className="flex-shrink-0 text-text-secondary" size={20} />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 bg-transparent text-text-primary placeholder-text-secondary focus:outline-none disabled:opacity-50"
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
          />

          <FilterTag
            options={KEY_SIGNATURE_OPTIONS}
            value={keySignature}
            onChange={setKeySignature}
          />

          {/* date picker */}
          <DatePicker />
        </FilterTags>
      )}
    </div>
  );
};

export default SearchBar;
