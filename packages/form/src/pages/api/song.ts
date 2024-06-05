import { db } from "@/server/db";
import type { NextApiHandler } from "next";
import { type FormikForm } from "..";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const name = req.query.q as string;

    try {
      const queryAll = await db.song.findMany({
        select: {
          name: true,
          id: true,
        },
        where: {
          OR: [
            {
              name: { contains: name, mode: "insensitive" },
            },
            {
              alt_name: { contains: name, mode: "insensitive" },
            },
            {
              album: { contains: name, mode: "insensitive" },
            },
            {
              original_band: { contains: name, mode: "insensitive" },
            },
          ],
        },
      });

      return res.status(200).json(queryAll);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        res.status(500).json({ error: err.message });
        throw err;
      }
    }
  }

  if (req.method === "POST") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body: FormikForm = JSON.parse(String(req.body));

    const {
      album,
      altName,
      chordLyrics,
      originalBand,
      songLanguage,
      originalKey,
      originalYoutubeURL,
      songName,
      agLink,
      bassLink,
      drumLink,
      egLink,
      mainKeyLink,
      subKeyLink,
      tags,
      sequencerFiles,
      subVoiceFile,
      id,
    } = body;

    const data = {
      chord_lyrics: chordLyrics,
      name: songName,
      original_band: originalBand,
      original_key: originalKey,
      song_language: songLanguage,
      album: album,
      alt_name: altName,
      original_youtube_url: originalYoutubeURL,
      file_sequencer:
        sequencerFiles && sequencerFiles?.length > 0
          ? {
              createMany: {
                data: sequencerFiles?.map((sf) => ({
                  url: `https://song-bank.s3.ap-southeast-1.amazonaws.com/${sf}`,
                })),
              },
            }
          : undefined,
      file_sec_voice: subVoiceFile
        ? `https://song-bank.s3.ap-southeast-1.amazonaws.com/${subVoiceFile}`
        : undefined,
      tags: {
        connect: tags?.map((t) => ({ id: t })),
      },
      ag_link: agLink,
      eg_link: egLink,
      drum_link: drumLink,
      bass_link: bassLink,
      main_key_link: mainKeyLink,
      sub_key_link: subKeyLink,
    };

    try {
      const create = await db.song.upsert({
        select: {
          name: true,
          id: true,
        },
        where: {
          id: id,
        },
        update: data,
        create: data,
      });
      return res.status(200).json(create);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        res.status(500).json({ error: err.message });
        throw err;
      }
    }
  }
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
