import { db } from "@/server/db";
import { type NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    try {
      const songs = await db.song.findMany();

      const headers = {
        id: "No.",
        name: "Name",
        original_key: "Original Key",
        album: "Album",
        alt_name: "Alternative Name",
        original_band: "Original Band",
        original_youtube_url: "Original YouTube URL",
      };

      const fields = Object.keys(headers);
      const headerRow = fields
        .map((field) => headers[field as keyof typeof headers])
        .join(",");

      const csvRows = [
        headerRow,
        ...songs.map((song, index) =>
          fields
            .map((field) => {
              if (field === "id") return index + 1;
              const value = song[field as keyof typeof song];
              if (value === null || value === undefined) return "";
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
              }
              return value;
            })
            .join(","),
        ),
      ];

      const csvString = csvRows.join("\n");

      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="songs_list.csv"',
      );
      res.status(200).send(csvString);
    } catch (error) {
      console.error("Error downloading songs:", error);
      res.status(500).json({ error: "Failed to download songs" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
