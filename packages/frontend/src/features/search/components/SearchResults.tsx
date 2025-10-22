import React from "react";
import type { Song } from "../types";

interface SearchResultsProps {
  results: Song[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  onLoadMore?: () => void;
  onSongSelect?: (song: Song) => void;
  className?: string;
}

const SearchResults = ({
  results,
  isLoading,
  error,
  hasMore,
  total,
  onLoadMore,
  onSongSelect,
  className = "",
}: SearchResultsProps) => {
  if (error) {
    return (
      <div className={`py-8 text-center ${className}`}>
        <p className="mb-4 text-red-500">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-accent hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!isLoading && results.length === 0) {
    return (
      <div className={`py-8 text-center text-text-secondary ${className}`}>
        <p>No songs found. Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {total > 0 && (
        <p className="text-sm text-text-secondary">
          Found {total} song{total !== 1 ? "s" : ""}
        </p>
      )}

      <div className="space-y-2">
        {results.map((song) => (
          <div
            key={song.id}
            onClick={() => onSongSelect?.(song)}
            className="cursor-pointer rounded-lg border border-border bg-bg-secondary p-4 transition-colors hover:bg-bg-primary"
          >
            <h3 className="font-semibold text-text-primary">{song.title}</h3>
            <p className="text-sm text-text-secondary">{song.artist}</p>
            {song.album && (
              <p className="text-xs text-text-secondary">{song.album}</p>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="py-4 text-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded bg-bg-secondary px-6 py-2 text-text-primary transition-colors hover:bg-bg-primary disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {isLoading && results.length === 0 && (
        <div className="py-8 text-center text-text-secondary">
          <p>Searching...</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
