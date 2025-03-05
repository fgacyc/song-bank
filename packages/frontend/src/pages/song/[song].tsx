import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SongBreadcrumb from "@/components/dynamic/song/SongBreadcrumb";
import Head from "next/head";
import SongDetails from "@/components/dynamic/song/SongDetails";
import SongKeyTransposition from "@/components/dynamic/song/SongKeyTransposition";
import SongLyrics from "@/components/dynamic/song/SongLyrics";
import SongLoading from "@/components/dynamic/song/SongLoading";
import { useUser } from "@auth0/nextjs-auth0/client";
import { SongAssets } from "@/components/dynamic/song/SongAssets";
import type { SongType } from "..";
import Custom404 from "../404";
import ChordSheetJS from "chordsheetjs";

const DynamicSong = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const [filteredSong, setFilteredSong] = useState<SongType>();
  const chordLyricsRef = useRef<HTMLParagraphElement | null>(null);
  const [filteredChordLyrics, setFilteredChordLyrics] = useState("");
  const [selectedKey, setSelectedKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!filteredSong) return;
    setSelectedKey(filteredSong.original_key ?? "");
  }, [filteredSong]);

  useEffect(() => {
    if (router.query.song) {
      void (async () => {
        await fetch(`/api/song?song_id=${String(router.query.song)}`, {
          method: "GET",
        })
          .then(
            async (res) =>
              await res
                .json()
                .then((result: SongType) => {
                  if (result) {
                    setFilteredSong(result);
                  } else {
                    setNotFound(true);
                  }
                  setLoading(false);
                })
                .catch((err) => {
                  setNotFound(true);
                  console.error(err);
                }),
          )
          .catch((err) => console.error(err));
      })();
    }
  }, [router.query.song]);

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

  const parser = new ChordSheetJS.ChordProParser();
  const formatter = new ChordSheetJS.ChordProFormatter({
    normalizeChords: true,
  });

  useEffect(() => {
    const parsedChordLyrics = parser.parse(filteredSong?.chord_lyrics ?? "");

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
    const transposedChordLyrics = parsedChordLyrics.transpose(steps, {
      normalizeChordSuffix: true,
    });

    const formattedChordLyrics = formatter.format(transposedChordLyrics);

    setFilteredChordLyrics(formattedChordLyrics);
  }, [filteredSong, selectedKey]);

  const getVideoId = (url: string) => {
    const params = new URLSearchParams(new URL(url).search);
    return params.get("v");
  };

  if (notFound) {
    return <Custom404 />;
  }

  if (loading) {
    return <SongLoading />;
  }

  let embedUrl = "";
  if (
    filteredSong?.original_youtube_url &&
    filteredSong.original_youtube_url.toString().trim() !== ""
  ) {
    const videoId = getVideoId(filteredSong.original_youtube_url);
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  return !loading && !filteredSong ? (
    <Custom404 />
  ) : (
    <>
      <Head>
        <title>{filteredSong?.name}</title>
        <meta name="keywords" content={`${filteredSong?.name}`} />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="flex w-full flex-col gap-3 p-3">
        <SongBreadcrumb
          name={String(filteredSong?.name)}
          album={String(filteredSong?.album)}
          original_band={String(filteredSong?.original_band)}
        />
        <div className="flex flex-col gap-3 pb-3 md:flex-row">
          <div className="relative flex flex-col gap-3">
            <SongDetails embedUrl={embedUrl} items={filteredSong} />
            <SongAssets song={filteredSong} />
          </div>
          <div className="flex w-full flex-col gap-3">
            <SongKeyTransposition
              originalKey={filteredSong?.original_key}
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
};

export default DynamicSong;
