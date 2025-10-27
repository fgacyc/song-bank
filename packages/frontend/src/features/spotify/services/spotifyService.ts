/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const spotifyService = {
  async getAccessToken(): Promise<string> {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("spotify_token");
      const expires = Number(sessionStorage.getItem("spotify_token_expiry"));
      if (cached && expires > Date.now()) return cached;
    }

    const res = await fetch("/api/spotify/token");
    const data = (await res.json()) as unknown as { access_token: string };
    const token = data.access_token;

    if (typeof window !== "undefined") {
      sessionStorage.setItem("spotify_token", token);
      sessionStorage.setItem(
        "spotify_token_expiry",
        String(Date.now() + 3600 * 1000),
      );
    }

    return token;
  },

  async search(query: string, type: "track" | "album" | "artist") {
    const token = await this.getAccessToken();
    const url = new URL("https://api.spotify.com/v1/search");
    url.searchParams.append("q", query);
    url.searchParams.append("type", type);
    url.searchParams.append("limit", "3");

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Spotify search failed");
    return res.json();
  },

  async searchImage(query: string, type: "album" | "artist" | "track") {
    const token = await this.getAccessToken();
    const params = new URLSearchParams({
      q: query,
      type,
      limit: "1",
    });
    const res = await fetch(
      `https://api.spotify.com/v1/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) throw new Error("Spotify search failed");

    const data = await res.json();

    if (type === "album") {
      const item = data.albums?.items?.[0];
      return item?.images?.[0]?.url ?? null;
    }
    if (type === "artist") {
      const item = data.artists?.items?.[0];
      return item?.images?.[0]?.url ?? null;
    }
    const item = data.tracks?.items?.[0];
    return item?.album?.images?.[0]?.url ?? null;
  },

  async getAlbumCover(albumName: string, artistName?: string) {
    const query = artistName ? `${albumName} artist:${artistName}` : albumName;
    return this.searchImage(query, "album");
  },

  async getArtistCover(artistName: string) {
    return this.searchImage(artistName, "artist");
  },

  async getTrackCover(trackName: string, artistName?: string) {
    const query = artistName ? `${trackName} artist:${artistName}` : trackName;
    return this.searchImage(query, "track");
  },
};
