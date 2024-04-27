import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import SearchBar from "@/components/search/SearchBar";
import ListView from "@/components/search/ListView";
import GalleryView from "@/components/search/GalleryView";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import Layout from "@/components/layout/Layout";
import FilterTags from "@/components/search/FilterTags";
import { type Song } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

const Search = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [songList, setSongList] = useState<Song[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Song[]>([]);
  const [showBand, setShowBand] = useState<boolean | undefined>(false);
  const [showAlbum, setShowAlbum] = useState<boolean | undefined>(false);
  const [channelProfile, setChannelProfile] = useState("");

  const [searchString, setSearchString] = useState("");
  const [leftActiveList, setLeftActiveList] = useState(-1);
  const [rightActiveList, setRightActiveList] = useState(-1);

  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const searchSong = async () => {
      await fetch("/api/song", {
        method: "GET",
      })
        .then(async (res) => {
          await res
            .json()
            .then((result: Song[]) => {
              setSongList(result);
              setIsLoading(false);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    };

    void searchSong();
    setSearchString(localStorage.getItem("song-search") ?? "");
    localStorage.removeItem("song-search");
  }, [mounted]);

  useEffect(() => {
    const apiKey = "AIzaSyACcxuHB_5vduPISTHPH5XjJNlZWjSd8R4";

    const getYoutubeVideoId = (youtubeUrl: string | null | undefined) => {
      const regex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
      const match = youtubeUrl?.match(regex);
      return match ? match[1] : null;
    };

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

  useMemo(() => {
    const filteredSongList = songList.filter((items) => {
      const songName = items.name?.concat(
        " ",
        items.alt_name ? items.alt_name : "",
      );
      const matchingSongName = songName!
        .toLowerCase()
        .replace(/[', ]/g, "")
        .includes(searchString.toLowerCase().replace(/[', ]/g, ""));
      const matchingBand = items
        .original_band!.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, ""));
      const matchingAlbum = items.album
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, ""));
      return matchingSongName || matchingBand || matchingAlbum;
    });
    setFilteredSongList(filteredSongList);

    const showBand =
      filteredSongList[0]?.original_band
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      filteredSongList.every(
        (items, _, array) => items.original_band === array[0]?.original_band,
      );
    setShowBand(showBand);
    const showAlbum =
      filteredSongList[0]?.album
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      filteredSongList.every(
        (items, _, array) => items.album === array[0]?.album,
      );
    setShowAlbum(showAlbum);
  }, [songList, searchString]);

  useMemo(() => {
    console.log("filteredSongList", filteredSongList);
  }, [filteredSongList]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  return (
    <>
      <div className="sticky top-[70px] z-10 justify-between border-b bg-white p-3 sm:flex md:flex lg:flex">
        <div className="flex items-center gap-3">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
          />
          {/* <FilterTags activeTag={activeTag} setActiveTag={setActiveTag} /> */}
        </div>
      </div>

      <div className="flex gap-5 sm:p-5">
        {/* left */}
        <div className="flex w-full flex-col gap-3">
          {/* Band */}
          {showBand && (
            <>
              <Link
                href={`/band/${filteredSongList[0]!
                  .original_band!.toLowerCase()
                  .replace(/ /g, "-")}`}
                className={`${
                  leftActiveList === -2 ? "bg-[#f5f5f6] shadow-md" : ""
                } flex gap-5 border-b p-5 pl-7 sm:rounded sm:border-2`}
                onMouseEnter={() => {
                  setLeftActiveList(-2);
                }}
                onMouseLeave={() => {
                  setLeftActiveList(-1);
                }}
              >
                <div className="relative h-[70px] w-[70px] overflow-hidden rounded-full md:h-[100px] md:w-[100px]">
                  <Image
                    src={channelProfile}
                    alt={
                      filteredSongList[0]?.original_band
                        ? filteredSongList[0].original_band
                        : "band"
                    }
                    fill={true}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h1 className="text-lg font-semibold md:text-2xl">
                    {filteredSongList[0]?.original_band}
                  </h1>
                  <p className="text-xs text-slate-500 md:text-sm">
                    {
                      [
                        ...new Set(
                          filteredSongList
                            .filter((items) => items.album)
                            .map((items) => items.album),
                        ),
                      ].length
                    }{" "}
                    albums
                  </p>
                  <p className="text-sm text-slate-500">
                    {filteredSongList.length} songs
                  </p>
                </div>
              </Link>
              <hr className="hidden sm:block" />
            </>
          )}

          {/* Album */}
          {showAlbum && (
            <>
              <Link
                href={`/album/${filteredSongList[0]!.album
                  ?.toLowerCase()
                  .replace(/ /g, "-")}`}
                className={`${
                  leftActiveList === -2 ? "bg-[#f5f5f6] shadow-md" : ""
                } sm:white flex gap-5 rounded border-b px-7 py-5 sm:border-2`}
                onMouseEnter={() => {
                  setLeftActiveList(-2);
                }}
                onMouseLeave={() => {
                  setLeftActiveList(-1);
                }}
              >
                <div className="flex w-full items-center justify-between ">
                  <div>
                    <h1 className="text-lg font-semibold md:text-2xl">
                      {filteredSongList[0]?.album}
                    </h1>
                    <p className="text-xs text-slate-500 md:text-sm">
                      {filteredSongList[0]?.original_band}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 md:text-sm">
                    {filteredSongList.length} songs
                  </p>
                </div>
              </Link>
              <hr className="hidden sm:block" />
            </>
          )}

          {/* Song */}
          {(showBand! || showAlbum) && (
            <h1 className="pl-3 text-lg font-semibold sm:pl-0">
              Songs from{" "}
              {showAlbum
                ? filteredSongList[0]?.album
                : filteredSongList[0]?.original_band}
            </h1>
          )}
          {filteredSongList.map((items, i) => {
            const originalYoutubeUrl = items.original_youtube_url ?? "";
            const youtubeVideoId = getYoutubeVideoId(originalYoutubeUrl);
            const thumbnailUrl = `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg`;
            return (
              <button
                key={i}
                className={`${
                  leftActiveList === i ? "bg-[#f5f5f6] shadow-md" : ""
                } flex flex-col gap-5 rounded border-b pb-3 sm:flex-row sm:border-2 sm:p-3`}
                onClick={() =>
                  void router.push(
                    `/song/${items.name?.toLowerCase().replace(/ /g, "-")}`,
                  )
                }
                onMouseEnter={() => setLeftActiveList(i)}
                onMouseLeave={() => setLeftActiveList(-1)}
              >
                <div className="relative h-[30dvh] w-full overflow-hidden sm:h-[110px] sm:w-[200px] sm:min-w-[200px] sm:rounded md:h-[140px] md:w-[250px] md:min-w-[250px] lg:h-[165px] lg:w-[300px] lg:min-w-[300px]">
                  <Image
                    src={thumbnailUrl}
                    alt={items.name!}
                    fill={true}
                    priority={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 truncate pb-3 pl-3 sm:pb-0 sm:pl-0">
                  <h1 className="text-start text-lg font-semibold md:text-2xl">
                    {items.name}
                  </h1>
                  <div className="flex flex-col gap-1 text-start text-xs text-slate-500 md:text-sm">
                    <p>
                      {items.original_band && (
                        <>
                          <span>
                            By{" "}
                            <button
                              className="md:font-semibold md:text-black md:hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                void router.push(
                                  `/band/${items
                                    .original_band!.toLowerCase()
                                    .replace(/ /g, "-")}`,
                                );
                              }}
                            >
                              {items.original_band}
                            </button>
                          </span>{" "}
                        </>
                      )}

                      {items.album && (
                        <span>
                          on album{" "}
                          <button
                            className="md:font-semibold md:text-black md:hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              void router.push(
                                `/album/${items.album
                                  ?.toLowerCase()
                                  .replace(/ /g, "-")}`,
                              );
                            }}
                          >
                            {items.album}
                          </button>
                        </span>
                      )}
                    </p>
                    {items.original_key && (
                      <p>Key of {items.original_key} Major</p>
                    )}
                    {items.song_language && (
                      <p className="flex items-center gap-1">
                        Language :
                        <span className="flex gap-1">
                          {items.song_language
                            .split(" + ")
                            .map((language, j) => {
                              return (
                                <span
                                  key={j}
                                  className="rounded border px-1 text-xs"
                                >
                                  {language}
                                </span>
                              );
                            })}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Lyrics */}
          {}
        </div>
        {/* right */}
        {showBand && (
          <div className="hidden h-fit w-5/12 flex-col gap-3 lg:flex">
            <h1 className="text-lg font-semibold">
              Albums from {filteredSongList[0]?.original_band}
            </h1>
            {[
              ...new Set(
                filteredSongList
                  .filter((items) => items.album)
                  .map((items) => items.album),
              ),
            ].map((album, i) => (
              <Link
                href={`/album/${album?.toLowerCase().replace(/ /g, "-")}`}
                key={i}
                className={`${
                  rightActiveList === i ? "bg-[#f5f5f6] shadow-md" : ""
                } rounded border-2 p-3 px-5`}
                onMouseEnter={() => setRightActiveList(i)}
                onMouseLeave={() => setRightActiveList(-1)}
              >
                <h1 className="font-semibold">{album}</h1>
                <p className="text-sm text-slate-500">
                  {
                    filteredSongList.filter((items) => {
                      return (
                        items.album?.toLowerCase().replace(/ /g, "") ===
                        album?.toLowerCase().replace(/ /g, "")
                      );
                    }).length
                  }{" "}
                  songs
                </p>
              </Link>
            ))}
          </div>
        )}
        {/* {showAlbum && !showBand && (
          <Link
            href={`/band/${filteredSongList[0]!
              .original_band!.toLowerCase()
              .replace(/ /g, "-")}`}
            className={`${
              rightActiveList === -2 ? "bg-[#f5f5f6] shadow-md" : ""
            } hidden h-fit w-fit flex-col items-center gap-5 rounded border-2 p-7 lg:flex`}
            onMouseEnter={() => setRightActiveList(-2)}
            onMouseLeave={() => setRightActiveList(-1)}
          >
            <div className="relative h-[150px] w-[150px] overflow-hidden rounded-full">
              <Image
                src={channelProfile}
                alt={
                  filteredSongList[0]?.original_band
                    ? filteredSongList[0].original_band
                    : "band"
                }
                fill={true}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              <h1 className="text-2xl font-semibold">
                {filteredSongList[0]?.original_band}
              </h1>
              <p className="text-sm text-slate-500">
                {
                  new Set(
                    songList
                      .filter(
                        (items) =>
                          items.original_band ===
                          filteredSongList[0]?.original_band,
                      )
                      .filter((items) => items.album)
                      .map((items) => items.album),
                  ).size
                }{" "}
                albums
              </p>
              <p className="text-sm text-slate-500">
                {
                  songList.filter(
                    (items) =>
                      items.original_band ===
                      filteredSongList[0]?.original_band,
                  ).length
                }{" "}
                songs
              </p>
            </div>
          </Link>
        )} */}
      </div>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
