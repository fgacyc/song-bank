import type { NextApiRequest, NextApiResponse } from "next";
import { songServiceServer } from "@/features/song/services/songService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limit, withCovers, id, type } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    // Handle fetching song by ID
    if (type === "byId" && id) {
      const song = await songServiceServer.getSongById(id as string);

      if (!song) {
        return res.status(404).json({ error: "Song not found" });
      }

      return res.status(200).json(song);
    }

    // Handle fetching top hot songs with covers
    if (type === "topHotSongs") {
      console.log("API: Fetching top hot songs with covers...");
      const songs = await songServiceServer.getSongsWithCovers(take);
      return res.status(200).json(songs);
    }

    // Handle fetching songs with or without covers based on query
    if (withCovers === "true") {
      console.log("API: Fetching songs with covers...");
      const songs = await songServiceServer.getSongsWithCovers(take);
      return res.status(200).json(songs);
    }

    // Default: fetch all songs without Spotify processing
    console.log("API: Fetching all songs (no Spotify processing)...");
    const songs = await songServiceServer.getAllSongs(take);
    console.log(`API: Returning ${songs.length} songs`);

    return res.status(200).json(songs);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch songs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
