import { useState, useCallback } from "react";
import type {
  SearchSong,
  SearchAlbum,
  SearchArtist,
  SearchFilters,
} from "../types";
import { searchService } from "../services/searchService";

interface UseSearchReturn {
  // state
  songs: SearchSong[];
  albums: SearchAlbum[];
  artists: SearchArtist[];
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
  const [songs, setSongs] = useState<SearchSong[]>([]);
  const [albums, setAlbums] = useState<SearchAlbum[]>([]);
  const [artists, setArtists] = useState<SearchArtist[]>([]);
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

      setSongs(result.songs);
      setAlbums(result.albums);
      setArtists(result.artists);
      setHasMore(result.hasMore);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setSongs([]);
      setAlbums([]);
      setArtists([]);
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

      setSongs((prev) => [...prev, ...result.songs]);
      setAlbums((prev) => [...prev, ...result.albums]);
      setArtists((prev) => [...prev, ...result.artists]);
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
    setSongs([]);
    setAlbums([]);
    setArtists([]);
    setError(null);
    setHasMore(false);
    setTotal(0);
    setCurrentFilters(null);
    setCurrentPage(1);
  }, []);

  return {
    songs,
    albums,
    artists,
    isLoading,
    error,
    hasMore,
    total,
    search,
    loadMore,
    clearResults,
  };
};
