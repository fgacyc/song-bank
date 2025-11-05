import type { NextApiRequest, NextApiResponse } from "next";
import { songServiceServer } from "@/features/song/services/songService.server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { limit, id, type } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    // by id
    if (type === "byId" && id) {
      const song = await songServiceServer.getSongById(id as string);

      if (!song) {
        return res.status(404).json({ error: "Song not found" });
      }

      return res.status(200).json(song);
    }

    // top hot songs
    if (type === "topHotSongs") {
      const songs = await songServiceServer.getSongsWithCovers(take);
      return res.status(200).json(songs);
    }

    // default all songs
    const songs = await songServiceServer.getAllSongs(take);

    return res.status(200).json(songs);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch songs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
