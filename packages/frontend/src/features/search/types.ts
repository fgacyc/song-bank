import type { Song, Album, Artist, Tag } from "@prisma/client";

// Simplified types for search results to avoid circular dependencies
export type SearchArtist = Artist & {
  album_count: number;
  song_count: number;
};

export type SearchAlbum = Album & {
  artist: Artist | null;
  song_count: number;
};

export type SearchSong = Song & {
  artist: Artist | null;
  album: Album | null;
  tags: Tag[];
};

export interface SearchFilters {
  query: string;
  language?: string;
  keySignature?: string;
  date?: string;
}

export interface SearchResult {
  songs: SearchSong[];
  albums: SearchAlbum[];
  artists: SearchArtist[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface FilterOption {
  value: string[] | string;
  label?: string;
}

export interface FilterTagProps {
  label?: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: string;
}
