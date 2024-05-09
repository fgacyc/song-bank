/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      if (true) {
        const { user_id, search_content } = req.query;
        const today = new Date();
        const searchHistory = await db.searchHistory.findMany({
          where: {
            user_id: user_id as string,
            search_content: search_content as string,
            search_timestamp: {
              gte: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
              ),
              lt: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + 1,
              ),
            },
          },
        });
        res.status(200).json(searchHistory);
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  if (req.method === "POST") {
    try {
      const { user_id, search_content } = JSON.parse(req.body as string);
      await db.searchHistory.create({
        data: {
          user_id: user_id,
          search_content: search_content,
        },
      });
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
