import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { videoId } = req.query;

  if (!videoId || typeof videoId !== "string") {
    return res.status(400).json({ error: "Video ID is required" });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "YouTube API key not configured" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube metadata");
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: "Video not found" });
    }

    const video = data.items[0];
    const snippet = video.snippet;

    res.status(200).json({
      title: snippet.title,
      description: snippet.description,
      channelTitle: snippet.channelTitle,
      thumbnail: snippet.thumbnails.maxres?.url ?? snippet.thumbnails.high?.url,
      publishedAt: snippet.publishedAt,
    });
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    res.status(500).json({ error: "Failed to fetch YouTube metadata" });
  }
}
