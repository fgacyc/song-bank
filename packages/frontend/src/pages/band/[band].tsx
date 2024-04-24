import React, { useEffect, useState, type ReactElement } from "react";
import Layout from "@/components/dir/layout/Layout";
import BandBreadcrumb from "@/components/dir/BandBreadcrumb";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

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
  const [channelProfile, setChannelProfile] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeBand, setActiveBand] = useState<number | null>(null);

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

  const getYoutubeVideoId = (youtubeUrl: string | undefined) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl?.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const apiKey = "AIzaSyACcxuHB_5vduPISTHPH5XjJNlZWjSd8R4";

    void (async () => {
      const videoId = getYoutubeVideoId(
        filteredSongList[0]?.original_youtube_url,
      );
      await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${apiKey}`,
        { method: "GET" },
      ).then(async (res) => {
        await res.json().then((result) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const channelId = result.items[0]?.snippet.channelId;
          if (channelId) {
            void (async () => {
              await fetch(
                `https://youtube.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`,
                { method: "GET" },
              ).then(async (res) => {
                await res.json().then((result) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const channelProfile: string =
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    result.items[0]?.snippet.thumbnails.high.url;
                  setChannelProfile(channelProfile);
                  setIsLoading(false);
                });
              });
            })();
          }
        });
      });
    })();
  }, [filteredSongList]);

  if (!isLoading) {
    return (
      <>
        <Head>
          <title>
            {filteredSongList
              ? filteredSongList[0]?.original_band
              : "Song Bank"}
          </title>
        </Head>
        <BandBreadcrumb original_band={filteredSongList[0]?.original_band} />
        <div className="flex flex-col gap-5 pb-5 sm:pt-5 md:flex-row">
          {/* left */}
          <div className="flex w-full flex-col gap-5 md:w-fit">
            {/* left 1 */}
            <div className="h-fit w-full rounded border-2 p-5 md:w-[200px] lg:w-[300px]">
              <div className="flex w-full items-center justify-start gap-5 truncate pb-5 md:flex-col md:items-start md:pt-5">
                {channelProfile && (
                  <div className="flex justify-center md:w-full">
                    <div className="relative h-[100px] w-[100px] md:h-[100px] md:w-[100px] lg:h-[200px] lg:w-[200px]">
                      <Image
                        src={channelProfile}
                        alt={router.query.band as string}
                        fill={true}
                        priority={true}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                <div className="text-wrap pt-4">
                  <h1 className="pl-1 text-sm text-neutral-500">Band</h1>
                  <p className="w-full text-3xl font-semibold">
                    {filteredSongList[0]?.original_band}
                  </p>
                </div>
              </div>

              <hr />
              <div className="flex flex-col pb-3 pt-4">
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
              <div className="flex flex-col gap-1 truncate rounded border-2 p-5">
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
                        className="underline md:no-underline md:hover:underline"
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
          <div className="grid w-full gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
                  className={`${
                    activeBand === i ? "bg-[#f5f5f6] shadow-md" : ""
                  } flex h-full flex-col items-center overflow-hidden rounded border-2 p-5`}
                  onMouseEnter={() => {
                    setActiveBand(i);
                  }}
                  onMouseLeave={() => {
                    setActiveBand(null);
                  }}
                >
                  <div
                    className={`grid ${gridCol} h-[250px] w-full gap-[1px] rounded`}
                  >
                    {songsToShowInAlbum.map((items, j) => {
                      const originalYoutubeUrl =
                        items.original_youtube_url ?? "";
                      const youtubeVideoId =
                        getYoutubeVideoId(originalYoutubeUrl);
                      const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
                      return (
                        <div
                          key={j}
                          className="flex items-center justify-center overflow-hidden"
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
                  <h1 className="flex flex-wrap items-center justify-center gap-1 pt-2">
                    <div className="font-medium">{album}</div>
                    <div className="text-center text-neutral-500">
                      - {numberOfSongsInAlbum} songs
                    </div>
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
