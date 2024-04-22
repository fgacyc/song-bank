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
  const [filteredSongListWithAlbum, setFilteredSongListWithAlbum] = useState<
    Album[]
  >([]);
  const [filteredSongListWithoutAlbum, setFilteredSongListWithoutAlbum] =
    useState<Album[]>([]);
  const [uniqueAlbumList, setUniqueAlbumList] = useState<string[]>([]);
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
        items.original_band.toLowerCase().trim().replace(/ /g, "-") ===
        router.query.band?.toString()
      );
    });
    setFilteredSongList(filteredSongList);

    const filteredSongListWithAlbum = filteredSongList.filter((items) => {
      return items.album && items.album.toString().trim() !== "";
    });
    setFilteredSongListWithAlbum(filteredSongListWithAlbum);

    const filteredSongListWithoutAlbum = filteredSongList.filter((items) => {
      return items.album === null || items.album?.toString().trim() === "";
    });
    setFilteredSongListWithoutAlbum(filteredSongListWithoutAlbum);

    const uniqueAlbumSet = new Set();
    filteredSongListWithAlbum.forEach((items) => {
      uniqueAlbumSet.add(items.album);
    });
    const uniqueAlbumList = [...uniqueAlbumSet];
    setUniqueAlbumList(uniqueAlbumList as string[]);
  }, [songList, router.query.band]);

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
        <BandBreadcrumb original_band={filteredSongList[0]?.original_band} />
        <div className="flex flex-col items-start justify-center gap-5 truncate pb-5 sm:pt-5 lg:flex-row">
          {/* left */}
          <div className="flex w-full flex-col gap-5 lg:w-fit">
            {/* left 1 */}
            <div className="h-fit rounded border p-5">
              <div className="text-wrap pt-4">
                <h1 className="pl-1 text-sm text-neutral-500">Band</h1>
                <p className="w-full pb-5 text-5xl font-semibold sm:w-[260px] md:w-[280px] lg:w-[300px]">
                  {filteredSongList[0]?.original_band}
                </p>
              </div>
              <hr />
              <div className="flex flex-col py-3">
                <h1 className="font-semibold">Total Songs</h1>
                <p className="text-sm text-neutral-500">
                  {filteredSongList.length}
                </p>
              </div>
              <div className="flex flex-col">
                <h1 className="font-semibold">Total Albums</h1>
                <p className="text-sm text-neutral-500">
                  {uniqueAlbumList.length}
                </p>
              </div>
            </div>

            {/* left 2 */}
            {filteredSongListWithoutAlbum.length > 0 && (
              <div className="flex flex-col gap-1 truncate rounded border p-5">
                <h1 className="font-semibold">Songs Without Album</h1>
                {filteredSongListWithoutAlbum.map((items, i) => {
                  return (
                    <p key={i} className="text-sm text-neutral-500">
                      {i + 1}.{" "}
                      <Link
                        href={`/song/${items.name
                          .toLowerCase()
                          .trim()
                          .replace(/ /g, "-")}`}
                        className="hover:underline"
                      >
                        {items.name}
                      </Link>
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* right */}
          <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {uniqueAlbumList.map((album, i) => {
              const songsInAlbum = filteredSongListWithAlbum.filter(
                (items) => items.album === album,
              );
              const numberOfSongsInAlbum = songsInAlbum.length;

              const songsToShow =
                numberOfSongsInAlbum === 1
                  ? 1
                  : numberOfSongsInAlbum >= 4
                    ? 4
                    : 2;
              const songsToShowInAlbum = songsInAlbum.slice(0, songsToShow);

              let gridCol = "";
              if (numberOfSongsInAlbum == 1) {
                gridCol = "grid-cols-1";
              } else if (
                numberOfSongsInAlbum == 2 ||
                numberOfSongsInAlbum == 3
              ) {
                gridCol = "grid-cols-2";
              } else if (numberOfSongsInAlbum >= 4) {
                gridCol = "grid-cols-2";
              }
              return (
                <Link
                  key={i}
                  href={`/album/${album
                    ?.toLowerCase()
                    .trim()
                    .replace(/ /g, "-")}`}
                  className="flex flex-col items-center justify-between gap-1 truncate rounded border p-5"
                >
                  <div
                    className={`grid ${gridCol} h-[250px] w-full gap-[1px] overflow-hidden rounded border`}
                  >
                    {songsToShowInAlbum.map((items, j) => {
                      console.log(`${album}: ${j}`);
                      const originalYoutubeUrl =
                        items.original_youtube_url ?? "";
                      const youtubeVideoId =
                        getYoutubeVideoId(originalYoutubeUrl);
                      const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                      return (
                        <div
                          key={j}
                          className="flex w-full border-spacing-52 items-center justify-center overflow-hidden"
                        >
                          <div className="relative h-[135%] w-full">
                            <Image
                              src={
                                youtubeVideoId
                                  ? thumbnailUrl
                                  : "/img/no-cover.jpg"
                              }
                              alt={items.name}
                              fill={true}
                              priority={true}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <h1>
                    <span className="font-medium">{album}</span>{" "}
                    <span className="text-sm text-neutral-500">
                      - {numberOfSongsInAlbum} songs
                    </span>
                  </h1>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  }
};

export default Band;

Band.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
