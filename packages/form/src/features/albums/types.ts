export interface AlbumRecord {
  id: string;
  name: string;
  release_date: string;
  image_cover_url: string | null;
  artist_id: string;
  song_count: number;
}

export interface ArtistRecord {
  id: string;
  name: string;
}

export interface SpotifyImageResult {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  albumName: string;
}

export interface AlbumFormState {
  name: string;
  releaseDate: string;
  imageUrl: string;
  artistId: string;
}

export const createInitialAlbumFormState = (): AlbumFormState => ({
  name: "",
  releaseDate: "",
  imageUrl: "",
  artistId: "",
});
