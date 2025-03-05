/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import SearchBar from "@/components/index/SearchBar";
import type { Tag, Song, Sequencer } from "@prisma/client";
import SearchFilterTags from "@/components/index/SearchFilterTags";
import SearchBand from "@/components/index/SearchBand";
import SearchSongList from "@/components/index/SearchSongList";
import SearchAlbumList from "@/components/index/SearchAlbumList";
import SearchLoading from "@/components/index/SearchLoading";
import Image from "next/image";
import Footer from "@/components/layout/Footer";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useDebounce } from "@uidotdev/usehooks";

export type SongType = Song & { tags: Tag[]; file_sequencer: Sequencer[] };

const Home = () => {
  const [mounted, setMounted] = useState(false);
  const [filteredSongList, setFilteredSongList] = useState<SongType[]>([]);
  const [searchString, setSearchString] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [nextCursor, setnextCursor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [cursorStack, setCursorStack] = useState<string[]>([""]); // Stack to store cursors for previous pages
  const [results, setResults] = useState<{
    song: boolean;
    band: boolean;
    album: boolean;
  }>({ song: false, band: false, album: false });

  const debouncedSearchString = useDebounce(searchString, 500);

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
      if (debouncedSearchString)
        queryParams.set("search", debouncedSearchString);
      if (selectedKey) queryParams.set("key", selectedKey);
      if (selectedLanguage) queryParams.set("language", selectedLanguage);

      const res = await fetch(`/api/songs?${queryParams.toString()}`);
      const { items, hasMore }: { items: SongType[]; hasMore: boolean } =
        await res.json();

      setFilteredSongList(items);
      setHasNextPage(hasMore);
      setResults((prev) => ({
        ...prev,
        song: items.length > 0,
      }));
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
  }, [selectedKey, selectedLanguage, debouncedSearchString]);

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

  const getYoutubeVideoId = (youtubeUrl: string) => {
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
    const match = youtubeUrl.match(regex);
    return match ? match[1] : null;
  };

  return (
    <section className="relative z-0 flex w-full flex-col pb-[50px]">
      <div className="sticky top-[50px] z-10 flex justify-between border-b bg-white p-3 md:top-[70px] md:px-3">
        <div className="z-20 flex items-center justify-between gap-2">
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
        <div className="flex flex-col gap-3 p-3 md:flex-row">
          <div className="flex w-full flex-col gap-1.5 md:gap-3">
            <SearchBand
              setResults={setResults}
              searchString={debouncedSearchString}
            />
            {/* <SearchAlbum
              showAlbum={showAlbum}
              searchString={debouncedSearchString}
              songList={songList}
              filteredSongList={filteredSongList}
            /> */}
            <SearchSongList
              filteredSongList={filteredSongList}
              getYoutubeVideoId={getYoutubeVideoId}
              searchString={debouncedSearchString}
            />

            {!results.song && !results.band && !results.album && (
              <div className="flex h-[75dvh] flex-col items-center justify-center gap-3">
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
            searchString={debouncedSearchString}
            setResults={setResults}
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
