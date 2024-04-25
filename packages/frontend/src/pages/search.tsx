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
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("list");
  const [gridCol, setGridCol] = useState("grid-cols-1");
  const [songList, setSongList] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [activeTag, setActiveTag] = useState("");

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

  // const [showExtendedList, setShowExtendedList] = useState(true);
  // const [showBand, setShowBand] = useState(true);

  const [filteredBand, setFilteredBand] = useState<Song[]>([]);
  const [filteredAlbum, setFilteredAlbum] = useState<Song[]>([]);
  const [filteredSongList, setFilteredSongList] = useState<Song[]>([]);

  useMemo(() => {
    // const uniqueBandSet = new Set();
    // songList.forEach((items) => {
    //   if (items.original_band !== "") {
    //     uniqueBandSet.add(items.original_band);
    //   }
    // });
    // const uniqueBandList = [...uniqueBandSet] as string[];
    const filteredBand = songList.filter((items) => {
      return (
        items.original_band?.toLowerCase().trim() ===
        searchString.toLowerCase().trim()
      );
    });
    setFilteredBand(filteredBand);
  }, [songList, searchString]);

  useMemo(() => {
    // const uniqueAlbumSet = new Set();
    // songList.forEach((items) => {
    //   if (items.album !== "") {
    //     uniqueAlbumSet.add(items.album);
    //   }
    // });
    // const uniqueAlbumList = [...uniqueAlbumSet] as string[];
    const filteredAlbum = songList.filter((items) => {
      return (
        items.album &&
        items.album.toLowerCase().trim() === searchString.toLowerCase().trim()
      );
    });
    setFilteredAlbum(filteredAlbum);
  }, [songList, searchString]);

  useMemo(() => {
    const filteredSongList = songList.filter((items) => {
      const matchingName =
        items.name
          ?.toLowerCase()
          .trim()
          .includes(searchString.toLowerCase().trim()) ??
        items.alt_name
          ?.toLowerCase()
          .trim()
          .includes(searchString.toLowerCase().trim());

      const matchingBand = items.original_band
        ?.toLowerCase()
        .trim()
        .includes(searchString.toLowerCase().trim());
      return matchingName && matchingBand;
    });
    setFilteredSongList(filteredSongList);
  }, [songList, searchString]);

  useMemo(() => {
    console.log("Band", filteredBand);
    console.log("Album", filteredAlbum);
    console.log("Song", filteredSongList);
  }, [filteredBand, filteredAlbum, filteredSongList]);

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
        {/* <div className="grid w-[70px] grid-cols-2 gap-1">
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
        </div> */}
      </div>
      {/* <div className="grid grid-cols-1 gap-3 sm:hidden sm:p-3">
        <ListView songList={filteredSongList} isLoading={isLoading} />
      </div>
      <div className={`hidden gap-3 p-3 sm:grid ${gridCol}`}>
        {view === "list" ? (
          <ListView songList={filteredSongList} isLoading={isLoading} />
        ) : (
          <GalleryView songList={filteredSongList} isLoading={isLoading} />
        )}
      </div> */}
      <div className="flex border p-5">
        {/* left */}
        <div className="flex w-full flex-col gap-3 border p-5">
          {(filteredBand.length !== 0 || filteredAlbum.length !== 0) && (
            <>
              {filteredBand.length !== 0 ? (
                <>
                  <h1>Band</h1>
                  <div>{filteredBand[0]?.original_band}</div>
                  <hr />
                </>
              ) : (
                <>
                  <h1>Album</h1>
                  <div className="border p-5">{filteredAlbum[0]?.album}</div>
                  <hr />
                </>
              )}
            </>
          )}

          <div className="border p-5">
            {filteredSongList.map((items, i) => {
              return <div key={i}>{items.name}</div>;
            })}
          </div>
        </div>
        {/* right */}
        {(filteredBand.length !== 0 || filteredAlbum.length !== 0) && (
          <div className="w-5/12 border p-5">
            {filteredBand.length !== 0 ? <div>Band</div> : <div>Album</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
