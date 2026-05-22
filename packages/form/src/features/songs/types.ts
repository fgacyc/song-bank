export interface SongRecord {
  id: string;
  name: string | null;
  album_old: string | null;
  original_band: string | null;
  original_key: string | null;
  song_language: string | null;
  chord_lyrics: string | null;
  original_youtube_url: string | null;
  created_at: string | null;
  cover_image_url: string | null;
  artist_id: string | null;
  album_id: string | null;
}

export interface ArtistRecord {
  id: string;
  name: string;
}

export interface AlbumRecord {
  id: string;
  name: string;
  artist_id: string;
}

export interface SpotifyImageResult {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
}

export interface SongFormState {
  name: string;
  altName: string;
  artistId: string;
  albumId: string;
  key: string;
  language: string;
  lyrics: string;
  coverImageUrl: string;
}

export const createInitialSongFormState = (): SongFormState => ({
  name: "",
  altName: "",
  artistId: "",
  albumId: "",
  key: "",
  language: "",
  lyrics: "",
  coverImageUrl: "",
});
