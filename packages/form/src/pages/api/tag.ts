/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const tags = await db.tag.findMany({
        select: {
          id: true,
          color: true,
          content: true,
        },
      });
      return res.status(200).json(tags);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err });
    }
  }

  if (req.method === "POST") {
    const body: { content: string; color: string } = JSON.parse(
      String(req.body),
    );
    try {
      const create = await db.tag.create({
        select: {
          content: true,
        },
        data: {
          content: body.content,
          color: body.color,
        },
      });
      return res.status(200).json(create);
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
