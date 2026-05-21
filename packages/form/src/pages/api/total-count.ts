import { db } from "@/server/db";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { type } = req.query;

    switch (type) {
      case "songs": {
        const count = await db.song.count();
        return res.status(200).json({ count });
      }
      case "albums": {
        const count = await db.album.count();
        return res.status(200).json({ count });
      }
      case "artists": {
        const count = await db.artist.count();
        return res.status(200).json({ count });
      }
      case "all": {
        const [artists, songs, albums] = await Promise.all([
          db.artist.count(),
          db.song.count(),
          db.album.count(),
        ]);
        return res.status(200).json({ artists, songs, albums });
      }
      default:
        return res.status(400).json({
          error:
            "Invalid type. Must be 'songs', 'albums', 'artists', or 'all'.",
        });
    }
  } catch (error) {
    console.error("Failed to fetch count:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;

export const config = {
  api: {
    externalResolver: true,
  },
};
