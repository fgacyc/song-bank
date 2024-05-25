/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { user_id } = req.query;

      const searchHistory = await db.searchHistory.findMany({
        where: {
          user_id: user_id as string,
        },
      });
      res.status(200).json(searchHistory);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }

  if (req.method === "POST") {
    try {
      const { user_id, search_content, search_category } = JSON.parse(
        req.body as string,
      );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const searchHistory = await db.searchHistory.findMany({
        where: {
          user_id: user_id as string,
          search_content: search_content as string,
          search_category: search_category as string,
          created_at: { gte: today },
        },
      });

      if (searchHistory.length !== 0) {
        return res.status(302).json({
          message: `History for ${search_content} exists today.`,
        });
      } else {
        const result = await db.searchHistory.create({
          data: {
            user_id: user_id,
            search_content: search_content,
            search_category: search_category,
          },
        });
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
