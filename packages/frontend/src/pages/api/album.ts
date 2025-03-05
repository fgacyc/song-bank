/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { album, band } = req.query;
    const albumQuery = String(album).replaceAll("-", " ");
    const bandQuery = String(band).replaceAll("-", " ");
    try {
      const songs = await db.song.findMany({
        where: {
          AND: {
            album: {
              contains: albumQuery,
              mode: "insensitive",
            },
            original_band: {
              contains: bandQuery,
              mode: "insensitive",
            },
          },
        },
      });
      return res.status(200).json(songs);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }
}
