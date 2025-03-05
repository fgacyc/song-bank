/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useMemo, useState } from "react";
import SearchBar from "@/components/index/SearchBar";
import type { Tag, Song, Sequencer } from "@prisma/client";
import SearchFilterTags from "@/components/index/SearchFilterTags";
import SearchBand from "@/components/index/SearchBand";
import SearchAlbum from "@/components/index/SearchAlbum";
import SearchSongList from "@/components/index/SearchSongList";
import SearchAlbumList from "@/components/index/SearchAlbumList";
import SearchLoading from "@/components/index/SearchLoading";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [songList, setSongList] = useState<SongType[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>([]);
  const [showBand, setShowBand] = useState<boolean | undefined>(false);
  const [showAlbum, setShowAlbum] = useState<boolean | undefined>(false);
  const [channelProfile, setChannelProfile] = useState("");
  const [searchString, setSearchString] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [nextCursor, setnextCursor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [cursorStack, setCursorStack] = useState<string[]>([""]); // Stack to store cursors for previous pages

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    void fetchSongs();
    setSearchString(localStorage.getItem("song-search") ?? "");
    localStorage.removeItem("song-search");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const fetchSongs = async (cursor?: string) => {
    try {
      if (cursor) {
        setIsFetching(true);
      } else {
        setIsLoading(true);
      }
      const queryParams = new URLSearchParams();

      // Only add params that have values
      if (cursor) queryParams.set("cursor", cursor);
      if (searchString) queryParams.set("search", searchString);
      if (selectedKey) queryParams.set("key", selectedKey);
      if (selectedLanguage) queryParams.set("language", selectedLanguage);

      const res = await fetch(`/api/songs?${queryParams.toString()}`);
      const { items, hasMore }: { items: SongType[]; hasMore: boolean } =
        await res.json();

      setSongList(items);
      setFilteredSongList(items);
      setHasNextPage(hasMore);

      if (items.length > 0) {
        const lastItem = items[items.length - 1];
        setnextCursor(lastItem?.id ?? "");
        if (!cursor) {
          setCursorStack([""]); // Reset stack for new search
        } else {
          setCursorStack((prev) =>
            prev[prev.length - 1] !== cursor ? [...prev, cursor] : prev,
          );
        }
      } else {
        setHasNextPage(false);
      }
    } catch (err) {
      console.error(err);
      setSongList([]);
      setFilteredSongList([]);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Handle filter changes
  useEffect(() => {
    if (mounted) {
      setCurrentPage(1);
      void fetchSongs(); // Fetch without cursor when filters change
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKey, selectedLanguage, searchString]);

  // Pagination handlers
  const goToNextPage = async () => {
    if (!hasNextPage || !nextCursor) return;
    setCurrentPage((prev) => prev + 1);
    await fetchSongs(nextCursor);
  };

  const goToPreviousPage = async () => {
    if (currentPage <= 1) return;
    const previousCursor = cursorStack[cursorStack.length - 2] ?? "";
    setCursorStack((prev) => prev.slice(0, -1)); // Remove the last cursor
    setCurrentPage((prev) => prev - 1);
    await fetchSongs(previousCursor);
  };

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_DATA_API;

    const getYoutubeVideoId = (youtubeUrl: string | null | undefined) => {
      const regex =
        /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
      const match = youtubeUrl?.match(regex);
      return match ? match[1] : null;
    };

    if (showBand) {
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
            const channelId = result?.items?.[0]?.snippet?.channelId;
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
    }
  }, [filteredSongList, showBand]);

  useMemo(() => {
    const showBand =
      searchString.trim() !== "" &&
      songList[0]?.original_band
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      songList.every(
        (items, _, array) => items.original_band === array[0]?.original_band,
      );
    setShowBand(showBand);

    const showAlbum =
      searchString.trim() !== "" &&
      songList[0]?.album
        ?.toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, "")) &&
      songList.every((items, _, array) => items.album === array[0]?.album);
    setShowAlbum(showAlbum);
  }, [songList, searchString]);

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  return (
    <section className="relative z-0 flex w-full flex-col pb-[50px]">
      <div className="sticky top-[50px] z-10 justify-between border-b bg-white p-3 md:top-[70px] md:flex md:flex md:px-3 lg:flex">
        <div className="z-20 flex items-center justify-between gap-4">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <SearchFilterTags
            selectedKey={selectedKey}
            setSelectedKey={setSelectedKey}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
          />
        </div>
        {filteredSongList.length > 0 && (
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1 || isFetching}
              className="flex items-center gap-1 p-2 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <IoChevronBack
                size={20}
                className={isFetching ? "animate-pulse" : ""}
              />
            </button>
            <div className="flex items-center gap-3">
              {currentPage > 1 ? (
                <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-700" />
              ) : (
                <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-300" />
              )}
              <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-gray-700 p-1 text-sm text-white">
                {currentPage}
              </div>
              {hasNextPage ? (
                <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-700" />
              ) : (
                <div className="h-[12.5px] w-[12.5px] rounded-full bg-gray-300" />
              )}
            </div>
            <button
              onClick={goToNextPage}
              disabled={!hasNextPage || isFetching}
              className="flex items-center gap-1 p-2 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <IoChevronForward
                size={20}
                className={isFetching ? "animate-pulse" : ""}
              />
            </button>
          </div>
        )}
      </div>
      {isLoading ? (
        <SearchLoading />
      ) : (
        <div className="flex p-3">
          <div className="flex w-full flex-col gap-1.5 md:gap-3">
            <SearchBand
              showBand={showBand}
              searchString={searchString}
              songList={songList}
              filteredSongList={filteredSongList}
              channelProfile={channelProfile}
            />
            <SearchAlbum
              showAlbum={showAlbum}
              searchString={searchString}
              songList={songList}
              filteredSongList={filteredSongList}
            />
            <SearchSongList
              showBand={showBand}
              showAlbum={showAlbum}
              filteredSongList={filteredSongList}
              getYoutubeVideoId={getYoutubeVideoId}
              searchString={searchString}
            />

            {filteredSongList.length == 0 && (
              <div className="flex h-[75dvh] flex-col items-center justify-center gap-5">
                <Image
                  src={"/no-search-result.svg"}
                  alt="no search result"
                  width={200}
                  height={200}
                />
                <p className="text-sm text-neutral-500">No result found.</p>
              </div>
            )}
          </div>
          <SearchAlbumList
            showBand={showBand}
            searchString={searchString}
            songList={songList}
            filteredSongList={filteredSongList}
          />
        </div>
      )}

      {/* Mobile Footer with Pagination */}
      {filteredSongList.length > 0 ? (
        <Footer
          showPagination
          currentPage={currentPage}
          onNextPage={goToNextPage}
          onPrevPage={goToPreviousPage}
          hasNextPage={hasNextPage}
          isLoading={isFetching}
        />
      ) : null}
    </section>
  );
};

export default Home;
