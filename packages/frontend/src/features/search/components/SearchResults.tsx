import React, { useState } from "react";
import type { SearchSong, SearchAlbum, SearchArtist } from "../types";
import SearchSongs from "./SearchSongs";
import SearchAlbums from "./SearchAlbums";
import SearchArtists from "./SearchArtists";
import SearchHero from "./SearchHero";
import SearchBreadcrumb from "./SearchBreadcrumb";
import ToggleButton from "@/features/shared/ui/ToggleButton";

interface SearchResultsProps {
  songs: SearchSong[];
  albums: SearchAlbum[];
  artists: SearchArtist[];
  query: string;
  isLoading: boolean;
  error: string | null;
  hasResults: boolean;
  total: number;
  className?: string;
}

const SearchResults = ({
  songs,
  albums,
  artists,
  query,
  isLoading,
  error,
  hasResults,
  total,
  className = "",
}: SearchResultsProps) => {
  const [selected, setSelected] = useState(`All (${total})`);

  return (
    <div className="space-y-8 py-8">
      <SearchBreadcrumb />
      <div className={`space-y-8 px-4 py-6 md:px-12 lg:px-24 ${className}`}>
        <SearchHero total={total} query={query} />

        <ToggleButton
          options={[
            `All (${total})`,
            `Songs (${songs.length})`,
            `Albums (${albums.length})`,
            `Artist (${artists.length})`,
          ]}
          selected={selected}
          setSelected={setSelected}
          className="w-fit"
        />

        {/* {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-text-secondary">Loading...</div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500 bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {!isLoading && !error && !hasResults && query && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xl text-text-secondary">No results found</p>
            <p className="mt-2 text-sm text-text-secondary">
              Try adjusting your search terms or filters
            </p>
          </div>
        )} */}

        {!isLoading && !error && hasResults && (
          <div className="space-y-8">
            <SearchArtists artists={artists} />
            <SearchAlbums albums={albums} />
            <SearchSongs songs={songs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
