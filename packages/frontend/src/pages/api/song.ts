/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { song_id } = req.query;
      const song = await db.song.findUnique({
        where: {
          id: song_id as string,
        },
        include: {
          tags: true,
          file_sequencer: true,
        },
      });
      return res.status(200).json(song);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}
