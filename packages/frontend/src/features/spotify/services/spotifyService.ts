/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "@/env";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export const spotifyService = {
  async getAccessToken(): Promise<string> {
    try {
      const clientId = env.SPOTIFY_CLIENT_ID;
      const clientSecret = env.SPOTIFY_CLIENT_SECRET;

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error(`Spotify token request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Error getting Spotify token:", error);
      throw error;
    }
  },

  async searchTrack(query: string) {
    try {
      const token = await this.getAccessToken();
      const encodedQuery = encodeURIComponent(query);

      console.log(`Searching Spotify for track: "${query}"`);

      const response = await fetch(
        `${SPOTIFY_API_BASE}/search?q=${encodedQuery}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      const track = data.tracks?.items?.[0] || null;

      if (track) {
        console.log(
          `Found track: ${track.name} by ${track.artists?.[0]?.name}`,
        );
      } else {
        console.log(`No track found for query: "${query}"`);
      }

      return track;
    } catch (error) {
      console.error("Error searching Spotify track:", error);
      return null;
    }
  },

  async getTrackCover(
    songName: string,
    artistName?: string,
  ): Promise<string | null> {
    try {
      const query = artistName ? `${songName} artist:${artistName}` : songName;
      const track = await this.searchTrack(query);

      if (track?.album?.images?.length > 0) {
        const imageUrl = track.album.images[0].url;
        console.log(`Found cover image for "${songName}": ${imageUrl}`);
        return imageUrl;
      }

      console.log(`No cover image found for "${songName}"`);
      return null;
    } catch (error) {
      console.error(`Error getting track cover for "${songName}":`, error);
      return null;
    }
  },

  async searchArtist(query: string) {
    try {
      const token = await this.getAccessToken();
      const encodedQuery = encodeURIComponent(query);

      console.log(`Searching Spotify for artist: "${query}"`);

      const response = await fetch(
        `${SPOTIFY_API_BASE}/search?q=${encodedQuery}&type=artist&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      const artist = data.artists?.items?.[0] || null;

      if (artist) {
        console.log(
          `Found artist: ${artist.name} (${artist.followers?.total} followers)`,
        );
      } else {
        console.log(`No artist found for query: "${query}"`);
      }

      return artist;
    } catch (error) {
      console.error("Error searching Spotify artist:", error);
      return null;
    }
  },

  async searchArtistImage(artistName: string): Promise<string | null> {
    try {
      const artist = await this.searchArtist(artistName);

      if (artist?.images?.length > 0) {
        const imageUrl = artist.images[0].url;
        console.log(`Found artist image for "${artistName}": ${imageUrl}`);
        return imageUrl;
      }

      console.log(`No artist image found for "${artistName}"`);
      return null;
    } catch (error) {
      console.error(`Error getting artist image for "${artistName}":`, error);
      return null;
    }
  },

  async searchImage(
    query: string,
    type: "track" | "album" | "artist",
  ): Promise<string | null> {
    if (type === "artist") {
      return this.searchArtistImage(query);
    }
    if (type === "track") {
      return this.getTrackCover(query);
    }
    return this.getTrackCover(query);
  },
};
