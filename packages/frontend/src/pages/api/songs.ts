import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/prisma";
import { songService } from "@/features/songs/service/songService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { limit, withCovers } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    let songs;

    if (withCovers === "true") {
      console.log("Fetching songs with covers from Spotify...");
      songs = await songService.getSongsWithCovers(take);
    } else {
      console.log("Fetching songs from DB only...");
      songs = await db.song.findMany({
        take,
        orderBy: { created_at: "desc" },
      });
    }

    console.log(`Returning ${songs.length} songs`);
    res.status(200).json(songs);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch songs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
