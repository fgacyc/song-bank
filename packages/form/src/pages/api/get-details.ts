import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const id = req.query.song as string;

    try {
      const query = await db.song.findUnique({
        select: {
          ag_link: true,
          album: true,
          alt_name: true,
          bass_link: true,
          chord_lyrics: true,
          drum_link: true,
          updated_at: true,
          eg_link: true,
          file_sec_voice: true,
          id: true,
          main_key_link: true,
          name: true,
          original_band: true,
          original_youtube_url: true,
          song_language: true,
          original_key: true,
          sub_key_link: true,
          file_sequencer: {
            select: {
              url: true,
            },
          },
          tags: {
            select: {
              id: true,
            },
          },
        },
        where: {
          id: id,
        },
      });

      return res.status(200).json(query);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        res.status(500).json({ error: err.message });
        throw err;
      }
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
