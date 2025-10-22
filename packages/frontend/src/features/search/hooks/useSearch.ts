import { useState, useCallback, useEffect } from "react";
import type { Song, SearchFilters, SearchResult } from "../types";
import { searchService } from "../services/searchService";

interface UseSearchReturn {
  // state
  results: Song[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;

  // actions
  search: (filters: SearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const search = useCallback(async (filters: SearchFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentFilters(filters);
      setCurrentPage(1);

      const result = await searchService.search(filters, 1);

      setResults(result.songs);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!currentFilters || !hasMore || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const nextPage = currentPage + 1;
      const result = await searchService.search(currentFilters, nextPage);

      setResults((prev) => [...prev, ...result.songs]);
      setHasMore(result.hasMore);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more results",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters, currentPage, hasMore, isLoading]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setHasMore(false);
    setTotal(0);
    setCurrentFilters(null);
    setCurrentPage(1);
  }, []);

  return {
    results,
    isLoading,
    error,
    hasMore,
    total,
    search,
    loadMore,
    clearResults,
  };
};
