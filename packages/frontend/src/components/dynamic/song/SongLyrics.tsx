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
  chordLyricsRef: React.MutableRefObject<HTMLParagraphElement | null>;
  chordLyrics: string;
}

const SongLyrics: React.FC<SongLyricsProps> = ({
  chordLyricsRef,
  chordLyrics,
}) => {
  return (
    <>
      <div className="rounded-lg border-2 p-5">
        <p
          ref={chordLyricsRef}
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
