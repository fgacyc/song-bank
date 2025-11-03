import React from "react";

interface SongLyricsProps {
  lyrics: string | null;
}

const SongLyrics = ({ lyrics }: SongLyricsProps) => {
  // TODO: create lyrics parser and renderer utility
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[80dvw] space-y-6 rounded-lg border border-border bg-bg-secondary p-6 sm:max-w-[80dvw] lg:max-w-[60dvw]">
        <h4 className="font-bold text-text-primary">Lyrics</h4>
        <p className="rounded-lg bg-bg-tertiary px-6 py-8">{lyrics}</p>
      </div>
    </div>
  );
};

export default SongLyrics;
