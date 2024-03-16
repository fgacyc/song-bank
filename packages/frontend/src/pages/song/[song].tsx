import React, { useState, type ReactElement, useEffect } from "react";
import Layout from "@/components/dir/layout/Layout";
import Link from "next/link";

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

const Song = () => {
  const [songList, setSongList] = useState<Song[]>([]);

  useEffect(() => {
    const loadSongList = async () => {
      await fetch("/api/song", {
        method: "GET",
      }).then(
        async (res) =>
          await res.json().then((result: Song[]) => {
            setSongList(result);
          }),
      );
    };
    void loadSongList();
  }, []);

  return (
    <>
      {songList.map((items, i) => {
        return (
          <div key={i}>
            <p>Title : {items.album}</p>
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
