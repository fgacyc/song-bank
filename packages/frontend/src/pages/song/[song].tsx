import React, { useState, type ReactElement, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SongBreadcrumb from "@/components/dynamic/song/SongBreadcrumb";
import Head from "next/head";
import { type Tag, type Song, type Sequencer } from "@prisma/client";
import SongDetails from "@/components/dynamic/song/SongDetails";
import SongKeyTransposition from "@/components/dynamic/song/SongKeyTransposition";
import SongLyrics from "@/components/dynamic/song/SongLyrics";
import SongLoading from "@/components/dynamic/song/SongLoading";
import Layout from "@/components/layout/Layout";
import { ChordProParser, ChordProFormatter } from "chordsheetjs";
import { useUser } from "@auth0/nextjs-auth0/client";

type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const DynamicSong = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [songList, setSongList] = useState<SongType[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>([]);
  const chordLyricsRef = useRef<HTMLParagraphElement | null>(null);
  const [filteredChordLyrics, setFilteredChordLyrics] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(
          async (res) =>
            await res
              .json()
              .then((result: SongType[]) => {
                setSongList(result);
                setLoading(false);
              })
              .catch((err) => console.error(err)),
        )
        .catch((err) => console.error(err));
    })();
  }, []);

  useEffect(() => {
    if (songList.length > 0 && router.query.song) {
      const songExist = songList.some((song) => {
        return (
          song.name?.toLowerCase().trim().replace(/ /g, "-") ===
          router.query.song
        );
      });

      if (!songExist) {
        void router.push("/404");
      }
    }
  }, [songList, router]);

  useEffect(() => {
    if (!isLoading && user && router.query.song) {
      void (async () => {
        await fetch("/api/history", {
          method: "POST",
          body: JSON.stringify({
            user_id: user.sub,
            search_content: router.query.song,
            search_category: "song",
          }),
        });
      })();
    }
  }, [isLoading, user, router.query.song]);

  // TODO: fix fetching twice bug
  // useEffect(() => {
  //   console.log(!isLoading, user, router.query.song);
  // }, [isLoading, user, router.query.song]);

  useEffect(() => {
    const filteredSongList = songList.filter(
      (items) =>
        router.query.song &&
        `${items.name!.toLowerCase().trim().replace(/ /g, "-")}` ===
          router.query.song.toString(),
    );
    setFilteredSongList(filteredSongList);
    setSelectedKey(filteredSongList[0]?.original_key ?? "");
  }, [songList, router.query.song]);

  useEffect(() => {
    const parser = new ChordProParser();
    const parsedChordLyrics = parser.parse(
      filteredSongList[0]?.chord_lyrics
        ? filteredSongList[0]?.chord_lyrics
        : "",
    );

    const keys = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    const original_key = filteredSongList[0]?.original_key;
    const steps = keys.indexOf(selectedKey) - keys.indexOf(original_key ?? "");
    const transposedChordLyrics = parsedChordLyrics.transpose(steps);

    const formatter = new ChordProFormatter();
    const formattedChordLyrics = formatter.format(transposedChordLyrics);

    setFilteredChordLyrics(formattedChordLyrics);
  }, [filteredSongList, selectedKey]);

  const getVideoId = (url: string) => {
    const params = new URLSearchParams(new URL(url).search);
    return params.get("v");
  };

  if (loading) {
    return <SongLoading />;
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
            <div key={i} className="flex flex-col gap-5 p-5 pb-[50px] sm:pb-5">
              <SongBreadcrumb
                name={items.name!}
                album={items.album}
                original_band={items.original_band!}
              />
              <div className="flex flex-col gap-5 pb-5 md:flex-row">
                <SongDetails embedUrl={embedUrl} items={items} />
                <div className="flex w-full flex-col gap-5">
                  <h1 className="hidden rounded-lg border-2 px-5 py-3 text-4xl font-semibold md:block">
                    {items.name}
                  </h1>
                  <SongKeyTransposition
                    originalKey={items.original_key}
                    selectedKey={selectedKey}
                    setSelectedKey={setSelectedKey}
                  />
                  <SongLyrics
                    chordLyricsRef={chordLyricsRef}
                    chordLyrics={filteredChordLyrics}
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
  return <Layout>{page}</Layout>;
};
