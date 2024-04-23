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
  const [albumCoverImage, setAlbumCoverImage] = useState<Album[]>();
  const [gridCol, setGridCol] = useState("");

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
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    })();
  }, []);

  useEffect(() => {
    const filteredSongList = songList.filter((items) => {
      return (
        items.album?.toLowerCase().trim().replace(/ /g, "-") ===
        router.query.album?.toString()
      );
    });
    setFilteredSongList(filteredSongList);

    if (filteredSongList.length == 1) {
      setAlbumCoverImage(filteredSongList.slice(0, 1));
      setGridCol("grid-cols-1");
    } else if (filteredSongList.length == 2 || filteredSongList.length == 3) {
      setAlbumCoverImage(filteredSongList.slice(0, 2));
      setGridCol("grid-cols-1");
    } else if (filteredSongList.length >= 4) {
      setAlbumCoverImage(filteredSongList.slice(0, 4));
      setGridCol("grid-cols-2");
    } else {
      setGridCol("");
    }
  }, [songList, router.query.album]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  return (
    <>
      <AlbumBreadcrumb
        album={filteredSongList ? filteredSongList[0]?.album : "Album"}
        original_band={
          filteredSongList ? filteredSongList[0]?.original_band : "Band"
        }
      />
      <div className="block gap-5 sm:pt-5 md:flex">
        {/* left */}
        <div className="h-fit rounded border-2 p-5">
          <div
            className={`grid h-[300px] w-full gap-[1px] md:h-[200px] md:w-[200px] lg:h-[270px] ${gridCol} overflow-hidden rounded lg:w-[300px]`}
          >
            {albumCoverImage?.map((items, i) => {
              const originalYoutubeUrl = items.original_youtube_url ?? "";
              const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);

              if (youtubeVideoId) {
                const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;

                return (
                  <div
                    key={i}
                    className="flex items-center justify-center overflow-hidden"
                  >
                    <div className="relative h-[135%] w-full">
                      <Image
                        src={thumbnailUrl}
                        alt={items.name}
                        fill={true}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={i}
                    className="relative flex items-center justify-center overflow-hidden"
                  >
                    <div className="relative h-[135%] w-full">
                      <Image
                        src={"/img/logo.png"}
                        alt={items.name}
                        fill={true}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="py-3">
            <h1 className="font-semibold">Album</h1>
            <p className="text-sm text-neutral-500">
              {filteredSongList ? filteredSongList[0]?.album : "Album"}
            </p>
          </div>
          <div className="pb-3">
            <h1 className="font-semibold">Band</h1>
            <Link
              href={`/band/${
                filteredSongList
                  ? filteredSongList[0]?.original_band
                      .toLowerCase()
                      .replace(/ /g, "-")
                  : "Band"
              }`}
              className="text-sm text-neutral-500 underline md:no-underline md:hover:underline"
            >
              {filteredSongList ? filteredSongList[0]?.original_band : "Band"}
            </Link>
          </div>
          <hr />
          <div className="flex flex-col pt-3">
            <h1 className="font-semibold">Total Songs</h1>
            <p className="text-sm text-neutral-500">
              {filteredSongList?.length}
            </p>
          </div>
        </div>
        {/* right */}
        <div className="w-full pb-5 pt-5 md:pt-0">
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-2">
            {filteredSongList?.map((items, i) => {
              const originalYoutubeUrl = items.original_youtube_url ?? "";
              const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
              const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
              return (
                <Link
                  href={`/song/${items.name.toLowerCase().replace(/ /g, "-")}`}
                  key={i}
                  className="flex gap-5 truncate rounded border-2 p-5 lg:block xl:flex"
                >
                  <div className="relative w-[100px] sm:h-[100px] sm:w-[200px] md:h-[105px] md:w-[200px] lg:h-[150px] lg:w-full xl:h-[105px] xl:w-[200px]">
                    <Image
                      src={youtubeVideoId ? thumbnailUrl : "/img/no-cover.jpg"}
                      alt={items.name}
                      fill={true}
                      priority={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="lg:pt-2 xl:pt-0">
                    <h1 className="truncate text-sm md:text-base lg:text-lg">
                      <span className="font-semibold">{items.name}</span>{" "}
                      {items.alt_name && items.alt_name.trim() !== "-" && (
                        <span className="font-light">{items.alt_name}</span>
                      )}
                    </h1>
                    <p className="flex flex-col gap-1 truncate pt-1 text-xs text-neutral-500 lg:text-sm">
                      <span>
                        By{" "}
                        <Link
                          href={`/band/${items.original_band
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                          className="pointer-events-none md:pointer-events-auto md:font-semibold md:text-black md:hover:underline"
                        >
                          {items.original_band}
                        </Link>{" "}
                      </span>
                      {items.original_key && (
                        <span className="flex gap-1 truncate text-xs text-neutral-500 lg:text-sm">
                          Key of{" "}
                          <span className="md:font-semibold md:text-black">
                            {items.original_key} Major
                          </span>
                        </span>
                      )}
                      {items.song_language && (
                        <span className="flex gap-1 truncate text-xs text-neutral-500 lg:text-sm">
                          Language :
                          <span className="flex gap-1">
                            {items.song_language.split(" + ").map((lang, i) => {
                              return (
                                <span key={i} className="rounded border px-1">
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
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Album;

Album.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
