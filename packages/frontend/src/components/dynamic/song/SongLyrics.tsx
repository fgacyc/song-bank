/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import markdownit from "markdown-it";
// @ts-expect-error no declaration file
import chords from "markdown-it-chords";

const md = markdownit({
  breaks: true,
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
md.use(chords);

interface SongLyricsProps {
  lyricsRef: React.MutableRefObject<HTMLParagraphElement | null>;
  chordLyrics: string;
}

const SongLyrics: React.FC<SongLyricsProps> = ({ lyricsRef, chordLyrics }) => {
  return (
    <>
      {/* TODO: chords & lyrics */}
      <div className="rounded border-2 p-5">
        <p
          ref={lyricsRef}
          className="text-neutral-500"
          dangerouslySetInnerHTML={{
            __html: md.render(chordLyrics),
          }}
        ></p>
      </div>
    </>
  );
};

export default SongLyrics;
