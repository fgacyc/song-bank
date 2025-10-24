import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") return res.status(405).end();

  const { limit } = req.query;
  const take = limit ? parseInt(limit as string) : undefined;

  try {
    let songs;
    if (take) {
      songs = await db.song.findMany({
        take,
        orderBy: {
          created_at: "desc",
        },
      });
    } else {
      songs = await db.song.findMany({
        orderBy: {
          created_at: "desc",
        },
      });
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
}
