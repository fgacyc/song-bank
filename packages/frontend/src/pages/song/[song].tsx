import React, { useState, type ReactElement, useEffect, useRef } from "react";
import DynamicLayout from "@/components/dynamic/dynamic-layout/DynamicLayout";
import { useRouter } from "next/router";
import SongBreadcrumb from "@/components/dynamic/song/SongBreadcrumb";
import Head from "next/head";
import { type Song } from "@prisma/client";
import SongDetails from "@/components/dynamic/song/SongDetails";
import SongKeyTransposition from "@/components/dynamic/song/SongKeyTransposition";
import SongLyrics from "@/components/dynamic/song/SongLyrics";
import SongLoading from "@/components/dynamic/song/SongLoading";

const DynamicSong = () => {
  const router = useRouter();
  const [songList, setSongList] = useState<Song[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Song[]>([]);
  const lyricsRef = useRef<HTMLParagraphElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(
          async (res) =>
            await res
              .json()
              .then((result: Song[]) => {
                setSongList(result);
                setIsLoading(false);
              })
              .catch((err) => console.error(err)),
        )
        .catch((err) => console.error(err));
    })();
  }, []);

  useEffect(() => {
    const filteredSongList = songList.filter(
      (items) =>
        router.query.song &&
        `${items.name!.toLowerCase().replace(/ /g, "-")}` ===
          router.query.song.toString(),
    );
    setFilteredSongList(filteredSongList);
  }, [songList, router.query.song]);

  const getVideoId = (url: string) => {
    const params = new URLSearchParams(new URL(url).search);
    return params.get("v");
  };

  if (isLoading) {
    <SongLoading />;
  } else {
    return (
      <>
        <Head>
          <title>
            {filteredSongList ? filteredSongList[0]?.name : "Song Bank"}
          </title>
        </Head>
        {filteredSongList.map((items, i) => {
          const videoId = getVideoId(items.original_youtube_url ?? "");
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          return (
            <div key={i} className="flex flex-col gap-5">
              <SongBreadcrumb
                name={items.name!}
                album={items.album}
                original_band={items.original_band!}
              />
              <div className="flex flex-col gap-5 pb-5 md:flex-row">
                <SongDetails embedUrl={embedUrl} items={items} />
                <div className="flex w-full flex-col gap-5">
                  <h1 className="hidden rounded border-2 px-5 py-3 text-4xl font-semibold md:block">
                    {items.name}
                  </h1>
                  <SongKeyTransposition />
                  <SongLyrics
                    lyricsRef={lyricsRef}
                    chordLyrics={items.chord_lyrics ? items.chord_lyrics : ""}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }
};

export default DynamicSong;

DynamicSong.getLayout = function getLayout(page: ReactElement) {
  return <DynamicLayout>{page}</DynamicLayout>;
};
