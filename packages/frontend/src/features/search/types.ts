export interface SearchSong {
  id: string;
  name: string | null;
  alt_name: string | null;
  chord_lyrics: string | null;
  original_key: string | null;
  song_language: string | null;
  cover_image_url: string | null;
  original_youtube_url: string | null;
  artist?: {
    id: string;
    name: string;
  } | null;
  album?: {
    id: string;
    name: string;
  } | null;
}

export interface SearchAlbum {
  id: string;
  name: string;
  release_date: Date;
  image_cover_url: string | null;
  artist: {
    id: string;
    name: string;
  } | null;
  _count?: {
    Song: number;
  };
}

export interface SearchArtist {
  id: string;
  name: string;
  bio: string | null;
  image_cover_url: string | null;
  _count?: {
    Song: number;
    Album: number;
  };
}

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
