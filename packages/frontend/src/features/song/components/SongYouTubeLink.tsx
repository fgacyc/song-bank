import React, { useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface SongYouTubeLinkProps {
  url: string | null;
  title: string | null;
}

const SongYouTubeLink = ({ url, title }: SongYouTubeLinkProps) => {
  const [hasError, setHasError] = useState(false);

  const extractVideoId = (youtubeUrl: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern);
      if (match?.[1]) {
        return match[1];
      }
    }

    return null;
  };

  if (!url) {
    return null;
  }

  const videoId = extractVideoId(url);

  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-[80dvw] space-y-4 rounded-lg border border-red-200 bg-red-50 p-6 sm:max-w-[80dvw] lg:max-w-[60dvw]">
          <h4 className="font-bold text-red-800">Invalid YouTube URL</h4>
          <p className="text-sm text-red-600">
            Could not parse the provided YouTube URL.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-800 hover:underline"
          >
            <ExternalLink size={14} />
            Open Link
          </a>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const videoTitle = title ?? "YouTube video player";

  const handleIframeError = () => {
    setHasError(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[80dvw] space-y-6 rounded-lg border border-border bg-bg-secondary p-6 sm:max-w-[80dvw] lg:max-w-[60dvw]">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-text-primary">Watch</h4>
        </div>

        {hasError ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-bg-quaternary">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Play size={48} className="mx-auto text-text-secondary" />
                <p className="mt-2 text-sm text-text-secondary">
                  Video could not be loaded
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded bg-bg-primary px-4 py-2 text-sm text-text-primary"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              onError={handleIframeError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SongYouTubeLink;
