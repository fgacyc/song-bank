import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SongBreadcrumb from "@/components/dynamic/song/SongBreadcrumb";
import Head from "next/head";
import SongDetails from "@/components/dynamic/song/SongDetails";
import SongKeyTransposition from "@/components/dynamic/song/SongKeyTransposition";
import SongLyrics from "@/components/dynamic/song/SongLyrics";
import SongLoading from "@/components/dynamic/song/SongLoading";
import { ChordProParser, ChordProFormatter } from "chordsheetjs";
import { useUser } from "@auth0/nextjs-auth0/client";
import { SongAssets } from "@/components/dynamic/song/SongAssets";
import type { SongType } from "..";

const DynamicSong = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [filteredSong, setFilteredSong] = useState<SongType>();
  const chordLyricsRef = useRef<HTMLParagraphElement | null>(null);
  const [filteredChordLyrics, setFilteredChordLyrics] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.query.song) {
      void (async () => {
        await fetch(`/api/song?song_id=${router.query.song?.toString()}`, {
          method: "GET",
        })
          .then(
            async (res) =>
              await res
                .json()
                .then((result: SongType) => {
                  setFilteredSong(result);
                  setLoading(false);
                })
                .catch((err) => console.error(err)),
          )
          .catch((err) => console.error(err));
      })();
    }
  }, [router.query.song]);

  useEffect(() => {
    if (filteredSong > 0 && router.query.song) {
      const songExist = song.some((song) => {
        return song.id === router.query.song;
      });

      if (!songExist) {
        void router.push("/404");
      }
    }
  }, [filteredSong, router]);

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
    const parser = new ChordProParser();
    const parsedChordLyrics = parser.parse(
      filteredSong?.chord_lyrics ? filteredSong?.chord_lyrics : "",
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

    const original_key = filteredSong?.original_key;
    const steps = keys.indexOf(selectedKey) - keys.indexOf(original_key ?? "");
    const transposedChordLyrics = parsedChordLyrics.transpose(steps);

    const formatter = new ChordProFormatter();
    const formattedChordLyrics = formatter.format(transposedChordLyrics);

    setFilteredChordLyrics(formattedChordLyrics);
  }, [filteredSong, selectedKey]);

  const getVideoId = (url: string) => {
    const params = new URLSearchParams(new URL(url).search);
    return params.get("v");
  };

  if (loading) {
    return <SongLoading />;
  } else {
    let embedUrl = "";
    if (
      filteredSong.original_youtube_url &&
      filteredSong.original_youtube_url.toString().trim() !== ""
    ) {
      const videoId = getVideoId(filteredSong.original_youtube_url);
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    return (
      <>
        <Head>
          <title>{filteredSong?.name}</title>
          <meta name="keywords" content={`${filteredSong?.name}`} />
          <link rel="icon" href="/logo.png" />
        </Head>
        <div className="flex flex-col gap-5 p-5 pb-[50px] sm:pb-5">
          <SongBreadcrumb
            name={filteredSong.name!}
            album={filteredSong.album}
            original_band={filteredSong.original_band!}
          />
          <div className="flex flex-col gap-5 pb-5 md:flex-row">
            <div className="flex flex-col gap-5">
              <SongDetails embedUrl={embedUrl} items={filteredSong} />
              <SongAssets song={filteredSong} />
            </div>
            <div className="flex w-full flex-col gap-5">
              <h1 className="hidden rounded-lg border-2 px-5 py-3 text-4xl font-semibold md:block">
                {filteredSong.name}
              </h1>
              <SongKeyTransposition
                originalKey={filteredSong.original_key}
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
      </>
    );
  }
};

export default DynamicSong;
