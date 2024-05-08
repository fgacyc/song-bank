/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { song_id, user_id } = req.body;
      const favorite = await prisma.favorite.create({
        data: {
          song_id,
          user_id,
        },
      });
      res.status(201).json(favorite);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
}
