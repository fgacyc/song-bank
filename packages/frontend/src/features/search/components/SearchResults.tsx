import React, { useEffect, useState, useRef, useCallback } from "react";
import type { SearchSong, SearchAlbum, SearchArtist } from "../types";
import SearchSongs from "./SearchSongs";
import SearchAlbums from "./SearchAlbums";
import SearchArtists from "./SearchArtists";
import SearchHero from "./SearchHero";
import SearchBreadcrumb from "./SearchBreadcrumb";
import ToggleButton from "@/features/shared/ui/ToggleButton";
import { Loader2 } from "lucide-react";

interface SearchResultsProps {
  songs: SearchSong[];
  albums: SearchAlbum[];
  artists: SearchArtist[];
  query: string;
  isLoading: boolean;
  error: string | null;
  hasResults: boolean;
  total: number;
  hasMore: boolean;
  onLoadMore: () => void;
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
  hasMore,
  onLoadMore,
  className = "",
}: SearchResultsProps) => {
  const [selected, setSelected] = useState(`All (${total})`);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setSelected(`All (${total})`);
  }, [total]);

  // Infinite scroll implementation
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target?.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
        setIsLoadingMore(true);
        onLoadMore();
        setTimeout(() => setIsLoadingMore(false), 500);
      }
    },
    [hasMore, isLoading, isLoadingMore, onLoadMore],
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver]);

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

          {!error && hasResults && (
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

              {/* Infinite scroll trigger and loading indicator */}
              {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8">
                  {(isLoading || isLoadingMore) && (
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Loading more results...</span>
                    </div>
                  )}
                </div>
              )}

              {!hasMore &&
                (songs.length > 10 ||
                  albums.length > 10 ||
                  artists.length > 10) && (
                  <div className="flex justify-center py-8">
                    <p className="text-text-secondary">
                      No more results to load
                    </p>
                  </div>
                )}
            </div>
          )}

          {isLoading && !hasResults && (
            <div className="flex justify-center py-16">
              <div className="flex items-center gap-2 text-text-secondary">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span>Searching...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
