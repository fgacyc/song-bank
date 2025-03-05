/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react";
import markdownit from "markdown-it";
import { parseChords } from "@/utils/chordParser";

const md = markdownit({
  breaks: true,
  html: true, // Enable HTML parsing
});

// Process chords before markdown
const originalRender = md.render.bind(md);
md.render = (src: string) => {
  // First parse the chords
  const withChords = parseChords(src);
  // Then process with markdown
  const rendered = originalRender(withChords);
  return rendered;
};

interface SongLyricsProps {
  chordLyricsRef: React.MutableRefObject<HTMLParagraphElement | null>;
  chordLyrics: string;
}

const SongLyrics: React.FC<SongLyricsProps> = ({
  chordLyricsRef,
  chordLyrics,
}) => {
  return (
    <div className="rounded-lg border-2 p-3">
      <div
        ref={chordLyricsRef}
        className="whitespace-pre-line text-pretty text-neutral-500"
        dangerouslySetInnerHTML={{
          __html: md.render(chordLyrics),
        }}
      />
    </div>
  );
};

export default SongLyrics;
