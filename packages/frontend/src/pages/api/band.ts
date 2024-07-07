/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { band } = req.query;
    try {
      const songs = await db.song.findMany({
        where: {
          original_band: band as string,
        },
      });
      return res.status(200).json(songs);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}
