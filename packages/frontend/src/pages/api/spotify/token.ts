import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env";

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;

let cachedToken: { access_token: string; expires_at: number } | null = null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (cachedToken && cachedToken.expires_at > Date.now()) {
      return res.status(200).json({ access_token: cachedToken.access_token });
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!response.ok) {
      throw new Error(`Spotify token request failed: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };
    const { access_token, expires_in } = data;

    cachedToken = {
      access_token,
      expires_at: Date.now() + expires_in * 1000,
    };

    return res.status(200).json({ access_token });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch Spotify token" });
  }
}
