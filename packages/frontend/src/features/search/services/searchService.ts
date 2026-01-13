import type { SearchFilters, SearchResult } from "../types";

class SearchService {
  async search(filters: SearchFilters, page = 1): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        query: filters.query,
        page: page.toString(),
      });

      if (filters.language && filters.language !== "all") {
        params.append("language", filters.language);
      }

      if (filters.keySignature && filters.keySignature !== "all") {
        params.append("keySignature", filters.keySignature);
      }

      if (filters.date) {
        params.append("date", filters.date);
      }

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data: SearchResult = await response.json();
      return data;
    } catch (error) {
      console.error("Search service error:", error);
      throw error;
    }
  }
}

export const searchService = new SearchService();
