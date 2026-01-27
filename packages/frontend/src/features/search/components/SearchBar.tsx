import React, { useState, useCallback, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { X } from "lucide-react";
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
  initialQuery?: string;
  initialLanguage?: string;
  initialKeySignature?: string;
  initialDate?: Date;
  isSearchPage?: boolean;
}

const SearchBar = ({
  onSearch,
  placeholder = "Search songs, albums, or artists...",
  className = "",
  showFilters = true,
  initialQuery = "",
  initialLanguage = "all",
  initialKeySignature = "all",
  initialDate,
  isSearchPage = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState(initialLanguage);
  const [keySignature, setKeySignature] = useState(initialKeySignature);
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const isInitialMount = useRef(true);

  // update internal state when initial values change
  useEffect(() => {
    setQuery(initialQuery);
    setLanguage(initialLanguage);
    setKeySignature(initialKeySignature);
    setDate(initialDate);
    isInitialMount.current = true; // Mark as syncing from props
  }, [initialQuery, initialLanguage, initialKeySignature, initialDate]);

  const performSearch = useCallback(() => {
    if (query.trim()) {
      const filters: SearchFilters = {
        query: query.trim(),
      };

      if (language && language !== "all") filters.language = language;
      if (keySignature && keySignature !== "all")
        filters.keySignature = keySignature;
      if (date) filters.date = date.toISOString().split("T")[0];

      onSearch(filters);
    }
  }, [query, language, keySignature, date, onSearch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      performSearch();
    },
    [performSearch],
  );

  // Auto-search when filters change (but only if there's a query)
  // Skip if we're just syncing with initial props
  // Only auto-search when on the search page
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only trigger auto-search if we're on the search page
    if (isSearchPage && query.trim()) {
      performSearch();
    }
  }, [language, keySignature, date, performSearch, query, isSearchPage]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
    },
    [],
  );

  const handleClearSearch = useCallback(() => {
    setQuery("");
  }, []);

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
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded hover:bg-bg-quaternary"
              aria-label="Clear search"
            >
              <X className="size-4 text-text-secondary opacity-50 hover:opacity-100" />
            </button>
          )}
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
