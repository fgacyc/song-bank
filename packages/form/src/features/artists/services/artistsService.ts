import type {
  ArtistFormState,
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
  formData: ArtistFormState,
  editingArtistId?: string | null,
) => {
  const body = {
    name: formData.name,
    bio: formData.bio,
    image_cover_url: formData.imageUrl || null,
  };

  return editingArtistId ? { id: editingArtistId, ...body } : body;
};

export const artistsService = {
  getArtists: async (): Promise<ArtistRecord[]> => {
    return fetchJson<ArtistRecord[]>(
      "/api/artists",
      undefined,
      "Failed to fetch artists",
    );
  },

  searchSpotifyImages: async (query: string): Promise<SpotifyImageResult[]> => {
    return fetchJson<SpotifyImageResult[]>(
      `/api/spotify-search?query=${encodeURIComponent(query)}&type=artist`,
      undefined,
      "Failed to search Spotify images",
    );
  },

  saveArtist: async (
    formData: ArtistFormState,
    editingArtistId?: string | null,
  ): Promise<void> => {
    const response = await fetch("/api/artists", {
      method: editingArtistId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mapFormStateToApiBody(formData, editingArtistId)),
    });

    if (!response.ok) {
      throw new Error("Failed to save artist");
    }
  },

  deleteArtist: async (id: string): Promise<void> => {
    const response = await fetch("/api/artists", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete artist");
    }
  },
};
