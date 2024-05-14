/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const songList = await db.song.findMany();
      return res.status(200).json(songList);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
