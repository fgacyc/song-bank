import React, { useEffect, useState, type ReactElement } from "react";
import Layout from "@/components/dir/layout/Layout";
import BandBreadcrumb from "@/components/dir/BandBreadcrumb";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

type Album = {
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

const Band = () => {
  const router = useRouter();
  const [songList, setSongList] = useState<Album[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(async (res) => {
          await res
            .json()
            .then((result: Album[]) => {
              setSongList(result);
              setIsLoading(false);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })();
  }, []);

  useEffect(() => {
    const filteredSongList = songList.filter((items) => {
      return (
        items.original_band.toLowerCase().replace(/ /g, "-") ===
        router.query.band?.toString()
      );
    });

    console.log(filteredSongList);
    setFilteredSongList(filteredSongList);
  }, [songList, router.query.band]);

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    const uniqueAlbumsSet = new Set<string>();
    filteredSongList.forEach((item) => {
      if (item.album && item.album.trim() !== "") {
        uniqueAlbumsSet.add(item.album);
      }
    });

    const uniqueAlbumsArray: string[] = Array.from(uniqueAlbumsSet);

    console.log(uniqueAlbumsArray); // remove this soon
    return (
      <>
        <BandBreadcrumb
          original_band={
            filteredSongList && filteredSongList.length > 0
              ? filteredSongList[0]?.original_band
              : "Band"
          }
        />
        <div className="grid grid-cols-4 gap-5 pt-5">
          {uniqueAlbumsArray.map((items, i) => {
            return (
              <Link
                href={`/album/${items.toLowerCase().replace(/ /g, "-")}`}
                key={i}
                className="flex flex-col items-center justify-center gap-3 rounded border p-5"
              >
                <div className="relative h-[250px] w-full">
                  <Image
                    src={""}
                    alt={""}
                    fill={true}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <h1 className="flex gap-1 text-sm">
                  <span className="font-semibold">{items}</span>
                  <span className="text-neutral-500">- 2024</span>
                </h1>
              </Link>
            );
          })}
        </div>
      </>
    );
  }
};

export default Band;

Band.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
