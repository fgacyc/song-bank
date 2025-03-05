/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

const ITEMS_PER_PAGE = 10;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const cursor = req.query.cursor as string | undefined;

      const songs = await db.song.findMany({
        include: { tags: true, file_sequencer: true },
        take: ITEMS_PER_PAGE + 1,
        orderBy: { id: "asc" },
        ...(cursor
          ? {
              cursor: { id: cursor },
              skip: 1, // Skip the cursor item
            }
          : {}),
        where: {
          AND: [
            ...(req.query.search
              ? [
                  {
                    OR: [
                      { name: { contains: req.query.search as string } },
                      { alt_name: { contains: req.query.search as string } },
                      {
                        original_band: { contains: req.query.search as string },
                      },
                      { album: { contains: req.query.search as string } },
                      {
                        chord_lyrics: { contains: req.query.search as string },
                      },
                      {
                        tags: {
                          some: {
                            content: { contains: req.query.search as string },
                          },
                        },
                      },
                    ],
                  },
                ]
              : []),
            ...(req.query.key
              ? [{ original_key: { contains: req.query.key as string } }]
              : []),
            ...(req.query.language
              ? [{ song_language: { contains: req.query.language as string } }]
              : []),
          ],
        },
      });

      const hasMore = songs.length > ITEMS_PER_PAGE;
      const items = hasMore ? songs.slice(0, ITEMS_PER_PAGE) : songs;

      return res.status(200).json({
        items,
        hasMore,
      });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
