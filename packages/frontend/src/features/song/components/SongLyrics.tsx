import React from "react";

interface SongLyricsProps {
  lyrics: string | null;
}

const SongLyrics = ({ lyrics }: SongLyricsProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-[80dvw] space-y-6 rounded-lg border border-border bg-bg-secondary p-6 sm:max-w-[80dvw] lg:max-w-[60dvw]">
        <h4 className="font-bold text-text-primary">Lyrics</h4>
        <div
          className="song-content song-content [&_p]: whitespace-pre-wrap rounded-lg bg-bg-tertiary px-6 pb-6 pt-2
          text-sm
          [&_.song-chords]:pl-2
          [&_.song-chords]:font-semibold
          [&_.song-chords]:text-[#796ea8]
          [&_.song-title]:pb-2
          [&_.song-title]:pt-4
          [&_.song-title]:text-lg 
          [&_.song-title]:font-bold
          [&_p]:pl-2
          [&_p]:leading-relaxed
          "
          dangerouslySetInnerHTML={{
            __html: lyrics ?? "",
          }}
        />
      </div>
    </div>
  );
};

export default SongLyrics;
