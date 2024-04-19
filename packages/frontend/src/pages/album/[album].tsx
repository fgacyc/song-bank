import AlbumBreadcrumb from "@/components/dir/AlbumBreadcrumb";
import Layout from "@/components/dir/layout/Layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, type ReactElement } from "react";

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

const Album = () => {
  const router = useRouter();
  const [songList, setSongList] = useState<Album[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Album[]>();
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
        items.album &&
        items.album.toLowerCase().replace(/ /g, "-") ===
          router.query.album?.toString()
      );
    });
    setFilteredSongList(filteredSongList);
  }, [songList, router.query.album]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <AlbumBreadcrumb
          album={filteredSongList ? filteredSongList[0]?.album : "Album"}
          original_band={
            filteredSongList ? filteredSongList[0]?.original_band : "Band"
          }
        />
        <div className="flex gap-5 pt-5">
          {/* left */}
          <div className="h-fit rounded border p-5">
            <div className="relative h-[25dvh] w-full sm:h-[125px] sm:w-[260px] md:h-[145px] md:w-[280px] lg:h-[165px] lg:w-[300px]">
              <Image
                src={""}
                alt={""}
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-md object-cover"
              />
            </div>
            <div className="py-3">
              <h1 className="font-semibold">Album</h1>
              <p className="text-sm text-neutral-500 hover:underline">
                {filteredSongList ? filteredSongList[0]?.album : "Album"}
              </p>
            </div>
          </div>
          {/* right */}
          <div className="w-full">
            <div className="grid grid-cols-2 gap-5">
              {songList
                .filter(
                  (items) =>
                    router.query.album &&
                    `${items.album?.toLowerCase().replace(/ /g, "-")}` ===
                      router.query.album.toString(),
                )
                .map((items, i) => {
                  const originalYoutubeUrl = items.original_youtube_url ?? "";
                  const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
                  if (youtubeVideoId) {
                    const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                    return (
                      <Link
                        href={`/song/${items.name
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                        key={i}
                        className="flex gap-5 rounded border p-5"
                      >
                        <div className="relative h-[25dvh] w-full sm:h-[125px] sm:w-[260px] md:h-[145px] md:w-[280px] lg:h-[110px] lg:w-[200px]">
                          <Image
                            src={thumbnailUrl}
                            alt={items.name}
                            fill={true}
                            priority={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div>
                          <h1 className="truncate text-lg">
                            <span className="font-semibold">{items.name}</span>{" "}
                            {items.alt_name &&
                              items.alt_name.trim() !== "-" && (
                                <span className=" font-light">
                                  {items.alt_name}
                                </span>
                              )}
                          </h1>
                          <p className="flex flex-col gap-1 truncate pt-1 text-xs text-neutral-500 lg:text-sm">
                            <span>
                              By{" "}
                              <Link
                                href={`/band/${items.original_band
                                  .toLowerCase()
                                  .replace(/ /g, "-")}`}
                                className="font-semibold text-black hover:underline"
                              >
                                {items.original_band}
                              </Link>{" "}
                            </span>
                            {items.original_key && (
                              <span className="flex gap-1 truncate text-xs text-neutral-500 lg:text-sm">
                                Key of{" "}
                                <span className="font-semibold text-black">
                                  {items.original_key} Major
                                </span>
                              </span>
                            )}
                            {items.song_language && (
                              <span className="flex gap-1 truncate text-xs text-neutral-500 lg:text-sm">
                                Language :
                                <span className="flex gap-1">
                                  {items.song_language
                                    .split(" + ")
                                    .map((lang, i) => {
                                      return (
                                        <span
                                          key={i}
                                          className="rounded border px-1"
                                        >
                                          {lang}
                                        </span>
                                      );
                                    })}
                                </span>
                              </span>
                            )}
                          </p>
                        </div>
                      </Link>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default Album;

Album.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
