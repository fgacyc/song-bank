/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const albums = await db.album.findMany({
          orderBy: { release_date: "desc" },
        });
        return res.status(200).json(albums);

      case "POST":
        const newAlbum = await db.album.create({
          data: {
            id: req.body.id || undefined,
            name: req.body.name,
            release_date: new Date(req.body.releaseDate),
            image_cover_url: req.body.imageUrl,
            artist_id: req.body.artistId,
          },
        });
        return res.status(201).json(newAlbum);

      case "PUT":
        const { id, releaseDate, ...updateData } = req.body;
        const updatedAlbum = await db.album.update({
          where: { id },
          data: {
            ...updateData,
            release_date: releaseDate ? new Date(releaseDate) : undefined,
          },
        });
        return res.status(200).json(updatedAlbum);

      case "DELETE":
        const { id: deleteId } = req.body;
        await db.album.delete({
          where: { id: deleteId },
        });
        return res.status(200).json({ message: "Album deleted successfully" });

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
