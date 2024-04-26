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

  const [filteredSongList, setFilteredSongList] = useState<Song[]>([]);
  const [showBand, setShowBand] = useState<boolean | undefined>(false);
  const [showAlbum, setShowAlbum] = useState<boolean | undefined>(false);

  useMemo(() => {
    const filteredSongList = songList.filter((items) => {
      const songName = items.name?.concat(
        " ",
        items.alt_name ? items.alt_name : "",
      );
      const matchingSongName = songName!
        .toLowerCase()
        .replace(/ /g, "")
        .includes(searchString.toLowerCase().replace(/ /g, ""));
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
      </div>

      <div className="flex border p-5">
        {/* left */}
        <div className="flex w-full flex-col gap-3 border p-5">
          {/* Band */}
          {showBand && (
            <>
              <h1>Band</h1>
              <div>{filteredSongList[0]?.original_band}</div>
              <hr />
            </>
          )}
          {/* Album */}
          {showAlbum && !showBand && (
            <>
              <h1>Album</h1>
              <div className="border p-5">{filteredSongList[0]?.album}</div>
              <hr />
            </>
          )}
          {filteredSongList.map((items, i) => {
            return (
              <div key={i} className="border">
                <div>
                  {items.name} {items.alt_name}
                </div>
                <div>{items.original_band}</div>
                <div>{items.album}</div>
              </div>
            );
          })}
        </div>
        {/* right */}
        {showBand && (
          <div className="w-5/12 border p-5">
            <h1>Band</h1>
          </div>
        )}
        {showAlbum && !showBand && (
          <div className="w-5/12 border p-5">
            <h1>Album</h1>
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
