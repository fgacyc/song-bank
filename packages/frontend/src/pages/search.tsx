import { useEffect, useState, type ReactElement } from "react";
import SearchBar from "@/components/search/SearchBar";
import FilterTags from "@/components/search/FilterTags";
import ListView from "@/components/search/ListView";
import GalleryView from "@/components/search/GalleryView";
import { CiGrid2H, CiGrid41 } from "react-icons/ci";
import Layout from "@/components/layout/Layout";

const Search = () => {
  const [view, setView] = useState("list");
  const [grid, setGrid] = useState("grid-cols-1");
  const [searchString, setSearchString] = useState("");
  const [songList, setSongList] = useState<SongListProps[]>([]);

  interface SongListProps {
    songName: string;
    artist: string;
    language: string;
    type: string;
    originalKey: string;
    imgSrc: string;
    imgAlt: string;
  }

  useEffect(() => {
    const loadSongList = async () => {
      try {
        const response = await fetch("/data/song-list.json");
        const data = (await response.json()) as SongListProps[];
        setSongList(data);
      } catch (error) {
        console.error("loadSongList: error", error);
      }
    };
    loadSongList()
      .then(() => {
        console.log("loadSongList: success");
      })
      .catch((error) => {
        console.error("loadSongList: error", error);
      });
  }, []);

  return (
    <>
      <div>
        <div className="sticky top-[70px] z-10 flex h-[50px] items-center justify-between bg-white px-3">
          <div className="flex items-center gap-3">
            <SearchBar
              searchString={searchString}
              setSearchString={setSearchString}
              songList={songList}
            />
            <FilterTags />
          </div>
          <div className="grid w-[70px] grid-cols-2 gap-1">
            <button
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md border"
              onClick={() => {
                setView("list");
                setGrid("grid-cols-1");
              }}
            >
              <CiGrid2H className="h-[20px] w-[20px]" />
            </button>
            <button
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md border"
              onClick={() => {
                setView("gallery");
                setGrid("grid-cols-5");
              }}
            >
              <CiGrid41 className="h-[20px] w-[20px]" />
            </button>
          </div>
        </div>
        <div className={`grid gap-3 p-3 ${grid}`}>
          {view === "list" ? (
            <ListView songList={songList} />
          ) : (
            <GalleryView songList={songList} />
          )}
        </div>
      </div>
    </>
  );
};

export default Search;

Search.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
