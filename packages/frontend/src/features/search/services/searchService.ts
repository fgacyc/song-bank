import type { Song, SearchFilters, SearchResult } from "../types";
import { KEY_SIGNATURE_OPTIONS } from "../constants/filterOptions";

// Updated mock data to match your filter options
const mockSongs: Song[] = [
  {
    id: "1",
    title: "Amazing Grace",
    artist: "John Newton",
    album: "Classic Hymns",
    lyrics: "Amazing grace how sweet the sound...",
    language: "en",
    keySignature: "G",
  },
  {
    id: "2",
    title: "How Great Thou Art",
    artist: "Carl Boberg",
    album: "Traditional Hymns",
    lyrics: "O Lord my God when I in awesome wonder...",
    language: "en",
    keySignature: "C",
  },
  {
    id: "3",
    title: "奇异恩典",
    artist: "John Newton",
    album: "Classic Hymns",
    lyrics: "奇异恩典 何等甘甜...",
    language: "cn",
    keySignature: "G",
  },
  {
    id: "4",
    title: "주님의 은혜",
    artist: "Various",
    album: "Korean Hymns",
    lyrics: "주님의 은혜가...",
    language: "bm",
    keySignature: "D",
  },
];

class SearchService {
  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private matchesKeySignature(songKey: string, filterKey: string): boolean {
    // Find the key group that matches the filter
    const keyGroup = KEY_SIGNATURE_OPTIONS.find((option) => {
      const keyArray = Array.isArray(option.value)
        ? option.value
        : [option.value];
      return keyArray[0] === filterKey; // Match by the first value (primary key)
    });

    if (!keyGroup) return false;

    // Check if song key is in the group
    const keyArray = Array.isArray(keyGroup.value)
      ? keyGroup.value
      : [keyGroup.value];
    return keyArray.includes(songKey);
  }

  async search(
    filters: SearchFilters,
    page = 1,
    limit = 10,
  ): Promise<SearchResult> {
    // Simulate API delay
    await this.delay(300);

    const { query, language, keySignature } = filters;

    if (!query.trim()) {
      return {
        songs: [],
        total: 0,
        page,
        hasMore: false,
      };
    }

    // Filter songs
    const filteredSongs = mockSongs.filter((song) => {
      const searchQuery = query.toLowerCase();

      // Check if query matches
      const matchesQuery =
        song.title.toLowerCase().includes(searchQuery) ||
        song.artist.toLowerCase().includes(searchQuery) ||
        (song.lyrics?.toLowerCase().includes(searchQuery) ?? false);

      // Check language filter
      const matchesLanguage =
        !language || language == "all" || song.language === language;

      // Check key signature filter (handle array values)
      const matchesKey =
        !keySignature ||
        keySignature == "all" ||
        this.matchesKeySignature(song.keySignature ?? "", keySignature);

      return matchesQuery && matchesLanguage && matchesKey;
    });

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSongs = filteredSongs.slice(startIndex, endIndex);

    return {
      songs: paginatedSongs,
      total: filteredSongs.length,
      page,
      hasMore: endIndex < filteredSongs.length,
    };
  }
}

export const searchService = new SearchService();
