import type {
  AlbumFormState,
  AlbumRecord,
  ArtistRecord,
  SpotifyImageResult,
} from "../types";

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
  formData: AlbumFormState,
  editingAlbumId?: string | null,
) => {
  const body = {
    name: formData.name,
    release_date: formData.releaseDate,
    image_cover_url: formData.imageUrl || null,
    artist_id: formData.artistId,
  };

  return editingAlbumId ? { id: editingAlbumId, ...body } : body;
};

export const albumsService = {
  getAlbums: async (): Promise<AlbumRecord[]> => {
    return fetchJson<AlbumRecord[]>(
      "/api/albums",
      undefined,
      "Failed to fetch albums",
    );
  },

  getArtists: async (): Promise<ArtistRecord[]> => {
    return fetchJson<ArtistRecord[]>(
      "/api/artists",
      undefined,
      "Failed to fetch artists",
    );
  },

  searchSpotifyImages: async (query: string): Promise<SpotifyImageResult[]> => {
    return fetchJson<SpotifyImageResult[]>(
      `/api/spotify-search?query=${encodeURIComponent(query)}&type=album`,
      undefined,
      "Failed to search Spotify images",
    );
  },

  saveAlbum: async (
    formData: AlbumFormState,
    editingAlbumId?: string | null,
  ): Promise<void> => {
    const response = await fetch("/api/albums", {
      method: editingAlbumId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapFormStateToApiBody(formData, editingAlbumId)),
    });

    if (!response.ok) {
      throw new Error("Failed to save album");
    }
  },

  deleteAlbum: async (id: string): Promise<void> => {
    const response = await fetch("/api/albums", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete album");
    }
  },
};
