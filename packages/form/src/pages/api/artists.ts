/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiHandler } from "next";
import { randomUUID } from "crypto";

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET": {
        const artists = await db.artist.findMany({
          orderBy: { name: "asc" },
          include: {
            _count: {
              select: {
                Album: true,
                Song: true,
              },
            },
          },
        });

        const artistsWithCounts = artists.map((a) => ({
          id: a.id,
          name: a.name,
          bio: a.bio,
          image_cover_url: a.image_cover_url,
          album_count: a._count.Album,
          song_count: a._count.Song,
        }));

        return res.status(200).json(artistsWithCounts);
      }

      case "POST":
        const newArtist = await db.artist.create({
          data: {
            id: req.body.id || randomUUID(),
            name: req.body.name,
            bio: req.body.bio || null,
            image_cover_url: req.body.image_cover_url || null,
          },
        });
        return res.status(201).json(newArtist);

      case "PUT":
        const { id, ...updateData } = req.body;
        const updatedArtist = await db.artist.update({
          where: { id },
          data: {
            name: updateData.name,
            bio: updateData.bio || null,
            image_cover_url: updateData.image_cover_url || null,
          },
        });
        return res.status(200).json(updatedArtist);

      case "DELETE":
        const { id: deleteId } = req.body;
        await db.artist.delete({
          where: { id: deleteId },
        });
        return res.status(200).json({ message: "Artist deleted successfully" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
