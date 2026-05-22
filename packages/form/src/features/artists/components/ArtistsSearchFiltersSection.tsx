import React from "react";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";

import Button from "@/features/shared/components/ui/Button";

interface ArtistsSearchFiltersSectionProps {
  searchQuery: string;
  onSearchQueryChange: React.Dispatch<React.SetStateAction<string>>;
  viewMode: "list" | "polaroid";
  onViewModeChange: React.Dispatch<React.SetStateAction<"list" | "polaroid">>;
}

const ArtistsSearchFiltersSection = ({
  searchQuery,
  onSearchQueryChange,
  viewMode,
  onViewModeChange,
}: ArtistsSearchFiltersSectionProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-bg-primary p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex h-10 w-full max-w-xl items-center gap-3 rounded-xl border bg-bg-primary px-4 text-text-secondary">
          <FiSearch className="h-3 w-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search artists..."
            className="h-full w-full bg-transparent text-xs text-text-primary placeholder:text-text-secondary focus:outline-none"
          />
        </label>

        <div className="inline-flex w-full gap-1 rounded-xl bg-bg-quaternary p-1 lg:w-auto">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:flex-none ${
              viewMode === "list"
                ? "bg-white text-black shadow-sm"
                : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
            }`}
          >
            <FiList className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("polaroid")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:flex-none ${
              viewMode === "polaroid"
                ? "bg-white text-black shadow-sm"
                : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
            }`}
          >
            <FiGrid className="h-3 w-3" />
          </button>
        </div>
      </div>

      {searchQuery ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border bg-bg-tertiary px-4 py-3 text-xs text-text-secondary">
          <span>Showing matches for “{searchQuery}”</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => onSearchQueryChange("")}
          >
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ArtistsSearchFiltersSection;
