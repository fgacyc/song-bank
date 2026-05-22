import React from "react";
import { FiFilter, FiGrid, FiList, FiSearch } from "react-icons/fi";
import { FaFilter } from "react-icons/fa6";

import Button from "@/features/shared/components/ui/Button";

import type { ArtistRecord } from "../types";

interface AlbumsSearchFiltersSectionProps {
  searchQuery: string;
  onSearchQueryChange: React.Dispatch<React.SetStateAction<string>>;
  isFiltersOpen: boolean;
  onToggleFilters: () => void;
  viewMode: "list" | "polaroid";
  onViewModeChange: React.Dispatch<React.SetStateAction<"list" | "polaroid">>;
  artistOptions: ArtistRecord[];
  selectedArtistFilter: string;
  onSelectedArtistFilterChange: React.Dispatch<React.SetStateAction<string>>;
  releaseYearOptions: string[];
  selectedReleaseYearFilter: string;
  onSelectedReleaseYearFilterChange: React.Dispatch<
    React.SetStateAction<string>
  >;
  onClearFilters: () => void;
}

const AlbumsSearchFiltersSection = ({
  searchQuery,
  onSearchQueryChange,
  isFiltersOpen,
  onToggleFilters,
  viewMode,
  onViewModeChange,
  artistOptions,
  selectedArtistFilter,
  onSelectedArtistFilterChange,
  releaseYearOptions,
  selectedReleaseYearFilter,
  onSelectedReleaseYearFilterChange,
  onClearFilters,
}: AlbumsSearchFiltersSectionProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-bg-primary p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-10 w-full max-w-xl items-center gap-3 rounded-xl border bg-bg-primary px-4 text-text-secondary">
            <FiSearch className="h-3 w-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchQueryChange(event.target.value)}
              placeholder="Search albums, artists..."
              className="h-full w-full bg-transparent text-xs text-text-primary placeholder:text-text-secondary focus:outline-none"
            />
          </label>

          <Button
            type="button"
            variant="outline"
            onClick={onToggleFilters}
            className="h-10 gap-2 whitespace-nowrap rounded-xl text-xs"
          >
            {isFiltersOpen ? (
              <FaFilter className="h-3 w-3" />
            ) : (
              <FiFilter className="h-3 w-3" />
            )}
            Filter
          </Button>
        </div>

        <div className="inline-flex w-full gap-1 rounded-xl bg-bg-quaternary p-1 lg:w-auto">
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:flex-none ${
              viewMode === "list"
                ? "bg-white text-black"
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
                ? "bg-white text-black"
                : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
            }`}
          >
            <FiGrid className="h-3 w-3" />
          </button>
        </div>
      </div>

      {isFiltersOpen ? (
        <div className="rounded-xl border bg-bg-tertiary p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-xs font-semibold text-text-primary">Filters</h2>
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="flex flex-col gap-2 text-xs font-medium text-text-primary">
              Artist
              <select
                value={selectedArtistFilter}
                onChange={(event) =>
                  onSelectedArtistFilterChange(event.target.value)
                }
                className="h-11 rounded-xl border bg-bg-primary px-4 text-xs text-text-primary outline-none transition-colors focus:border-primary"
              >
                <option value="">All artists</option>
                {artistOptions.map((artist) => (
                  <option key={artist.id} value={artist.id}>
                    {artist.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-xs font-medium text-text-primary">
              Release Year
              <select
                value={selectedReleaseYearFilter}
                onChange={(event) =>
                  onSelectedReleaseYearFilterChange(event.target.value)
                }
                className="h-11 rounded-xl border bg-bg-primary px-4 text-xs text-text-primary outline-none transition-colors focus:border-primary"
              >
                <option value="">All years</option>
                {releaseYearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AlbumsSearchFiltersSection;
