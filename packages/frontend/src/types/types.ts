export interface Album {
  id: string;
  name: string;
  artist: string;
  songs: AlbumSong[];
  songCount: number;
  created_at: Date;
  updated_at: Date;
  cover_image_url?: string | null;
}

export interface AlbumSong {
  id: string;
  name: string | null;
  original_key: string | null;
  song_language: string | null;
  cover_image_url?: string | null;
}

export interface Creator {
  id: string;
  name: string;
  songs: CreatorSong[];
  albums: string[] | Set<string>;
  songCount: number;
  albumCount: number;
  created_at: Date;
  updated_at: Date;
  cover_image_url?: string | null;
}

export interface CreatorSong {
  id: string;
  name: string | null;
  album: string | null;
  original_key: string | null;
  song_language: string | null;
  original_youtube_url: string | null;
  cover_image_url?: string | null;
}
