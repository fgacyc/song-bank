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
      const last24Hrs = Date.now() - 24 * 60 * 60 * 1000;
      const lastDayAsISO = new Date(last24Hrs).toISOString();
      const searchHistory = await db.searchHistory.findMany({
        where: {
          user_id: user_id as string,
          search_content: search_content as string,
          search_timestamp: { gte: lastDayAsISO },
        },
      });

      if (searchHistory.length !== 0) {
        console.log(searchHistory);
        return res.status(302).json({
          message: `History for ${search_content} exists in the last 24 hours.`,
        });
      } else {
        const result = await db.searchHistory.create({
          data: {
            user_id: user_id,
            search_content: search_content,
          },
        });
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
