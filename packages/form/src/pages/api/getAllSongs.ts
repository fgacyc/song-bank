import { db } from "@/server/db";
import { type NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    await downloadSongsAsCSV({
      id: "ID",
      name: "Name",
      album: "Album",
      alt_name: "Alternative Name",
      original_band: "Original Band",
      original_youtube_url: "Original YouTube URL",
      original_key: "Original Key",
    });
    res
      .status(200)
      .json({ message: "Songs data downloaded successfully as CSV" });
  }
};

async function downloadSongsAsCSV(
  headers: Record<string, string> = {}, // Map of field to header name
): Promise<void> {
  try {
    const songs = await db.song.findMany();

    // Use provided headers or generate from first object
    const fields =
      Object.keys(headers).length > 0
        ? Object.keys(headers)
        : Object.keys(songs[0]);

    const headerRow = fields.map((field) => headers[field] || field).join(",");

    const csvRows = [
      headerRow,
      ...songs.map((song) =>
        fields
          .map((field) => {
            const value = song[field as keyof typeof song];

            // Handle null/undefined
            if (value === null || value === undefined) return "";

            // Handle strings with commas
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }

            return value;
          })
          .join(","),
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "songs_backup.csv";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("Songs data downloaded successfully as CSV");
  } catch (error) {
    console.error("Error downloading songs:", error);
    throw error;
  }
}

export default handler;
