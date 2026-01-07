/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Album, Artist } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

let cachedAccessToken: string | null = null;
let tokenExpiration = 0;

async function getSpotifyAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedAccessToken && Date.now() < tokenExpiration) {
    return cachedAccessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials not configured");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to get Spotify access token");
  }

  const data = await response.json();
  cachedAccessToken = data.access_token;
  // Set expiration to 5 minutes before actual expiration
  tokenExpiration = Date.now() + (data.expires_in - 300) * 1000;

  return cachedAccessToken ?? "";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, type } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const searchType =
    typeof type === "string" && type.length > 0 ? type : "track";

  try {
    const accessToken = await getSpotifyAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${encodeURIComponent(searchType)}&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to search Spotify");
    }

    const data = await response.json();
    interface SpotifyArtist {
      name: string;
    }

    interface SpotifyImage {
      url: string;
    }

    interface SpotifyAlbum {
      name: string;
      images: SpotifyImage[];
    }

    interface SpotifyExternalUrls {
      spotify: string;
    }

    interface SpotifyTrack {
      id: string;
      name: string;
      artists: SpotifyArtist[];
      album: SpotifyAlbum;
      external_urls: SpotifyExternalUrls;
    }

    interface SpotifyTracksResponse {
      tracks: {
        items: SpotifyTrack[];
      };
    }

    interface SpotifyArtistItem {
      id: string;
      name: string;
      images?: SpotifyImage[];
    }

    interface SpotifyArtistsResponse {
      artists: {
        items: SpotifyArtistItem[];
      };
    }

    interface SpotifyAlbumItem {
      id: string;
      name: string;
      artists: SpotifyArtist[];
      images?: SpotifyImage[];
    }

    interface SpotifyAlbumsResponse {
      albums: {
        items: SpotifyAlbumItem[];
      };
    }

    interface Track {
      id: string;
      name: string;
      artist: string;
      album: string;
      imageUrl: string;
      spotifyUrl: string;
    }

    if (searchType.includes("artist")) {
      const artists = (data as SpotifyArtistsResponse).artists.items.map(
        (a) => ({
          id: a.id,
          name: a.name,
          imageUrl: a.images?.[0]?.url ?? "",
        }),
      );
      return res.status(200).json(artists);
    }

    if (searchType.includes("album")) {
      const albums = (data as SpotifyAlbumsResponse).albums.items.map((a) => ({
        id: a.id,
        name: a.name,
        artist: a.artists.map((ar) => ar.name).join(", "),
        imageUrl: a.images?.[0]?.url ?? "",
      }));
      return res.status(200).json(albums);
    }

    const tracks: Track[] = (data as SpotifyTracksResponse).tracks.items.map(
      (track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a: SpotifyArtist) => a.name).join(", "),
        album: track.album.name,
        imageUrl: track.album.images[0]?.url ?? "",
        spotifyUrl: track.external_urls.spotify,
      }),
    );

    res.status(200).json(tracks);
  } catch (error) {
    console.error("Error searching Spotify:", error);
    res.status(500).json({ error: "Failed to search Spotify" });
  }
}
