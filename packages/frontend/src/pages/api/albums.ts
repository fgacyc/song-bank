import type { NextApiRequest, NextApiResponse } from "next";
import { albumService } from "@/features/album/services/albumService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { limit } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    const albums = await albumService.getAlbums(take);
    res.status(200).json(albums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
}
