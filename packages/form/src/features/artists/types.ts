export interface ArtistRecord {
  id: string;
  name: string;
  bio: string;
  image_cover_url: string | null;
  album_count: number;
  song_count: number;
}

export interface SpotifyImageResult {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ArtistFormState {
  name: string;
  bio: string;
  imageUrl: string;
}

export const createInitialArtistFormState = (): ArtistFormState => ({
  name: "",
  bio: "",
  imageUrl: "",
});
