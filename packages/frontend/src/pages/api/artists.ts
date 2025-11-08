import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "legacy/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { limit } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    const artists = await db.artist.findMany({
      orderBy: {
        name: "asc",
      },
      take: take,
      include: {
        _count: {
          select: {
            Album: true,
            Song: true,
          },
        },
      },
    });

    const artistsWithCounts = artists.map((artist) => ({
      ...artist,
      album_count: artist._count.Album,
      song_count: artist._count.Song,
      _count: undefined,
    }));

    res.status(200).json(artistsWithCounts);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({
      error: "Failed to fetch artists",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
