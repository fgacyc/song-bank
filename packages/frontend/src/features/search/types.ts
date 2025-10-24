export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  lyrics?: string;
  chords?: string;
  language?: string;
  keySignature?: string;
}

export interface SearchFilters {
  query: string;
  language?: string;
  keySignature?: string;
  // sortBy?: "title" | "artist" | "relevance";
  // sortOrder?: "asc" | "desc";
}

export interface SearchResult {
  songs: Song[];
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
