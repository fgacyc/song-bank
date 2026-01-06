interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: SpotifyImage[];
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifySearchResult {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
}

export async function searchSpotifyTracks(
  query: string,
  accessToken: string,
): Promise<SpotifySearchResult[]> {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to search Spotify");
    }

    const data = (await response.json()) as {
      tracks: { items: SpotifyTrack[] };
    };
    const tracks = data.tracks.items;

    return tracks.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      imageUrl: track.album.images[0]?.url ?? "",
      spotifyUrl: track.external_urls.spotify,
    }));
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return [];
  }
}

export function extractYoutubeVideoId(url: string): string | null {
  const youtubeUrlRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(youtubeUrlRegex);
  return match?.[5] ?? null;
}
