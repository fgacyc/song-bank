/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, type ReactElement, useEffect, useRef } from "react";
import Layout from "@/components/dir/layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import markdownit from "markdown-it";
// @ts-expect-error no declaration file
import chords from "markdown-it-chords";

type Song = {
  id?: string;
  name: string;
  alt_name?: string;
  song_language: string;
  original_key: string;
  original_band: string;
  album?: string;
  original_youtube_url?: string;
  chord_lyrics: string;
  main_key_link?: string;
  sub_key_link?: string;
  eg_link?: string;
  ag_link?: string;
  bass_link?: string;
  drum_link?: string;
  tags?: string[];
  sequencer_files?: string[];
  sub_voice_file?: string;
};

const md = markdownit({
  breaks: true,
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
md.use(chords);

const Song = () => {
  const router = useRouter();
  const [songList, setSongList] = useState<Song[]>([]);
  const lyricsRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      }).then(
        async (res) =>
          await res.json().then((result: Song[]) => {
            setSongList(result);
          }),
      );
    })();
  }, []);

  const getVideoId = (url: string) => {
    const params = new URLSearchParams(new URL(url).search);
    return params.get("v");
  };

  return (
    <>
      {songList
        .filter(
          (items) =>
            router.query.song &&
            `${items.name.toLowerCase().replace(/ /g, "-")}` ===
              router.query.song.toString(),
        )
        .map((items, i) => {
          const videoId = getVideoId(items.original_youtube_url ?? "");
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          return (
            <div key={i} className="flex flex-col gap-5 md:flex-row">
              {/* left */}
              <div className="flex flex-col rounded border p-5">
                <div className="h-[300px] w-full border md:h-[150px] md:w-[300px]">
                  <iframe
                    src={embedUrl}
                    allowFullScreen
                    className="me-5 h-full w-full rounded md:me-0"
                  ></iframe>
                </div>
                <div>
                  <div className="flex flex-col gap-2 py-3">
                    <p className="flex flex-col truncate">
                      <span className="font-semibold">Song Name</span>
                      <span className="text-sm text-neutral-500">
                        {items.name}{" "}
                        {items.alt_name &&
                          items.alt_name.trim() !== "-" &&
                          items.alt_name}
                      </span>
                    </p>
                    <p className="flex flex-col truncate">
                      <span className="font-semibold">Band</span>
                      <Link
                        href={`/band/${items.original_band
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="text-sm text-neutral-500 hover:underline"
                      >
                        {items.original_band}
                      </Link>
                    </p>
                    {items.album && (
                      <p className="flex flex-col truncate">
                        <span className="font-semibold">Album</span>
                        <Link
                          href={`/album/${items.album
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="text-sm text-neutral-500 hover:underline"
                        >
                          {items.album}
                        </Link>
                      </p>
                    )}
                  </div>
                  <hr />
                  <div className="flex flex-col gap-2 md:py-3">
                    <p className="flex flex-col truncate">
                      <span className="font-semibold">Original Key</span>
                      <span className="text-sm text-neutral-500">
                        {items.original_key} Major
                      </span>
                    </p>
                  </div>
                </div>
                {/* TODO: tags */}
              </div>
              {/* right */}
              <div className="flex w-full flex-col gap-5">
                <h1 className="hidden rounded border px-5 py-3 text-4xl font-semibold md:block">
                  {items.name}
                </h1>
                <div className="rounded border p-5">
                  TODO: transpose section
                </div>
                {/* TODO: chords & lyrics */}
                <div className="rounded border p-5">
                  <p
                    ref={lyricsRef}
                    className="text-neutral-500"
                    dangerouslySetInnerHTML={{
                      __html: md.render(items.chord_lyrics),
                    }}
                  ></p>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Song;

Song.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};