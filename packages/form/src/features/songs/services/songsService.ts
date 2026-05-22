import type {
  AlbumRecord,
  ArtistRecord,
  SongFormState,
  SongRecord,
  SpotifyImageResult,
} from "../types";

type YoutubeMetadataResponse = {
  title?: string | null;
  thumbnail?: string | null;
};

const fetchJson = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  errorMessage?: string,
): Promise<T> => {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(errorMessage ?? "Request failed");
  }

  return (await response.json()) as T;
};

const mapFormStateToApiBody = (
  formData: SongFormState,
  youtubeUrl: string,
  editingSongId?: string | null,
) => {
  const body = {
    name: formData.name,
    alt_name: formData.altName,
    artist_id: formData.artistId,
    album_id: formData.albumId || null,
    original_key: formData.key,
    song_language: formData.language,
    chord_lyrics: formData.lyrics,
    original_youtube_url: youtubeUrl,
    cover_image_url: formData.coverImageUrl,
  };

  return editingSongId ? { id: editingSongId, ...body } : body;
};

export const songsService = {
  getSongs: async (): Promise<SongRecord[]> => {
    return fetchJson<SongRecord[]>(
      "/api/songs",
      undefined,
      "Failed to fetch songs",
    );
  },

  getArtists: async (): Promise<ArtistRecord[]> => {
    return fetchJson<ArtistRecord[]>(
      "/api/artists",
      undefined,
      "Failed to fetch artists",
    );
  },

  getAlbums: async (): Promise<AlbumRecord[]> => {
    return fetchJson<AlbumRecord[]>(
      "/api/albums",
      undefined,
      "Failed to fetch albums",
    );
  },

  searchSpotifyImages: async (query: string): Promise<SpotifyImageResult[]> => {
    return fetchJson<SpotifyImageResult[]>(
      `/api/spotify-search?query=${encodeURIComponent(query)}`,
      undefined,
      "Failed to search Spotify images",
    );
  },

  getYoutubeMetadata: async (
    videoId: string,
  ): Promise<YoutubeMetadataResponse> => {
    return fetchJson<YoutubeMetadataResponse>(
      `/api/youtube-metadata?videoId=${videoId}`,
      undefined,
      "Failed to fetch YouTube metadata",
    );
  },

  saveSong: async (
    formData: SongFormState,
    youtubeUrl: string,
    editingSongId?: string | null,
  ): Promise<void> => {
    const response = await fetch("/api/songs", {
      method: editingSongId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        mapFormStateToApiBody(formData, youtubeUrl, editingSongId),
      ),
    });

    if (!response.ok) {
      throw new Error("Failed to save song");
    }
  },

  deleteSong: async (id: string): Promise<void> => {
    const response = await fetch("/api/songs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete song");
    }
  },
};
