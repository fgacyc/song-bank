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

const Search = () => {
  const [view, setView] = useState("list");
  const [gridCol, setGridCol] = useState("grid-cols-1");
  const [songList, setSongList] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [mounted, setMounted] = useState(false);

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

  const filteredSongList = useMemo(() => {
    if (!searchString || searchString.toString() === "") {
      return songList;
    }

    const filteredSongs = songList.filter((song) => {
      const matchedName = song
        .name!.toLowerCase()
        .includes(searchString.toString().toLowerCase());
      const matchedAltName = song.alt_name
        ?.toLowerCase()
        .includes(searchString.toString().toLowerCase());
      return matchedName || matchedAltName;
    });
    return filteredSongs;
  }, [searchString, songList]);

  if (!mounted) return null;
  return (
    <>
      <div className="sticky top-[70px] z-10 justify-between border-b bg-white p-3 sm:flex md:flex lg:flex">
        <div className="flex items-center gap-3">
          <SearchBar
            searchString={searchString}
            setSearchString={setSearchString}
          />
          <FilterTags activeTag={activeTag} setActiveTag={setActiveTag} />
        </div>
        <div className="grid w-[70px] grid-cols-2 gap-1">
          <button
            className="hidden h-[30px] w-[30px] items-center justify-center rounded-md border sm:flex"
            onClick={() => {
              setView("list");
              setGridCol("grid-cols-1");
            }}
          >
            <CiGrid2H className="h-[20px] w-[20px]" />
          </button>
          <button
            className="hidden h-[30px] w-[30px] items-center justify-center rounded-md border sm:flex"
            onClick={() => {
              setView("gallery");
              setGridCol(
                "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5",
              );
            }}
          >
            <CiGrid41 className="h-[20px] w-[20px]" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:hidden sm:p-3">
        <ListView songList={filteredSongList} isLoading={isLoading} />
      </div>
      <div className={`hidden gap-3 p-3 sm:grid ${gridCol}`}>
        {view === "list" ? (
          <ListView songList={filteredSongList} isLoading={isLoading} />
        ) : (
          <GalleryView songList={filteredSongList} isLoading={isLoading} />
        )}
      </div>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
