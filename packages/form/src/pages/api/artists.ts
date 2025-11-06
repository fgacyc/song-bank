/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const artists = await db.artist.findMany({
          orderBy: { name: "asc" },
        });
        return res.status(200).json(artists);

      case "POST":
        const newArtist = await db.artist.create({
          data: {
            id: req.body.id || undefined,
            name: req.body.name,
            bio: req.body.bio,
            image_cover_url: req.body.imageUrl,
          },
        });
        return res.status(201).json(newArtist);

      case "PUT":
        const { id, ...updateData } = req.body;
        const updatedArtist = await db.artist.update({
          where: { id },
          data: updateData,
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
