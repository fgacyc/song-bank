import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    setSelected(`All (${total})`);
  }, [total]);

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-[80dvw] space-y-8 pt-8">
        <SearchBreadcrumb />
        <div className={`space-y-8 ${className}`}>
          <SearchHero total={total} query={query} />

          <ToggleButton
            options={[
              `All (${total})`,
              `Songs (${songs.length})`,
              `Albums (${albums.length})`,
              `Artists (${artists.length})`,
            ]}
            selected={selected}
            setSelected={setSelected}
            className="w-fit"
          />

          {!isLoading && !error && hasResults && (
            <div className="space-y-8">
              {(selected.startsWith("All") ||
                selected.startsWith("Artists")) && (
                <SearchArtists artists={artists} selected={selected} />
              )}
              {(selected.startsWith("All") ||
                selected.startsWith("Albums")) && (
                <SearchAlbums albums={albums} selected={selected} />
              )}
              {(selected.startsWith("All") || selected.startsWith("Songs")) && (
                <SearchSongs songs={songs} selected={selected} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
