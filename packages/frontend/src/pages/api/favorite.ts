/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { song_id, user_id } = req.query;
      const favorite = await db.favorite.findFirst({
        where: {
          song_id: song_id as string,
          user_id: user_id as string,
        },
      });
      return res.status(200).json(favorite);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }

  if (req.method === "POST") {
    try {
      const { song_id, user_id } = JSON.parse(req.body as string);
      const favorite = await db.favorite.create({
        data: {
          song: {
            connect: {
              id: song_id,
            },
          },
          user_id,
        },
      });
      res.status(200).json(favorite);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await db.favorite.delete({
        where: {
          id: id as string,
        },
      });
      res.status(200).json({ message: "delete successfully" });
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
