export function isYouTubeUrl(url: string) {
  // Regular expression to match YouTube video URLs
  const youtubeUrlRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  return youtubeUrlRegex.test(url);
}
export const transformToEmbedUrl = (originalUrl: string) => {
  // Regular expression to extract YouTube video ID
  const youtubeUrlRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // Extract video ID from the original URL
  const match = originalUrl.match(youtubeUrlRegex);

  if (match?.[5]) {
    // Construct the embed URL
    const videoID = match[5];
    const embedUrl = `https://www.youtube.com/embed/${videoID}`;

    return embedUrl;
  } else {
    // Invalid YouTube URL, return original URL or handle as needed
    return originalUrl;
  }
};
